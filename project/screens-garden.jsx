// JARDINERO — Mon Jardin (plant list) screen
// emojiToOpenmojiUrl helper lives in tokens.jsx (window.emojiToOpenmojiUrl).

// Reusable emoji illustration with halo + drop-shadow.
// Priority: clay 3D render (PNG asset) → OpenMoji SVG → native emoji fallback.
function EmojiIllo({ emoji, size = 56, accent = '#a6e36b', bg, halo = true, ring = false, useOpenmoji = true }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const clayUrl = window.CLAY_RENDERS && window.CLAY_RENDERS[emoji];

  const ringStyle = ring ? {
    background: bg || `linear-gradient(135deg, rgba(255,255,255,0.04), rgba(0,0,0,0.18))`,
    border: `1px solid rgba(255,255,255,0.08)`,
  } : {
    background: bg || 'transparent',
  };

  let renderEmoji;
  let useHalo = halo;

  if (clayUrl && !imgFailed) {
    // Clay 3D render — image porte déjà son ombre, on garde un halo subtil pour le glow accent
    renderEmoji = (
      <img
        src={clayUrl}
        alt={emoji}
        onError={() => setImgFailed(true)}
        style={{
          width: size * 0.92,
          height: size * 0.92,
          objectFit: 'contain',
          position: 'relative',
          zIndex: 1,
          display: 'block',
        }}
      />
    );
  } else if (useOpenmoji) {
    renderEmoji = (
      <img
        src={window.emojiToOpenmojiUrl(emoji)}
        alt={emoji}
        onError={() => setImgFailed(true)}
        style={{
          width: size * 0.66, height: size * 0.66,
          filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.45)) drop-shadow(0 0 10px ${accent}55)`,
          position: 'relative',
          zIndex: 1,
          transform: 'translateY(-1px)',
          display: 'block',
        }}
      />
    );
  } else {
    renderEmoji = (
      <span style={{
        fontSize: size * 0.6,
        lineHeight: 1,
        filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.4)) drop-shadow(0 0 10px ${accent}55)`,
        position: 'relative',
        zIndex: 1,
        transform: 'translateY(-1px)',
      }}>{emoji}</span>
    );
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: size / 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
      flexShrink: 0,
      ...ringStyle,
    }}>
      {useHalo && (
        <div style={{
          position: 'absolute',
          inset: -size * 0.18,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}30 0%, ${accent}10 35%, transparent 65%)`,
          pointerEvents: 'none',
          filter: 'blur(4px)',
        }} />
      )}
      {renderEmoji}
    </div>
  );
}

function GardenScreen({ dir }) {
  return (
    <ScreenShell dir={dir} activeTab="garden" scroll title="Mon Jardin">
      {dir.key === 'foret' && <GardenForet dir={dir} />}
      {dir.key === 'editorial' && <GardenEditorial dir={dir} />}
      {dir.key === 'serre' && <GardenSerre dir={dir} />}
    </ScreenShell>
  );
}

// Mini progress ring
function Ring({ size = 38, stroke = 4, value, bg, fg, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={fg} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round" />
      </svg>
      {label && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, fontWeight: 600,
        }}>{label}</div>
      )}
    </div>
  );
}

// Sub-nav (Plantes / Arrosage / Voisines / Jardin 3D)
function GardenSubNav({ dir, active = 'plants', variant = 'foret' }) {
  const items = ['Plantes', 'Arrosage', 'Voisines', 'Jardin 3D'];
  if (variant === 'editorial') {
    return (
      <div style={{
        display: 'flex', gap: 14,
        borderBottom: `1px solid ${dir.border}`,
        marginBottom: 14,
        paddingBottom: 8,
      }}>
        {items.map((i, idx) => (
          <div key={i} style={{
            fontFamily: dir.mono, fontSize: 9.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: idx === 0 ? dir.accent : dir.inkMuted,
            fontWeight: idx === 0 ? 700 : 400,
            paddingBottom: 6, borderBottom: idx === 0 ? `1.5px solid ${dir.accent}` : 'none',
            marginBottom: -9,
          }}>{i}</div>
        ))}
      </div>
    );
  }
  if (variant === 'serre') {
    return (
      <div style={{
        background: dir.surface,
        borderRadius: 999,
        padding: 4,
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        boxShadow: dir.shadow,
        marginBottom: 14,
      }}>
        {items.map((i, idx) => (
          <div key={i} style={{
            padding: '8px 0',
            textAlign: 'center', fontSize: 10.5, fontWeight: 600,
            color: idx === 0 ? dir.accentInk : dir.inkMuted,
            background: idx === 0 ? dir.accent : 'transparent',
            borderRadius: 999,
          }}>{i}</div>
        ))}
      </div>
    );
  }
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${dir.border}`,
      borderRadius: 999,
      padding: 4,
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      marginBottom: 14,
    }}>
      {items.map((i, idx) => (
        <div key={i} style={{
          padding: '7px 0',
          textAlign: 'center', fontSize: 10.5, fontWeight: 500,
          color: idx === 0 ? dir.accent : dir.inkMuted,
          background: idx === 0 ? 'rgba(166,227,107,0.10)' : 'transparent',
          borderRadius: 999,
        }}>{i}</div>
      ))}
    </div>
  );
}

