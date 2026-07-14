// Génère les icônes PWA de Jardinero à partir du 🌱 OpenMoji, centré sur le
// fond réel de l'app (#16261b, token --jd-bg).
//
//   node scripts/gen-icons.mjs
//
// Produit dans public/icons/ :
//   - icon-192.png            (192×192)
//   - icon-512.png            (512×512)
//   - icon-512-maskable.png   (512×512, ~20% de marge pour la safe-zone Android)
//
// Source : scripts/sprout-openmoji.svg (OpenMoji 1F331, CC BY-SA 4.0).
import sharp from 'sharp'
import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const BG = '#16261b' // token --jd-bg
const sproutSvg = await readFile(resolve(__dirname, 'sprout-openmoji.svg'))

const outDir = resolve(root, 'public/icons')
await mkdir(outDir, { recursive: true })

// ratio = part de la largeur occupée par le 🌱 (le reste est de la marge)
async function makeIcon(file, size, ratio) {
  const inner = Math.round(size * ratio)
  const sprout = await sharp(sproutSvg, { density: 384 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  await sharp({
    create: { width: size, height: size, channels: 4, background: BG },
  })
    .composite([{ input: sprout, gravity: 'center' }])
    .png()
    .toFile(resolve(outDir, file))

  console.log(`✓ ${file} (${size}×${size}, 🌱 ${inner}px)`)
}

// Icônes normales : 🌱 large (~72% de la surface)
await makeIcon('icon-192.png', 192, 0.72)
await makeIcon('icon-512.png', 512, 0.72)
// Maskable : safe-zone Android → 🌱 plus petit (~56%) pour survivre au rognage circulaire
await makeIcon('icon-512-maskable.png', 512, 0.56)
