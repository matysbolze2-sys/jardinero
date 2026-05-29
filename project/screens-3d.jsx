// JARDINERO — Jardin 3D screen (priority redesign).
// Three completely different approaches:
//  Forêt: dark atmospheric iso scene with glow
//  Editorial: top-down architectural plan
//  Serre: bright cartoon iso with plant icons

const PARCELS_3D = [
  { id: 'A', label: 'Parcelle A', size: '2×1m', x: 0,   y: 0,   w: 2, h: 1,   crop: 'Tomate · Basilic', emoji: '🍅', count: 8, color: '#d04545' },
  { id: 'B', label: 'Parcelle B', size: '1×1m', x: 2.3, y: 0,   w: 1, h: 1,   crop: 'Salade',            emoji: '🥬', count: 4, color: '#7fb43a' },
  { id: 'C', label: 'Parcelle C', size: '2×0.6m', x: 0, y: 1.4, w: 2, h: 0.6, crop: 'Carotte · Radis',   emoji: '🥕', count: 12, color: '#dd8438' },
  { id: 'D', label: 'Parcelle D', size: '1×0.6m', x: 2.3, y: 1.4, w: 1, h: 0.6, crop: 'Aromates',         emoji: '🌿', count: 6, color: '#6fa050' },
];

// Iso projection helper
const PX = 30; // pixels per meter
const A30 = Math.PI / 6; // 30 degrees
function iso(x, y, z = 0, cx = 0, cy = 0) {
  return {
    x: cx + (x - y) * Math.cos(A30) * PX,
    y: cy + (x + y) * Math.sin(A30) * PX - z * PX,
  };
}

function Garden3DScreen({ dir }) {
  return (
    <ScreenShell dir={dir} activeTab="garden" scroll title="Jardin 3D">
      {dir.key === 'foret' && <ThreeDForet dir={dir} />}
      {dir.key === 'editorial' && <ThreeDEditorial dir={dir} />}
      {dir.key === 'serre' && <ThreeDSerre dir={dir} />}
    </ScreenShell>
  );
}