function GardenForet({ dir }) {
  return (
    <div style={{ padding: 14, paddingBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
        <div>
          <div style={{ fontFamily: dir.display, fontSize: 24, color: dir.accent }}>Mon jardin</div>
          <div style={{ fontSize: 11, color: dir.inkMuted, marginTop: 2 }}>4 plantes en cours</div>
        </div>
        <div style={{
          background: dir.accent, color: dir.accentInk,
          borderRadius: 999, padding: '7px 12px',
          fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>+ Ajouter</div>
      </div>

      {/* Progress */}
      <div style={{ margin: '14px 0', fontSize: 11 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: dir.inkMuted, marginBottom: 6 }}>
          <span>Progression saison</span>
          <span style={{ color: dir.accent, fontFamily: dir.mono }}>42%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: '42%', height: '100%', background: dir.accent, borderRadius: 3 }} />
        </div>
      </div>

      <GardenSubNav dir={dir} variant="foret" />

      {/* Plant cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {window.GARDEN.map(p => <PlantCardForet key={p.name} dir={dir} p={p} />)}
      </div>
    </div>
  );
}

function PlantCardForet({ dir, p }) {
  const progress = p.daysIn / p.daysTotal;
  return (
    <div style={{
      background: dir.surfaceGlass,
      border: `1px solid ${dir.border}`,
      borderRadius: dir.radius,
      padding: 12,
      display: 'flex', gap: 14, alignItems: 'center',
    }}>
      <EmojiIllo emoji={p.emoji} size={56} accent={dir.accent} ring bg={`linear-gradient(135deg, ${dir.surfaceAlt}, ${dir.bg})`} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}>{p.name}</div>
          <div style={{ fontSize: 10, color: dir.inkMuted, fontFamily: dir.mono }}>J+{p.daysIn}</div>
        </div>
        <div style={{ fontSize: 10.5, color: dir.inkMuted, marginTop: 2 }}>{p.loc}</div>

        {/* Progress segments */}
        <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i / 4 < progress ? dir.accent : 'rgba(255,255,255,0.08)',
            }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10 }}>
          <span style={{ color: dir.accent, fontWeight: 600 }}>● {p.stage}</span>
          <span style={{ color: dir.inkMuted }}>{p.next}</span>
        </div>
      </div>
    </div>
  );
}

