import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const STATUS_COLORS = {
  germination: 0xA8D5E2,
  croissance:  0x97C459,
  ready:       0xF9A825,
  default:     0xC8E89A,
}

function makePlotMesh(plot, gardenWidth, gardenHeight) {
  const group = new THREE.Group()

  // Soil bed
  const geo  = new THREE.BoxGeometry(plot.width, 0.15, plot.height)
  const mat  = new THREE.MeshLambertMaterial({ color: 0x8B5E3C })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(
    plot.x + plot.width  / 2 - gardenWidth  / 2,
    0.075,
    plot.y + plot.height / 2 - gardenHeight / 2,
  )
  group.add(mesh)

  // Border frame
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x6B4226 })
  const frameGeo = new THREE.BoxGeometry(plot.width + 0.06, 0.18, 0.06)
  const sides = [
    [0, plot.x + plot.width / 2 - gardenWidth / 2, plot.y - gardenHeight / 2],
    [0, plot.x + plot.width / 2 - gardenWidth / 2, plot.y + plot.height - gardenHeight / 2],
  ]
  sides.forEach(([, x, z]) => {
    const b = new THREE.Mesh(frameGeo, frameMat)
    b.position.set(x, 0.09, z)
    group.add(b)
  })
  const sideGeo = new THREE.BoxGeometry(0.06, 0.18, plot.height)
  ;[
    [plot.x - gardenWidth / 2,               plot.y + plot.height / 2 - gardenHeight / 2],
    [plot.x + plot.width - gardenWidth / 2,  plot.y + plot.height / 2 - gardenHeight / 2],
  ].forEach(([x, z]) => {
    const b = new THREE.Mesh(sideGeo, frameMat)
    b.position.set(x, 0.09, z)
    group.add(b)
  })

  return group
}

function makePlantMesh(plant, px, pz) {
  const color = STATUS_COLORS[plant.status] ?? STATUS_COLORS.default
  const group = new THREE.Group()
  group.position.set(px, 0.15, pz)

  // Stem
  const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.25, 6)
  const stemMat = new THREE.MeshLambertMaterial({ color: 0x5A7040 })
  const stem    = new THREE.Mesh(stemGeo, stemMat)
  stem.position.y = 0.125
  group.add(stem)

  // Canopy sphere
  const ballGeo = new THREE.SphereGeometry(0.14, 8, 6)
  const ballMat = new THREE.MeshLambertMaterial({ color })
  const ball    = new THREE.Mesh(ballGeo, ballMat)
  ball.position.y = 0.33
  group.add(ball)

  return group
}

function makeFence(gardenWidth, gardenHeight) {
  const group  = new THREE.Group()
  const postMat = new THREE.MeshLambertMaterial({ color: 0xC49A6C })
  const railMat = new THREE.MeshLambertMaterial({ color: 0xD4AA80 })

  const hw = gardenWidth  / 2
  const hh = gardenHeight / 2
  const step = 0.8

  // Posts along all 4 sides
  const sides = [
    { axis: 'x', from: -hw, to: hw, z: -hh },
    { axis: 'x', from: -hw, to: hw, z:  hh },
    { axis: 'z', from: -hh, to: hh, x: -hw },
    { axis: 'z', from: -hh, to: hh, x:  hw },
  ]

  sides.forEach(({ axis, from, to, z, x }) => {
    const count = Math.ceil((to - from) / step)
    for (let i = 0; i <= count; i++) {
      const t = from + i * step
      const postGeo = new THREE.BoxGeometry(0.06, 0.5, 0.06)
      const post    = new THREE.Mesh(postGeo, postMat)
      post.position.set(
        axis === 'x' ? t : (x ?? 0),
        0.25,
        axis === 'z' ? t : (z ?? 0),
      )
      group.add(post)
    }

    // Top rail
    const len = to - from
    const railGeo = axis === 'x'
      ? new THREE.BoxGeometry(len, 0.05, 0.05)
      : new THREE.BoxGeometry(0.05, 0.05, len)
    const rail = new THREE.Mesh(railGeo, railMat)
    rail.position.set(
      axis === 'x' ? (from + to) / 2 : (x ?? 0),
      0.45,
      axis === 'z' ? (from + to) / 2 : (z ?? 0),
    )
    group.add(rail)
  })

  return group
}

export default function GardenView3D({ garden, plants }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const w = el.clientWidth  || 360
    const h = el.clientHeight || 320

    // Scene
    const scene    = new THREE.Scene()
    scene.background = new THREE.Color(0xE8F5D0)
    scene.fog        = new THREE.Fog(0xE8F5D0, 15, 40)

    // Camera
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
    camera.position.set(0, garden.height * 1.2, garden.height * 1.4)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    el.appendChild(renderer.domElement)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
    const sun = new THREE.DirectionalLight(0xFFF4D4, 1.2)
    sun.position.set(5, 10, 5)
    sun.castShadow = true
    scene.add(sun)

    // Ground
    const groundGeo = new THREE.PlaneGeometry(garden.width + 2, garden.height + 2)
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xB5D585 })
    const ground    = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    scene.add(ground)

    // Plots
    garden.plots.forEach(plot => {
      scene.add(makePlotMesh(plot, garden.width, garden.height))

      // Plants in this plot
      const assigned = (plot.plants ?? [])
        .map(id => plants?.find(p => p.id === id))
        .filter(Boolean)

      assigned.forEach((plant, i) => {
        const cols  = Math.max(1, Math.floor(plot.width  / 0.35))
        const rows  = Math.max(1, Math.floor(plot.height / 0.35))
        const col   = i % cols
        const row   = Math.floor(i / cols) % rows
        const px    = plot.x + 0.2 + col * (plot.width  / cols)  - garden.width  / 2
        const pz    = plot.y + 0.2 + row * (plot.height / rows) - garden.height / 2
        scene.add(makePlantMesh(plant, px, pz))
      })
    })

    // Fence
    scene.add(makeFence(garden.width, garden.height))

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan  = false
    controls.minDistance = 2
    controls.maxDistance = 30
    controls.maxPolarAngle = Math.PI / 2 - 0.05

    // Resize observer
    const ro = new ResizeObserver(() => {
      const nw = el.clientWidth
      const nh = el.clientHeight
      renderer.setSize(nw, nh)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
    })
    ro.observe(el)

    // Animate
    let animId
    function animate() {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      controls.dispose()
      renderer.dispose()
      ro.disconnect()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
    }
  }, [garden, plants])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%', minHeight: 320 }}
    />
  )
}
