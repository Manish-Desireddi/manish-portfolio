import React, { Suspense, useMemo, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* ---------------------------------------------------------------------------
 * Neural3DBackground — Warm Charcoal + Amber + Gold
 * Double-helix with amber/gold node colors, warm particle drifts, and
 * golden fog. Matches a cinematic warm-dark video palette.
 * --------------------------------------------------------------------------- */

const HELIX_NODES     = 80
const HELIX_RADIUS    = 2.8
const HELIX_HEIGHT    = 22
const HELIX_TURNS     = 4
const BRIDGE_SKIP     = 4
const PARTICLE_COUNT  = 500
const ORBIT_COUNT     = 120

const tmpObj   = new THREE.Object3D()
const tmpColor = new THREE.Color()

const makeRng = (seed) => {
  let s = seed >>> 0
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 0xffffffff }
}

const buildHelixPositions = () => {
  const positions = new Float32Array(HELIX_NODES * 2 * 3)
  for (let i = 0; i < HELIX_NODES; i++) {
    const t = i / (HELIX_NODES - 1)
    const angle = t * Math.PI * 2 * HELIX_TURNS
    const y = (t - 0.5) * HELIX_HEIGHT

    positions[i * 3 + 0] = Math.cos(angle) * HELIX_RADIUS
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(angle) * HELIX_RADIUS

    const j = HELIX_NODES + i
    positions[j * 3 + 0] = Math.cos(angle + Math.PI) * HELIX_RADIUS
    positions[j * 3 + 1] = y
    positions[j * 3 + 2] = Math.sin(angle + Math.PI) * HELIX_RADIUS
  }
  return positions
}

const buildBridges = () => {
  const bridges = []
  for (let i = 0; i < HELIX_NODES; i += BRIDGE_SKIP) bridges.push([i, HELIX_NODES + i])
  return bridges
}

const buildBackbone = () => {
  const edges = []
  for (let i = 0; i < HELIX_NODES - 1; i++) {
    edges.push([i, i + 1])
    edges.push([HELIX_NODES + i, HELIX_NODES + i + 1])
  }
  return edges
}

// ── Helix Nodes ──────────────────────────────────────────────────────────────
const HelixNodes = ({ positions, pointer }) => {
  const ref = useRef()
  const totalNodes = HELIX_NODES * 2

  const phases = useMemo(() => {
    const rng = makeRng(424242)
    return Float32Array.from({ length: totalNodes }, () => rng() * Math.PI * 2)
  }, [totalNodes])

  useEffect(() => {
    if (!ref.current) return
    for (let i = 0; i < totalNodes; i++) {
      const t = (positions[i * 3 + 1] + HELIX_HEIGHT / 2) / HELIX_HEIGHT
      const isStrandB = i >= HELIX_NODES
      if (isStrandB) {
        // Warm amber strand: hue ~0.08 (amber-orange)
        tmpColor.setHSL(0.08 + t * 0.04, 0.75, 0.55)
      } else {
        // Gold strand: hue ~0.12 (gold-yellow)
        tmpColor.setHSL(0.12 - t * 0.04, 0.7, 0.5)
      }
      ref.current.setColorAt(i, tmpColor)
    }
    ref.current.instanceColor.needsUpdate = true
  }, [positions, totalNodes])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const cursorX = pointer.current.x * 6
    const cursorY = -pointer.current.y * 5

    for (let i = 0; i < totalNodes; i++) {
      const baseIdx = i % HELIX_NODES
      const frac = baseIdx / (HELIX_NODES - 1)
      const angle = frac * Math.PI * 2 * HELIX_TURNS + t * 0.3
      const isStrandB = i >= HELIX_NODES
      const phaseOff = isStrandB ? Math.PI : 0
      const y = (frac - 0.5) * HELIX_HEIGHT

      const dx = Math.cos(angle + phaseOff) * HELIX_RADIUS - cursorX
      const dy = y - cursorY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const warp = Math.max(0, 1 - dist / 5) * 1.5

      const nx = Math.cos(angle + phaseOff) * (HELIX_RADIUS + warp)
      const nz = Math.sin(angle + phaseOff) * (HELIX_RADIUS + warp)

      const pulse = 0.6 + 0.4 * Math.sin(t * 1.8 + phases[i])
      const scale = (0.06 + pulse * 0.04) * (1 + warp * 0.3)

      tmpObj.position.set(nx, y, nz)
      tmpObj.scale.setScalar(scale)
      tmpObj.updateMatrix()
      ref.current.setMatrixAt(i, tmpObj.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, totalNodes]}>
      <sphereGeometry args={[1, 10, 10]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0.9} />
    </instancedMesh>
  )
}