function GardenEditorial({ dir }) {
  return (
    <div style={{ padding: '12px 18px 24px' }}>
      <div style={{ fontFamily: dir.mono, fontSize: 9.5, color: dir.accent, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        Le potager
      </div>
      <div style={{ fontFamily: dir.display, fontSize: 36, lineHeight: 0.95, letterSpacing: '-0.02em', marginTop: 8 }}>
        Mon <em style={{ fontStyle: 'italic' }}>jardin.</em>
      </div>
      <div style={{ fontSize: 12, color: dir.inkMuted, marginTop: 8 }}>
        Quatre variétés en cours · Saison en cours, 42%
      </div>

      <div style={{ marginTop: 18 }}>
        <GardenSubNav dir={dir} variant="editorial" />

        {window.GARDEN.map((p, idx) => (
          <div key={p.name} style={{
            display: 'flex', gap: 16,
            padding: '16px 0',
            borderBottom: `1px solid ${dir.border}`,
          }}>
            <div style={{
              width: 80, height: 80, flexShrink: 0,
              background: `repeating-linear-gradient(45deg, ${dir.surfaceAlt} 0 8px, ${dir.bg} 8px 16px)`,
            }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: dir.mono, fontSize: 9, color: dir.inkMuted, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                {String(idx + 1).padStart(2, '0')} · {p.loc}
              </div>
              <div style={{ fontFamily: dir.display, fontSize: 19, marginTop: 4, lineHeight: 1.1 }}>
                <em style={{ fontStyle: 'italic' }}>{p.name}</em>
              </div>
              <div style={{ fontSize: 11.5, color: dir.inkMuted, marginTop: 6, lineHeight: 1.4 }}>
                {p.stage} · J+{p.daysIn} sur {p.daysTotal} jours
              </div>
              <div style={{ marginTop: 8, height: 1, background: dir.border, position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, top: -1, height: 3,
                  width: `${(p.daysIn / p.daysTotal) * 100}%`, background: dir.accent,
                }} />
              </div>
              <div style={{ fontSize: 11, color: dir.warning, marginTop: 8, fontStyle: 'italic', fontFamily: dir.display }}>
                {p.next}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GardenSerre({ dir }) {
  return (
    <div style={{ padding: 14, paddingBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '4px 4px 0' }}>
        <div>
          <div style={{ fontFamily: dir.display, fontSize: 22 }}>Mon Jardin</div>
          <div style={{ fontSize: 11, color: dir.inkMuted, marginTop: 2 }}>4 plantes en cours</div>
        </div>
        <div style={{
          background: dir.accent, color: dir.accentInk,
          borderRadius: 999, padding: '9px 14px',
          fontSize: 12, fontWeight: 700,
        }}>+ Ajouter</div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 8, margin: '14px 0 12px' }}>
        <StatChipSerre dir={dir} icon="sprout" label="En cours" value="4" />
        <StatChipSerre dir={dir} icon="drop" label="À arroser" value="2" tint={dir.warning} />
        <StatChipSerre dir={dir} icon="basket" label="Prêt" value="1" />
      </div>

      <GardenSubNav dir={dir} variant="serre" />

      {/* 2-col plant cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {window.GARDEN.map(p => <PlantCardSerre key={p.name} dir={dir} p={p} />)}
      </div>
    </div>
  );
}

function StatChipSerre({ dir, icon, label, value, tint }) {
  const t = tint || dir.accent;
  return (
    <div style={{
      flex: 1,
      background: dir.surface,
      borderRadius: dir.radiusSm,
      padding: 10,
      boxShadow: dir.shadow,
    }}>
      <div style={{ color: t, marginBottom: 4 }}>
        <Glyph kind={icon} color="currentColor" size={14} />
      </div>
      <div style={{ fontFamily: dir.display, fontSize: 19, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9.5, color: dir.inkMuted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function PlantCardSerre({ dir, p }) {
  const progress = p.daysIn / p.daysTotal;
  return (
    <div style={{
      background: dir.surface,
      borderRadius: dir.radius,
      padding: 10,
      boxShadow: dir.shadow,
    }}>
      <div style={{
        height: 70, borderRadius: dir.radiusSm,
        background: `linear-gradient(135deg, ${dir.accent}25, ${dir.surfaceAlt})`,
        marginBottom: 10,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: -10, right: -10,
          width: 60, height: 60, borderRadius: 30,
          background: `radial-gradient(circle, ${dir.accent}66, transparent 70%)`,
        }} />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
      <div style={{ fontSize: 10, color: dir.inkMuted, marginTop: 1 }}>{p.loc}</div>
      <div style={{ marginTop: 8, height: 4, background: dir.surfaceAlt, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: dir.accent, borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10 }}>
        <span style={{ color: dir.accent, fontWeight: 600 }}>{p.stage}</span>
        <span style={{ color: dir.inkMuted, fontFamily: dir.mono }}>J+{p.daysIn}</span>
      </div>
    </div>
  );
}

Object.assign(window, { GardenScreen, EmojiIllo });
