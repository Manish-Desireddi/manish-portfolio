// Vercel Serverless Function: /api/feedback
// Supports Vercel Serverless Storage (Neon Serverless Postgres via DATABASE_URL and/or Upstash KV)
// Allows 1-click row deletion directly in the Vercel Dashboard Storage view.

import { neon } from '@neondatabase/serverless'

const PROFANITY_REGEX = /\b(fuck|shit|bitch|asshole|cunt|dick|prank|spam|scam)\b/i

let isTableInitialized = false

// In-memory fallback for local dev environments where DATABASE_URL or KV are not provisioned
const memoryStore = []

const initPostgresTable = async (sql) => {
  if (isTableInitialized) return
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS feedbacks (
        id text primary key,
        name text not null,
        role text not null default 'Visitor',
        company text default '',
        verified boolean default false,
        rating integer not null check (rating >= 1 and rating <= 5),
        message text not null,
        upvotes integer not null default 0,
        downvotes integer not null default 0,
        is_hidden boolean not null default false,
        created_at timestamptz not null default now()
      );
    `
    isTableInitialized = true
  } catch (err) {
    console.error('[API.FEEDBACK] Table initialization error:', err)
  }
}

// fallow-ignore-next-line complexity
const validateAndCleanPayload = (body) => {
  const { name, role, company, rating, message, website_url_hp } = body || {}
  if (website_url_hp) {
    return { ignored: true }
  }

  const cleanName = String(name || '').trim()
  const cleanRole = String(role || '').trim() || 'Visitor'
  const cleanCompany = String(company || '').trim()
  const cleanMsg = String(message || '').trim()
  const ratingNum = Math.min(5, Math.max(1, parseInt(rating, 10) || 5))

  if (!cleanName || !cleanMsg) {
    return { error: 'Name and message are required.', status: 400 }
  }

  if (cleanName.length > 50 || cleanMsg.length > 320 || cleanRole.length > 50 || cleanCompany.length > 50) {
    return { error: 'Payload exceeds allowed field character boundaries.', status: 400 }
  }

  if (PROFANITY_REGEX.test(cleanName) || PROFANITY_REGEX.test(cleanMsg)) {
    return { error: 'Transmission rejected by content safety heuristics.', status: 422 }
  }

  return {
    valid: true,
    data: {
      id: `fb-${Date.now()}`,
      name: cleanName,
      role: cleanRole,
      company: cleanCompany,
      verified: false,
      rating: ratingNum,
      message: cleanMsg,
      upvotes: 1,
      downvotes: 0,
      is_hidden: false,
      created_at: new Date().toISOString(),
    },
  }
}

const fetchKvFeedbacks = async (kvUrl, kvToken) => {
  const resp = await fetch(kvUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${kvToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['GET', 'feedbacks_v3']),
  })
  const data = await resp.json()
  return data?.result ? JSON.parse(data.result) : []
}

const saveKvFeedbacks = async (kvUrl, kvToken, list) => {
  await fetch(kvUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${kvToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(['SET', 'feedbacks_v3', JSON.stringify(list)]),
  })
}

// fallow-ignore-next-line complexity
const getFeedbacks = async (res, backend, ctx) => {
  if (backend === 'postgres') {
    await initPostgresTable(ctx.sql)
    const rows = await ctx.sql`
      SELECT id, name, role, company, verified, rating, message, upvotes, downvotes, is_hidden, created_at
      FROM feedbacks
      WHERE is_hidden = false
      ORDER BY upvotes DESC, created_at DESC
      LIMIT 50
    `
    return res.status(200).json(rows)
  }

  if (backend === 'kv') {
    const list = await fetchKvFeedbacks(ctx.kvUrl, ctx.kvToken)
    const visible = list.filter((item) => !item.is_hidden).sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    return res.status(200).json(visible)
  }

  return res.status(200).json(memoryStore.filter((f) => !f.is_hidden))
}

// fallow-ignore-next-line complexity
const createFeedback = async (res, backend, item, ctx) => {
  if (backend === 'postgres') {
    await initPostgresTable(ctx.sql)
    const [inserted] = await ctx.sql`
      INSERT INTO feedbacks (id, name, role, company, verified, rating, message, upvotes, downvotes, is_hidden, created_at)
      VALUES (${item.id}, ${item.name}, ${item.role}, ${item.company}, ${item.verified}, ${item.rating}, ${item.message}, ${item.upvotes}, ${item.downvotes}, ${item.is_hidden}, NOW())
      RETURNING *
    `
    return res.status(201).json(inserted)
  }

  if (backend === 'kv') {
    const current = await fetchKvFeedbacks(ctx.kvUrl, ctx.kvToken)
    const updated = [item, ...current]
    await saveKvFeedbacks(ctx.kvUrl, ctx.kvToken, updated)
    return res.status(201).json(item)
  }

  memoryStore.unshift(item)
  return res.status(201).json(item)
}

// fallow-ignore-next-line complexity
const patchFeedbackVote = async (res, backend, { id, up, down }, ctx) => {
  if (backend === 'postgres') {
    await initPostgresTable(ctx.sql)
    const [updated] = await ctx.sql`
      UPDATE feedbacks
      SET
        upvotes = GREATEST(0, upvotes + ${up}),
        downvotes = GREATEST(0, downvotes + ${down})
      WHERE id = ${id} AND is_hidden = false
      RETURNING *
    `
    if (!updated) {
      return res.status(404).json({ error: 'Feedback record not found.' })
    }
    return res.status(200).json({ success: true, feedback: updated })
  }

  if (backend === 'kv') {
    const current = await fetchKvFeedbacks(ctx.kvUrl, ctx.kvToken)
    let updatedRecord = null

    const updated = current.map((item) => {
      if (item.id !== id) return item
      updatedRecord = {
        ...item,
        upvotes: Math.max(0, (item.upvotes || 0) + up),
        downvotes: Math.max(0, (item.downvotes || 0) + down),
      }
      return updatedRecord
    })

    if (!updatedRecord) return res.status(404).json({ error: 'Feedback record not found.' })
    await saveKvFeedbacks(ctx.kvUrl, ctx.kvToken, updated)
    return res.status(200).json({ success: true, feedback: updatedRecord })
  }

  const found = memoryStore.find((f) => f.id === id)
  if (!found) return res.status(404).json({ error: 'Feedback record not found.' })
  found.upvotes = Math.max(0, (found.upvotes || 0) + up)
  found.downvotes = Math.max(0, (found.downvotes || 0) + down)
  return res.status(200).json({ success: true, feedback: found })
}

// fallow-ignore-next-line complexity
export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const databaseUrl = process.env.DATABASE_URL
  const kvUrl = process.env.KV_REST_API_URL
  const kvToken = process.env.KV_REST_API_TOKEN

  try {
    const backend = databaseUrl ? 'postgres' : kvUrl && kvToken ? 'kv' : 'memory'
    const sql = backend === 'postgres' ? neon(databaseUrl) : null
    const ctx = { sql, kvUrl, kvToken }

    if (req.method === 'GET') {
      return await getFeedbacks(res, backend, ctx)
    }

    if (req.method === 'POST') {
      const check = validateAndCleanPayload(req.body)
      if (check.ignored) return res.status(200).json({ success: true, ignored: true })
      if (check.error) return res.status(check.status).json({ error: check.error })
      return await createFeedback(res, backend, check.data, ctx)
    }

    if (req.method === 'PATCH') {
      const { id, upDelta, downDelta } = req.body || {}
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid feedback ID required.' })
      }
      const up = parseInt(upDelta, 10) || 0
      const down = parseInt(downDelta, 10) || 0
      return await patchFeedbackVote(res, backend, { id, up, down }, ctx)
    }

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err) {
    console.error('[API.FEEDBACK] Server Error:', err)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
