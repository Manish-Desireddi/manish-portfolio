// Vercel Serverless Function: /api/feedback
// Backed exclusively by Neon Serverless Postgres via FEEDBACK_PORTFOLIO_DATABASE_URL or DATABASE_URL
// Allows 1-click row deletion directly in the Vercel Dashboard Storage view.

import { neon } from '@neondatabase/serverless'

const PROFANITY_REGEX = /\b(fuck|shit|bitch|asshole|cunt|dick|prank|spam|scam)\b/i

let isTableInitialized = false

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

// fallow-ignore-next-line complexity
export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const connectionString =
    process.env.FEEDBACK_PORTFOLIO_DATABASE_URL ||
    process.env.FEEDBACK_PORTFOLIO_POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL

  if (!connectionString) {
    return res.status(503).json({
      error: 'Database service unavailable. Connection string not configured.',
    })
  }

  try {
    const sql = neon(connectionString)
    await initPostgresTable(sql)

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT id, name, role, company, verified, rating, message, upvotes, downvotes, is_hidden, created_at
        FROM feedbacks
        WHERE is_hidden = false
        ORDER BY (upvotes - downvotes) DESC, created_at DESC
        LIMIT 50
      `
      return res.status(200).json(rows)
    }

    if (req.method === 'POST') {
      const check = validateAndCleanPayload(req.body)
      if (check.ignored) return res.status(200).json({ success: true, ignored: true })
      if (check.error) return res.status(check.status).json({ error: check.error })

      const item = check.data
      const customCreatedAt = req.body?.created_at ? new Date(req.body.created_at) : null
      const validCreatedAt =
        customCreatedAt && !isNaN(customCreatedAt.getTime()) ? customCreatedAt.toISOString() : null

      const [inserted] = await sql`
        INSERT INTO feedbacks (id, name, role, company, verified, rating, message, upvotes, downvotes, is_hidden, created_at)
        VALUES (
          ${item.id},
          ${item.name},
          ${item.role},
          ${item.company},
          ${item.verified},
          ${item.rating},
          ${item.message},
          ${item.upvotes},
          ${item.downvotes},
          ${item.is_hidden},
          ${validCreatedAt ? validCreatedAt : sql`NOW()`}
        )
        RETURNING *
      `
      return res.status(201).json(inserted)
    }

    if (req.method === 'PATCH') {
      const { id, upDelta, downDelta } = req.body || {}
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Valid feedback ID required.' })
      }
      const up = parseInt(upDelta, 10) || 0
      const down = parseInt(downDelta, 10) || 0

      const [updated] = await sql`
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

    return res.status(405).json({ error: 'Method Not Allowed' })
  } catch (err) {
    console.error('[API.FEEDBACK] Neon Postgres Query Error:', err)
    return res.status(500).json({ error: 'Internal Server Error: Database operation failed.' })
  }
}