// ═══ FORÊT — Night iso, glowing plants ═══════════════════════════════════
function ThreeDForet({ dir }) {
  const cx = 145;
  const cy = 30;
  // Build parcel boxes
  const beds = PARCELS_3D.map(p => {
    const z = 0.18; // bed height
    const corners = {
      tl0: iso(p.x, p.y, 0, cx, cy),
      tr0: iso(p.x + p.w, p.y, 0, cx, cy),
      br0: iso(p.x + p.w, p.y + p.h, 0, cx, cy),
      bl0: iso(p.x, p.y + p.h, 0, cx, cy),
      tl1: iso(p.x, p.y, z, cx, cy),
      tr1: iso(p.x + p.w, p.y, z, cx, cy),
      br1: iso(p.x + p.w, p.y + p.h, z, cx, cy),
      bl1: iso(p.x, p.y + p.h, z, cx, cy),
    };
    return { p, corners };
  });

  return (
    <div style={{ padding: 14, paddingBottom: 24 }}>
      <div style={{ fontFamily: dir.display, fontSize: 22, color: dir.accent }}>Jardin · Vue 3D</div>
      <div style={{ fontSize: 11, color: dir.inkMuted, marginTop: 2 }}>4 parcelles · 3.2 × 1.9 m</div>

      <GardenSubNav dir={dir} variant="foret" />

      {/* 3D scene */}
      <div style={{
        background: `radial-gradient(ellipse at 50% 40%, #1a3024 0%, ${dir.bg} 80%)`,
        border: `1px solid ${dir.border}`,
        borderRadius: dir.radius,
        padding: 10,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Stars / fireflies */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[12, 28, 60, 90, 240, 260].map((p, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${20 + (p % 80)}%`, top: `${10 + (p % 40)}px`,
              width: 2, height: 2, borderRadius: 2,
              background: dir.accent, opacity: 0.4,
              boxShadow: `0 0 6px ${dir.accent}`,
            }} />
          ))}
        </div>

        <svg viewBox="-20 -10 300 180" style={{ width: '100%', height: 200, display: 'block' }}>
          <defs>
            <radialGradient id="soilGradF" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#3d2818" />
              <stop offset="100%" stopColor="#1c1209" />
            </radialGradient>
            <linearGradient id="woodTopF" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#5a3a22" />
              <stop offset="100%" stopColor="#3d2615" />
            </linearGradient>
            <linearGradient id="woodSideF" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#3a2410" />
              <stop offset="100%" stopColor="#1f1306" />
            </linearGradient>
            <filter id="glow"><feGaussianBlur stdDeviation="2" /></filter>
          </defs>

          {/* Ground */}
          {(() => {
            const g0 = iso(-0.3, -0.3, 0, cx, cy);
            const g1 = iso(3.6, -0.3, 0, cx, cy);
            const g2 = iso(3.6, 2.2, 0, cx, cy);
            const g3 = iso(-0.3, 2.2, 0, cx, cy);
            return (
              <polygon
                points={`${g0.x},${g0.y} ${g1.x},${g1.y} ${g2.x},${g2.y} ${g3.x},${g3.y}`}
                fill="#0c1a10" stroke="rgba(166,227,107,0.06)" strokeWidth="0.5"
              />
            );
          })()}

          {/* Beds */}
          {beds.map(({ p, corners: c }) => (
            <g key={p.id}>
              {/* Front side */}
              <polygon
                points={`${c.bl0.x},${c.bl0.y} ${c.br0.x},${c.br0.y} ${c.br1.x},${c.br1.y} ${c.bl1.x},${c.bl1.y}`}
                fill="url(#woodSideF)" stroke="#000" strokeWidth="0.3"
              />
              {/* Right side */}
              <polygon
                points={`${c.tr0.x},${c.tr0.y} ${c.br0.x},${c.br0.y} ${c.br1.x},${c.br1.y} ${c.tr1.x},${c.tr1.y}`}
                fill="#241509" stroke="#000" strokeWidth="0.3"
              />
              {/* Top (soil) */}
              <polygon
                points={`${c.tl1.x},${c.tl1.y} ${c.tr1.x},${c.tr1.y} ${c.br1.x},${c.br1.y} ${c.bl1.x},${c.bl1.y}`}
                fill="url(#soilGradF)" stroke="url(#woodTopF)" strokeWidth="1.5"
              />
              {/* Plants (luminous dots) */}
              {Array.from({ length: Math.min(p.count, 8) }).map((_, i) => {
                const px = p.x + (i % 4 + 0.5) * (p.w / 4);
                const py = p.y + (Math.floor(i / 4) + 0.5) * (p.h / 2);
                const pt = iso(px, py, 0.18 + 0.05, cx, cy);
                return (
                  <g key={i}>
                    <circle cx={pt.x} cy={pt.y} r="4" fill={dir.accent} opacity="0.25" filter="url(#glow)" />
                    <circle cx={pt.x} cy={pt.y} r="1.6" fill={dir.accent} />
                    <line x1={pt.x} y1={pt.y - 2} x2={pt.x} y2={pt.y - 6} stroke={dir.accent} strokeWidth="1" strokeLinecap="round" />
                  </g>
                );
              })}
            </g>
          ))}

          {/* Label tags floating above */}
          {beds.map(({ p, corners: c }) => {
            const mid = iso(p.x + p.w / 2, p.y + p.h / 2, 0.55, cx, cy);
            return (
              <g key={`l-${p.id}`}>
                <circle cx={mid.x} cy={mid.y - 2} r="9" fill={dir.bg} stroke={dir.accent} strokeOpacity="0.4" strokeWidth="0.6" />
                <text x={mid.x} y={mid.y + 2} textAnchor="middle" fontSize="11">{p.emoji}</text>
              </g>
            );
          })}
        </svg>

        {/* Overlay control */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          display: 'flex', gap: 4,
        }}>
          {['Iso', 'Top'].map((m, i) => (
            <div key={m} style={{
              padding: '4px 9px', fontSize: 9.5, fontFamily: dir.mono,
              background: i === 0 ? 'rgba(166,227,107,0.15)' : 'rgba(255,255,255,0.04)',
              color: i === 0 ? dir.accent : dir.inkMuted,
              border: `1px solid ${i === 0 ? dir.accent + '55' : dir.border}`,
              borderRadius: 6,
            }}>{m}</div>
          ))}
        </div>
      </div>

      {/* Parcels list */}
      <div style={{ marginTop: 16 }}>
        <SectionTitle dir={dir} kicker="Parcelles" action="Modifier →" />
        {PARCELS_3D.map(p => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px 10px 10px',
            background: dir.surfaceGlass,
            border: `1px solid ${dir.border}`,
            borderRadius: dir.radius,
            marginBottom: 6,
          }}>
            <EmojiIllo emoji={p.emoji} size={44} accent={dir.accent} ring bg={`linear-gradient(135deg, ${dir.surfaceAlt}, ${dir.bg})`} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{p.label} <span style={{ color: dir.inkMuted, fontFamily: dir.mono, fontSize: 10, fontWeight: 400, marginLeft: 4 }}>{p.size}</span></div>
              <div style={{ fontSize: 11, color: dir.inkMuted, marginTop: 1 }}>{p.crop}</div>
            </div>
            <div style={{
              padding: '4px 9px', fontSize: 10, fontFamily: dir.mono, fontWeight: 600,
              background: 'rgba(166,227,107,0.10)', color: dir.accent,
              borderRadius: 6,
            }}>{p.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ EDITORIAL — Top-down architectural plan ═══════════════════════════
function ThreeDEditorial({ dir }) {
  return (
    <div style={{ padding: '12px 18px 24px' }}>
      <div style={{ fontFamily: dir.mono, fontSize: 9.5, color: dir.accent, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        Plan du potager
      </div>
      <div style={{ fontFamily: dir.display, fontSize: 32, lineHeight: 0.95, letterSpacing: '-0.02em', marginTop: 8 }}>
        <em style={{ fontStyle: 'italic' }}>Le plan.</em>
      </div>

      <GardenSubNav dir={dir} variant="editorial" />

      {/* Plan view */}
      <div style={{
        marginTop: 4,
        background: dir.surface,
        border: `1px solid ${dir.ink}`,
        padding: '14px 14px 18px',
        position: 'relative',
        fontFamily: dir.mono,
      }}>
        {/* Plan title bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 8.5, color: dir.inkMuted, letterSpacing: '0.14em',
          textTransform: 'uppercase', borderBottom: `1px solid ${dir.border}`,
          paddingBottom: 6, marginBottom: 8,
        }}>
          <span>PLAN · 1:50</span>
          <span>N ↑</span>
        </div>

        <svg viewBox="0 0 280 160" style={{ width: '100%', height: 170, display: 'block' }}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">
              <path d="M 14 0 L 0 0 0 14" fill="none" stroke={dir.border} strokeWidth="0.4" />
            </pattern>
            <pattern id="diag" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke={dir.inkMuted} strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="280" height="160" fill="url(#grid)" />

          {/* Outer boundary */}
          <rect x="10" y="10" width="260" height="140" fill="none" stroke={dir.ink} strokeWidth="1.2" />

          {/* Parcels with linework */}
          {PARCELS_3D.map((p, idx) => {
            const x = 20 + p.x * 70;
            const y = 20 + p.y * 60;
            const w = p.w * 70;
            const h = p.h * 60;
            return (
              <g key={p.id}>
                <rect x={x} y={y} width={w} height={h}
                  fill="url(#diag)" fillOpacity="0.18"
                  stroke={dir.accent} strokeWidth="0.8" strokeDasharray="3 2" />
                {/* Label */}
                <text x={x + w / 2} y={y + h / 2 - 2}
                  textAnchor="middle" fontFamily={dir.display} fontSize="11"
                  fontStyle="italic" fill={dir.ink}>{p.id}</text>
                <text x={x + w / 2} y={y + h / 2 + 8}
                  textAnchor="middle" fontFamily={dir.mono} fontSize="6"
                  letterSpacing="1" fill={dir.inkMuted}>{p.size.toUpperCase()}</text>
                {/* Dimension lines */}
                {idx === 0 && (
                  <>
                    <line x1={x} y1={y - 6} x2={x + w} y2={y - 6} stroke={dir.inkMuted} strokeWidth="0.4" />
                    <line x1={x} y1={y - 8} x2={x} y2={y - 4} stroke={dir.inkMuted} strokeWidth="0.4" />
                    <line x1={x + w} y1={y - 8} x2={x + w} y2={y - 4} stroke={dir.inkMuted} strokeWidth="0.4" />
                    <text x={x + w / 2} y={y - 9} textAnchor="middle"
                      fontFamily={dir.mono} fontSize="6" fill={dir.inkMuted}>2.00 m</text>
                  </>
                )}
              </g>
            );
          })}

          {/* Path */}
          <line x1="170" y1="20" x2="170" y2="140" stroke={dir.inkMuted} strokeWidth="0.4" strokeDasharray="1 2" />

          {/* North arrow */}
          <g transform="translate(258, 22)">
            <circle r="9" fill="none" stroke={dir.ink} strokeWidth="0.6" />
            <polygon points="0,-7 -3,4 0,1 3,4" fill={dir.ink} />
            <text y="14" textAnchor="middle" fontFamily={dir.mono} fontSize="6" fill={dir.ink}>N</text>
          </g>

          {/* Scale bar */}
          <g transform="translate(14, 145)">
            <line x1="0" y1="0" x2="30" y2="0" stroke={dir.ink} strokeWidth="0.8" />
            <line x1="0" y1="-2" x2="0" y2="2" stroke={dir.ink} strokeWidth="0.8" />
            <line x1="30" y1="-2" x2="30" y2="2" stroke={dir.ink} strokeWidth="0.8" />
            <text x="15" y="8" textAnchor="middle" fontFamily={dir.mono} fontSize="5.5" fill={dir.inkMuted}>0 — 1 m</text>
          </g>
        </svg>
      </div>

      {/* Parcels list, editorial table */}
      <div style={{ marginTop: 22 }}>
        <SectionTitle dir={dir} kicker="Parcelles" />
        {PARCELS_3D.map((p, i) => (
          <div key={p.id} style={{
            display: 'flex', alignItems: 'baseline', gap: 14,
            padding: '12px 0',
            borderBottom: `1px solid ${dir.border}`,
          }}>
            <div style={{
              fontFamily: dir.display, fontSize: 22, fontStyle: 'italic',
              color: dir.accent, lineHeight: 1, minWidth: 24,
            }}>{p.id}.</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: dir.display, fontSize: 15 }}>{p.crop}</div>
              <div style={{ fontSize: 10.5, color: dir.inkMuted, marginTop: 2, fontFamily: dir.mono, letterSpacing: '0.04em' }}>
                {p.size} · {p.count} plants
              </div>
            </div>
            <div style={{ fontFamily: dir.mono, fontSize: 10, color: dir.inkMuted }}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ SERRE — Bright cartoon iso ═════════════════════════════════════════
function ThreeDSerre({ dir }) {
  const cx = 140;
  const cy = 35;
  const beds = PARCELS_3D.map(p => {
    const z = 0.22;
    return {
      p,
      corners: {
        tl0: iso(p.x, p.y, 0, cx, cy),
        tr0: iso(p.x + p.w, p.y, 0, cx, cy),
        br0: iso(p.x + p.w, p.y + p.h, 0, cx, cy),
        bl0: iso(p.x, p.y + p.h, 0, cx, cy),
        tl1: iso(p.x, p.y, z, cx, cy),
        tr1: iso(p.x + p.w, p.y, z, cx, cy),
        br1: iso(p.x + p.w, p.y + p.h, z, cx, cy),
        bl1: iso(p.x, p.y + p.h, z, cx, cy),
      },
    };
  });

  return (
    <div style={{ padding: 14, paddingBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontFamily: dir.display, fontSize: 22 }}>Jardin 3D</div>
          <div style={{ fontSize: 11, color: dir.inkMuted, marginTop: 2 }}>4 parcelles · 6.0 m²</div>
        </div>
        <div style={{
          background: dir.surface, borderRadius: 999,
          padding: '6px 12px', fontSize: 10.5, fontWeight: 600,
          color: dir.accent, boxShadow: dir.shadow,
        }}>+ Parcelle</div>
      </div>

      <div style={{ marginTop: 12 }}>
        <GardenSubNav dir={dir} variant="serre" />
      </div>

      {/* 3D scene */}
      <div style={{
        background: `linear-gradient(180deg, #cfe5c2 0%, #aed197 100%)`,
        borderRadius: dir.radius,
        padding: 10,
        boxShadow: dir.shadow,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <svg viewBox="-20 -10 300 180" style={{ width: '100%', height: 200, display: 'block' }}>
          <defs>
            <linearGradient id="soilGradS" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#5a3a22" />
              <stop offset="100%" stopColor="#3d2615" />
            </linearGradient>
            <linearGradient id="woodSideS" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#c89866" />
              <stop offset="100%" stopColor="#8c6234" />
            </linearGradient>
            <linearGradient id="woodTopS" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#e0b079" />
              <stop offset="100%" stopColor="#a8784a" />
            </linearGradient>
          </defs>

          {/* Ground (grass) */}
          {(() => {
            const g0 = iso(-0.4, -0.4, 0, cx, cy);
            const g1 = iso(3.7, -0.4, 0, cx, cy);
            const g2 = iso(3.7, 2.3, 0, cx, cy);
            const g3 = iso(-0.4, 2.3, 0, cx, cy);
            return (
              <polygon
                points={`${g0.x},${g0.y} ${g1.x},${g1.y} ${g2.x},${g2.y} ${g3.x},${g3.y}`}
                fill="#9bc684" stroke="#7da569" strokeWidth="0.8"
              />
            );
          })()}

          {/* Beds */}
          {beds.map(({ p, corners: c }) => (
            <g key={p.id}>
              {/* Front side - wood */}
              <polygon
                points={`${c.bl0.x},${c.bl0.y} ${c.br0.x},${c.br0.y} ${c.br1.x},${c.br1.y} ${c.bl1.x},${c.bl1.y}`}
                fill="url(#woodSideS)" stroke="#6b4a26" strokeWidth="0.5"
              />
              {/* Right side */}
              <polygon
                points={`${c.tr0.x},${c.tr0.y} ${c.br0.x},${c.br0.y} ${c.br1.x},${c.br1.y} ${c.tr1.x},${c.tr1.y}`}
                fill="#8c6234" stroke="#6b4a26" strokeWidth="0.5"
              />
              {/* Top (soil) */}
              <polygon
                points={`${c.tl1.x},${c.tl1.y} ${c.tr1.x},${c.tr1.y} ${c.br1.x},${c.br1.y} ${c.bl1.x},${c.bl1.y}`}
                fill="url(#soilGradS)" stroke="url(#woodTopS)" strokeWidth="2"
              />

              {/* Plants - colorful little blobs */}
              {Array.from({ length: Math.min(p.count, 8) }).map((_, i) => {
                const px = p.x + (i % 4 + 0.5) * (p.w / 4);
                const py = p.y + (Math.floor(i / 4) + 0.5) * (p.h / 2);
                const pt = iso(px, py, 0.22, cx, cy);
                const pt2 = iso(px, py, 0.4, cx, cy);
                return (
                  <g key={i}>
                    {/* stem */}
                    <line x1={pt.x} y1={pt.y} x2={pt2.x} y2={pt2.y} stroke="#3a7039" strokeWidth="1.2" strokeLinecap="round" />
                    {/* fruit */}
                    <circle cx={pt2.x} cy={pt2.y} r="2.5" fill={p.color} stroke="#fff" strokeWidth="0.4" />
                  </g>
                );
              })}

              {/* Floating label callout */}
              {(() => {
                const mid = iso(p.x + p.w / 2, p.y + p.h / 2, 0.65, cx, cy);
                return (
                  <g>
                    <rect x={mid.x - 18} y={mid.y - 6} width="36" height="12" rx="6"
                      fill="#fff" stroke="rgba(0,0,0,0.08)" strokeWidth="0.4" />
                    <text x={mid.x} y={mid.y + 2.5} textAnchor="middle"
                      fontFamily="Inter, sans-serif" fontSize="6.5" fontWeight="700"
                      fill={p.color}>{p.id} · {p.count}</text>
                  </g>
                );
              })()}
            </g>
          ))}
        </svg>

        {/* View toggle */}
        <div style={{
          position: 'absolute', bottom: 14, left: 14,
          background: '#fff', borderRadius: 999, padding: 3,
          display: 'flex', gap: 0, boxShadow: dir.shadow,
          fontSize: 10, fontWeight: 600,
        }}>
          {['3D', 'Plan'].map((m, i) => (
            <div key={m} style={{
              padding: '5px 11px',
              background: i === 0 ? dir.accent : 'transparent',
              color: i === 0 ? dir.accentInk : dir.inkMuted,
              borderRadius: 999,
            }}>{m}</div>
          ))}
        </div>
      </div>

      {/* Parcels list */}
      <div style={{ marginTop: 14 }}>
        <SectionTitle dir={dir} kicker="Parcelles" action="Modifier" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PARCELS_3D.map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12,
              background: dir.surface,
              borderRadius: dir.radius,
              boxShadow: dir.shadow,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11,
                background: p.color,
                color: '#fff',
                fontFamily: dir.display, fontSize: 17, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>{p.id}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.crop}</div>
                <div style={{ fontSize: 11, color: dir.inkMuted, marginTop: 1 }}>{p.size} · {p.count} plants</div>
              </div>
              <div style={{ fontSize: 11, color: dir.accent, fontWeight: 600 }}>Gérer →</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Garden3DScreen });