// ── Helix Edges ──────────────────────────────────────────────────────────────
const edgeVertex = /* glsl */ `
  attribute float aT;
  attribute float aEdgeIndex;
  attribute float aIsBridge;
  varying float vT;
  varying float vEdgeIndex;
  varying float vIsBridge;
  void main() {
    vT = aT;
    vEdgeIndex = aEdgeIndex;
    vIsBridge = aIsBridge;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const edgeFragment = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  varying float vT;
  varying float vEdgeIndex;
  varying float vIsBridge;
  void main() {
    float phase = fract(uTime * 0.2 + vEdgeIndex * 0.11);
    float pulse = smoothstep(0.0, 0.1, 1.0 - abs(vT - phase) * 5.0);
    float base = mix(0.12, 0.25, vIsBridge);
    float a = base + pulse * 0.5;
    // Amber for backbone, warm gold for bridges
    vec3 amberCol = vec3(0.96, 0.62, 0.15);
    vec3 goldCol  = vec3(0.85, 0.75, 0.35);
    vec3 col = mix(amberCol, goldCol, vIsBridge * 0.7 + vT * 0.3);
    gl_FragColor = vec4(col, a);
  }
`

const HelixEdges = ({ pointer }) => {
  const matRef = useRef()
  const posRef = useRef()

  const { backboneEdges, bridgeEdges } = useMemo(() => ({
    backboneEdges: buildBackbone(),
    bridgeEdges:   buildBridges(),
  }), [])

  const allEdges = useMemo(() => [...backboneEdges, ...bridgeEdges], [backboneEdges, bridgeEdges])

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const vertCount = allEdges.length * 2
    const verts      = new Float32Array(vertCount * 3)
    const tAttr      = new Float32Array(vertCount)
    const edgeIdAttr = new Float32Array(vertCount)
    const bridgeAttr = new Float32Array(vertCount)

    allEdges.forEach(([, ], i) => {
      tAttr[i * 2] = 0
      tAttr[i * 2 + 1] = 1
      edgeIdAttr[i * 2] = i
      edgeIdAttr[i * 2 + 1] = i
      const isBridge = i >= backboneEdges.length ? 1 : 0
      bridgeAttr[i * 2] = isBridge
      bridgeAttr[i * 2 + 1] = isBridge
    })

    g.setAttribute('position',   new THREE.BufferAttribute(verts, 3))
    g.setAttribute('aT',         new THREE.BufferAttribute(tAttr, 1))
    g.setAttribute('aEdgeIndex', new THREE.BufferAttribute(edgeIdAttr, 1))
    g.setAttribute('aIsBridge',  new THREE.BufferAttribute(bridgeAttr, 1))
    posRef.current = verts
    return g
  }, [allEdges, backboneEdges.length])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime()

    if (!posRef.current) return
    const t = clock.getElapsedTime()
    const verts = posRef.current

    allEdges.forEach(([a, b], i) => {
      const fracA = (a % HELIX_NODES) / (HELIX_NODES - 1)
      const fracB = (b % HELIX_NODES) / (HELIX_NODES - 1)
      const isStrandBA = a >= HELIX_NODES
      const isStrandBB = b >= HELIX_NODES
      const angleA = fracA * Math.PI * 2 * HELIX_TURNS + t * 0.3 + (isStrandBA ? Math.PI : 0)
      const angleB = fracB * Math.PI * 2 * HELIX_TURNS + t * 0.3 + (isStrandBB ? Math.PI : 0)

      verts[i * 6 + 0] = Math.cos(angleA) * HELIX_RADIUS
      verts[i * 6 + 1] = (fracA - 0.5) * HELIX_HEIGHT
      verts[i * 6 + 2] = Math.sin(angleA) * HELIX_RADIUS

      verts[i * 6 + 3] = Math.cos(angleB) * HELIX_RADIUS
      verts[i * 6 + 4] = (fracB - 0.5) * HELIX_HEIGHT
      verts[i * 6 + 5] = Math.sin(angleB) * HELIX_RADIUS
    })
    geometry.attributes.position.needsUpdate = true
  })

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  return (
    <lineSegments geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={edgeVertex}
        fragmentShader={edgeFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}

// ── Data Particles ───────────────────────────────────────────────────────────
const DataParticles = ({ pointer }) => {
  const ref = useRef()

  const { positions, seeds } = useMemo(() => {
    const rng = makeRng(909090)
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const sds = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = rng() * Math.PI * 2
      const radius = HELIX_RADIUS * (0.3 + rng() * 2.5)
      pos[i * 3 + 0] = Math.cos(angle) * radius
      pos[i * 3 + 1] = (rng() - 0.5) * HELIX_HEIGHT * 1.3
      pos[i * 3 + 2] = Math.sin(angle) * radius
      sds[i] = rng()
    }
    return { positions: pos, seeds: sds }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const arr = ref.current.geometry.attributes.position.array
    const cursorX = pointer.current.x * 6
    const cursorY = -pointer.current.y * 5

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3 + 1] += 0.008 + seeds[i] * 0.004
      const angle = t * 0.2 + seeds[i] * Math.PI * 2
      arr[i * 3 + 0] += Math.cos(angle) * 0.002
      arr[i * 3 + 2] += Math.sin(angle) * 0.002

      const cdx = arr[i * 3] - cursorX
      const cdy = arr[i * 3 + 1] - cursorY
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
      if (cdist < 3) {
        const repulse = (1 - cdist / 3) * 0.06
        arr[i * 3]     += (cdx / (cdist + 0.01)) * repulse
        arr[i * 3 + 1] += (cdy / (cdist + 0.01)) * repulse
      }

      if (arr[i * 3 + 1] > HELIX_HEIGHT * 0.7) {
        arr[i * 3 + 1] = -HELIX_HEIGHT * 0.7
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#f5c542"
        transparent
        opacity={0.40}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

// ── Orbit Ring ───────────────────────────────────────────────────────────────
const OrbitRing = () => {
  const ref = useRef()

  const { positions, speeds, radii, heights } = useMemo(() => {
    const rng = makeRng(777777)
    const pos = new Float32Array(ORBIT_COUNT * 3)
    const spd = new Float32Array(ORBIT_COUNT)
    const rad = new Float32Array(ORBIT_COUNT)
    const hts = new Float32Array(ORBIT_COUNT)
    for (let i = 0; i < ORBIT_COUNT; i++) {
      rad[i] = HELIX_RADIUS * (1.5 + rng() * 1.8)
      hts[i] = (rng() - 0.5) * HELIX_HEIGHT * 0.9
      spd[i] = 0.3 + rng() * 0.6
      const angle = rng() * Math.PI * 2
      pos[i * 3 + 0] = Math.cos(angle) * rad[i]
      pos[i * 3 + 1] = hts[i]
      pos[i * 3 + 2] = Math.sin(angle) * rad[i]
    }
    return { positions: pos, speeds: spd, radii: rad, heights: hts }
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const arr = ref.current.geometry.attributes.position.array
    for (let i = 0; i < ORBIT_COUNT; i++) {
      const angle = t * speeds[i] + i * 0.5
      arr[i * 3 + 0] = Math.cos(angle) * radii[i]
      arr[i * 3 + 1] = heights[i] + Math.sin(t * 0.5 + i) * 0.3
      arr[i * 3 + 2] = Math.sin(angle) * radii[i]
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d4a030"
        transparent
        opacity={0.30}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}

// ── Cursor Glow ──────────────────────────────────────────────────────────────
const CursorGlow = ({ pointer }) => {
  const ref = useRef()
  const targetPos = useRef(new THREE.Vector3(0, 0, 2))

  useFrame(() => {
    if (!ref.current) return
    const tx = pointer.current.x * 6
    const ty = -pointer.current.y * 5
    targetPos.current.x += (tx - targetPos.current.x) * 0.08
    targetPos.current.y += (ty - targetPos.current.y) * 0.08
    ref.current.position.copy(targetPos.current)
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.0, 16, 16]} />
      <meshBasicMaterial
        color="#f59e0b"
        transparent
        opacity={0.04}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// ── Camera ───────────────────────────────────────────────────────────────────
const CameraDriver = ({ pointer }) => {
  const { camera } = useThree()
  const base = useRef(new THREE.Vector3(0, 0, 18))

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const tx = Math.sin(t * 0.05) * 3 + pointer.current.x * 2.5
    const ty = Math.cos(t * 0.07) * 1.5 + pointer.current.y * 1.5
    base.current.x += (tx - base.current.x) * 0.04
    base.current.y += (ty - base.current.y) * 0.04
    camera.position.x = base.current.x
    camera.position.y = base.current.y
    camera.lookAt(0, 0, 0)
  })

  return null
}

// ── Scene ────────────────────────────────────────────────────────────────────
const Scene = ({ pointer }) => {
  const positions = useMemo(() => buildHelixPositions(), [])

  return (
    <>
      <color attach="background" args={['#0a0806']} />
      <fog attach="fog" args={['#0d0a06', 16, 35]} />
      <HelixNodes positions={positions} pointer={pointer} />
      <HelixEdges pointer={pointer} />
      <DataParticles pointer={pointer} />
      <OrbitRing />
      <CursorGlow pointer={pointer} />
      <CameraDriver pointer={pointer} />
    </>
  )
}

// ── Public Component ─────────────────────────────────────────────────────────
const Neural3DBackground = () => {
  const pointer = useRef({ x: 0, y: 0 })
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(mql.matches)
    sync()
    mql.addEventListener?.('change', sync)
    return () => mql.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1
      pointer.current.x = nx
      pointer.current.y = -ny
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-0 pointer-events-none"
      style={{
        background:
          'radial-gradient(ellipse at 50% 30%, #1a1408 0%, #0d0a06 55%, #080604 100%)',
      }}
    >
      <Canvas
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 18], fov: 50, near: 0.1, far: 60 }}
        frameloop={reducedMotion ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <Scene pointer={pointer} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Neural3DBackground
