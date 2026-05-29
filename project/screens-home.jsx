// JARDINERO — Mobile screen mocks for 3 directions
// Each screen takes `dir` (token object). Width 320 × height 680.
// Renders chrome (status bar + bottom tabs) + body content.

// ─── Shell ───────────────────────────────────────────────────────────────
function ScreenShell({ dir, activeTab = 'home', children, scroll = false, title }) {
  return (
    <div data-screen-label={title} style={{
      width: '100%',
      height: '100%',
      background: dir.bg,
      color: dir.ink,
      fontFamily: dir.sans,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <StatusBar dir={dir} />
      <div style={{
        flex: 1,
        overflow: scroll ? 'auto' : 'hidden',
        position: 'relative',
      }}>
        {children}
      </div>
      <BottomTabs dir={dir} active={activeTab} />
    </div>
  );
}

function StatusBar({ dir }) {
  return (
    <div style={{
      height: 28,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 18px',
      fontSize: 11,
      fontWeight: 600,
      color: dir.ink,
      fontVariantNumeric: 'tabular-nums',
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <span style={{ display: 'inline-block', width: 14, height: 7, borderRadius: 2, border: `1px solid ${dir.ink}`, opacity: 0.7 }}>
          <span style={{ display: 'block', width: '70%', height: '100%', background: dir.ink, borderRadius: 1 }} />
        </span>
      </span>
    </div>
  );
}

function BottomTabs({ dir, active }) {
  const tabs = window.TABS;

  // 3 dir-specific tab bar treatments
  if (dir.key === 'foret') {
    return (
      <div style={{
        height: 64,
        background: 'rgba(13,22,15,0.85)',
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${dir.border}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        flexShrink: 0,
      }}>
        {tabs.map(t => (
          <div key={t.id} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            color: active === t.id ? dir.accent : dir.inkMuted,
          }}>
            <TabIcon kind={t.id} color="currentColor" />
            <div style={{ fontSize: 9.5, fontWeight: active === t.id ? 600 : 400 }}>{t.label}</div>
          </div>
        ))}
      </div>
    );
  }

  if (dir.key === 'editorial') {
    return (
      <div style={{
        height: 56,
        borderTop: `1px solid ${dir.border}`,
        background: dir.bg,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        flexShrink: 0,
      }}>
        {tabs.map(t => (
          <div key={t.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: active === t.id ? dir.accent : dir.inkMuted,
            fontFamily: dir.display,
            fontSize: 12,
            fontStyle: active === t.id ? 'italic' : 'normal',
            position: 'relative',
          }}>
            {t.label}
            {active === t.id && <div style={{ position: 'absolute', top: 0, left: '30%', right: '30%', height: 1, background: dir.accent }} />}
          </div>
        ))}
      </div>
    );
  }

  // serre — floating pill
  return (
    <div style={{ padding: 10, flexShrink: 0 }}>
      <div style={{
        background: dir.surface,
        borderRadius: 999,
        boxShadow: dir.shadow,
        border: `1px solid ${dir.border}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        padding: 4,
      }}>
        {tabs.map(t => (
          <div key={t.id} style={{
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            background: active === t.id ? dir.accent : 'transparent',
            color: active === t.id ? dir.accentInk : dir.inkMuted,
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 600,
          }}>
            <TabIcon kind={t.id} color="currentColor" />
            {active === t.id && <span>{t.label}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function TabIcon({ kind, color = 'currentColor' }) {
  const s = { width: 16, height: 16, fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'home') return <svg viewBox="0 0 24 24" style={s}><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg>;
  if (kind === 'advisor') return <svg viewBox="0 0 24 24" style={s}><path d="M4 5h16v11H8l-4 4z" /></svg>;
  if (kind === 'calendar') return <svg viewBox="0 0 24 24" style={s}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></svg>;
  if (kind === 'garden') return <svg viewBox="0 0 24 24" style={s}><path d="M12 21v-7" /><path d="M12 14c-3 0-5-3-5-6 2 0 5 1 5 6z" /><path d="M12 14c3 0 5-3 5-6-2 0-5 1-5 6z" /></svg>;
  return null;
}

// ─── Cloud / Weather icons ────────────────────────────────────────────────
function WeatherIcon({ kind, color = 'currentColor', size = 18 }) {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'sun-cloud') return (
    <svg viewBox="0 0 24 24" style={s}>
      <circle cx="9" cy="9" r="3" />
      <path d="M9 3v1M9 14v1M3 9h1M14 9h1M5.4 5.4l.7.7M12.6 5.4l-.7.7" />
      <path d="M8 17a4 4 0 014-4 4 4 0 014 4h2a3 3 0 110 6H8a3 3 0 010-6z" />
    </svg>
  );
  if (kind === 'rain') return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M6 14a4 4 0 014-4 4 4 0 014-4 4 4 0 014 4 3 3 0 110 6H7a3 3 0 010-6" />
      <path d="M9 21v-2M13 21v-3M17 21v-2" />
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" style={s}>
      <path d="M6 16a4 4 0 014-4 4 4 0 014-4 4 4 0 014 4 3 3 0 110 6H7a3 3 0 010-6" />
    </svg>
  );
}

// Small leaf/sprout glyph used across screens
function Glyph({ kind, color, size = 16 }) {
  const s = { width: size, height: size, fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (kind === 'sprout') return <svg viewBox="0 0 24 24" style={s}><path d="M12 21v-7" /><path d="M12 14c-3 0-5-2-5-5 2 0 5 .5 5 5z" /><path d="M12 14c3 0 5-2 5-5-2 0-5 .5-5 5z" /></svg>;
  if (kind === 'basket') return <svg viewBox="0 0 24 24" style={s}><path d="M4 10h16l-2 9H6z" /><path d="M8 10l3-5M16 10l-3-5" /></svg>;
  if (kind === 'sun') return <svg viewBox="0 0 24 24" style={s}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" /></svg>;
  if (kind === 'drop') return <svg viewBox="0 0 24 24" style={s}><path d="M12 3c4 5 6 9 6 12a6 6 0 11-12 0c0-3 2-7 6-12z" /></svg>;
  if (kind === 'check') return <svg viewBox="0 0 24 24" style={s}><path d="M4 12l5 5 11-11" /></svg>;
  if (kind === 'pin') return <svg viewBox="0 0 24 24" style={s}><path d="M12 21s-7-7-7-12a7 7 0 0114 0c0 5-7 12-7 12z" /><circle cx="12" cy="9" r="2" /></svg>;
  if (kind === 'arrow') return <svg viewBox="0 0 24 24" style={s}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
  return null;
}

// ═══ ACCUEIL ════════════════════════════════════════════════════════════
function HomeScreen({ dir }) {
  return (
    <ScreenShell dir={dir} activeTab="home" scroll title="Accueil">
      {dir.key === 'foret' && <HomeForet dir={dir} />}
      {dir.key === 'editorial' && <HomeEditorial dir={dir} />}
      {dir.key === 'serre' && <HomeSerre dir={dir} />}
    </ScreenShell>
  );
}

function HomeForet({ dir }) {
  return (
    <div style={{ padding: 14, paddingBottom: 24 }}>
      {/* Hero with photo placeholder + glass content */}
      <div style={{
        borderRadius: dir.radius,
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 14,
        height: 180,
        background: `linear-gradient(135deg, #1e3a24 0%, #0d160f 70%), radial-gradient(circle at 70% 30%, ${dir.accent} 0%, transparent 50%)`,
        backgroundBlendMode: 'overlay',
      }}>
        {/* Leaf placeholder layer */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 80% 110%, #2d5230 0%, transparent 60%), radial-gradient(ellipse at 20% -10%, #1a4022 0%, transparent 50%)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          padding: 18,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: dir.mono, fontSize: 9.5, letterSpacing: '0.18em', color: dir.accent, textTransform: 'uppercase' }}>
              Bonjour Léa
            </div>
            <div style={{ fontFamily: dir.display, fontSize: 26, fontWeight: 500, marginTop: 6, letterSpacing: '-0.01em', lineHeight: 1.05 }}>
              Mai au <em style={{ fontStyle: 'italic', color: dir.accent }}>potager</em>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8, fontSize: 11, color: dir.inkMuted }}>
              <Glyph kind="pin" color={dir.inkMuted} size={12} />
              Sud-Ouest · Bordeaux
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      <div style={{
        background: 'rgba(240,184,108,0.12)',
        border: `1px solid rgba(240,184,108,0.3)`,
        borderRadius: dir.radius,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 14,
      }}>
        <Glyph kind="sun" color={dir.warning} size={18} />
        <div style={{ fontSize: 12, color: dir.warning, lineHeight: 1.3 }}>
          <strong>4 jours sans pluie</strong> — pensez à arroser
        </div>
      </div>

      {/* Weather strip */}
      <div style={{
        background: dir.surfaceGlass,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${dir.border}`,
        borderRadius: dir.radius,
        padding: 14,
        marginBottom: 18,
      }}>
        <div style={{ fontFamily: dir.mono, fontSize: 9, color: dir.inkMuted, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
          Météo 7 jours
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
          {window.WEATHER.map((w, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '6px 2px',
              borderRadius: 8,
              background: i === 0 ? 'rgba(166,227,107,0.12)' : 'transparent',
              border: i === 0 ? `1px solid rgba(166,227,107,0.25)` : '1px solid transparent',
            }}>
              <div style={{ fontSize: 9, color: dir.inkMuted, marginBottom: 4 }}>{w.d}</div>
              <div style={{ display: 'flex', justifyContent: 'center', color: w.kind === 'rain' ? dir.accent : dir.ink }}>
                <WeatherIcon kind={w.kind} color="currentColor" size={16} />
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 4 }}>{w.t}°</div>
              <div style={{ fontSize: 9, color: dir.inkMuted }}>{w.l}°</div>
              {w.rain && <div style={{ fontSize: 8, color: dir.accent, fontFamily: dir.mono, marginTop: 1 }}>{w.rain}mm</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Section: aujourd'hui */}
      <SectionTitle dir={dir} kicker="Aujourd'hui dans ton jardin" />
      <div style={{
        background: dir.surfaceGlass,
        border: `1px solid ${dir.border}`,
        borderRadius: dir.radius,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 18,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `linear-gradient(135deg, ${dir.accent}, ${dir.accentDim})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Glyph kind="sprout" color={dir.accentInk} size={22} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>2 en germination</div>
          <div style={{ fontSize: 11, color: dir.inkMuted, marginTop: 2 }}>Surveille l'humidité du sol</div>
        </div>
        <Glyph kind="arrow" color={dir.inkMuted} size={16} />
      </div>

      {/* À semer */}
      <SectionTitle dir={dir} kicker="À semer en mai" action="Voir le calendrier →" />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {[['Courgette','🥒'], ['Haricot','🫘'], ['Concombre','🥒'], ['Tomate','🍅']].map(([v, e]) => (
          <Chip key={v} dir={dir} emoji={e}>{v}</Chip>
        ))}
      </div>

      {/* À récolter */}
      <SectionTitle dir={dir} kicker="À récolter en mai" action="Mon jardin →" />
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
        {[['Salade','🥬'], ['Radis','🥬'], ['Épinard','🌿']].map(([v, e]) => (
          <Chip key={v} dir={dir} emoji={e}>{v}</Chip>
        ))}
      </div>

      {/* Tâches */}
      <SectionTitle dir={dir} kicker="Cette semaine au jardin" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {['Biner la terre entre les rangs', 'Semer en godets et protéger des gelées'].map((t, i) => (
          <div key={i} style={{
            background: dir.surfaceGlass,
            border: `1px solid ${dir.border}`,
            borderRadius: dir.radiusSm,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 12,
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: 5,
              border: `1.5px solid ${dir.accent}`,
              flexShrink: 0,
            }} />
            <div style={{ lineHeight: 1.35 }}>{t}</div>
          </div>
        ))}
        <div style={{ fontSize: 10, color: dir.inkMuted, textAlign: 'right', fontFamily: dir.mono, marginTop: 4 }}>
          0/2 · remise à zéro chaque lundi
        </div>
      </div>
    </div>
  );
}

function HomeEditorial({ dir }) {
  return (
    <div style={{ padding: '0 18px 24px' }}>
      {/* Header — magazine cover style */}
      <div style={{ paddingTop: 12, paddingBottom: 18, borderBottom: `1px solid ${dir.border}` }}>
        <div style={{ fontFamily: dir.mono, fontSize: 9.5, color: dir.accent, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Numéro 05 · Mai
        </div>
        <div style={{ fontFamily: dir.display, fontSize: 38, lineHeight: 0.95, letterSpacing: '-0.02em', marginTop: 8 }}>
          Mai au<br /><em style={{ fontStyle: 'italic' }}>potager.</em>
        </div>
        <div style={{ fontSize: 12, color: dir.inkMuted, marginTop: 10, lineHeight: 1.45 }}>
          Sud-Ouest, Bordeaux — Saints de Glace passés. On peut tout planter dehors.
        </div>
      </div>

      {/* Photo full-bleed placeholder */}
      <div style={{
        margin: '18px -18px 18px',
        height: 200,
        background: `repeating-linear-gradient(45deg, ${dir.surfaceAlt} 0 12px, ${dir.bg} 12px 24px)`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: dir.mono, fontSize: 10, color: dir.inkMuted, letterSpacing: '0.14em', textTransform: 'uppercase',
        }}>
          [ photo · jardin matinal ]
        </div>
      </div>

      {/* Alert */}
      <div style={{
        borderLeft: `3px solid ${dir.warning}`,
        paddingLeft: 12,
        marginBottom: 22,
      }}>
        <div style={{ fontFamily: dir.mono, fontSize: 9, color: dir.warning, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Note</div>
        <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.4 }}>
          <em style={{ fontFamily: dir.display, fontStyle: 'italic' }}>Quatre jours sans pluie</em> — pensez à arroser.
        </div>
      </div>

      {/* Weather - editorial rule-row */}
      <div style={{ marginBottom: 26 }}>
        <SectionTitle dir={dir} kicker="Météo 7 jours" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
          {window.WEATHER.map((w, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '8px 0',
              borderTop: `1px solid ${dir.border}`,
              borderBottom: `1px solid ${dir.border}`,
              borderRight: i < 6 ? `1px solid ${dir.border}` : 'none',
            }}>
              <div style={{ fontFamily: dir.mono, fontSize: 9, color: dir.inkMuted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{w.d}</div>
              <div style={{ fontFamily: dir.display, fontSize: 16, marginTop: 4 }}>{w.t}°</div>
              <div style={{ fontSize: 8.5, color: dir.inkMuted }}>{w.l}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* À semer / récolter — editorial table */}
      <div style={{ marginBottom: 22 }}>
        <SectionTitle dir={dir} kicker="À semer en mai" />
        <div style={{ fontFamily: dir.display, fontSize: 16, lineHeight: 1.45, marginTop: 6 }}>
          <em style={{ fontStyle: 'italic' }}>Courgette, haricot, concombre</em> — directement au jardin après les Saints de Glace.
        </div>
      </div>
      <div style={{ marginBottom: 22 }}>
        <SectionTitle dir={dir} kicker="À récolter en mai" />
        <div style={{ fontFamily: dir.display, fontSize: 16, lineHeight: 1.45, marginTop: 6 }}>
          <em style={{ fontStyle: 'italic' }}>Salade, radis, épinard</em> — fraîcheur du printemps.
        </div>
      </div>

      {/* Tasks — editorial check list */}
      <SectionTitle dir={dir} kicker="Cette semaine" />
      <div style={{ marginTop: 4 }}>
        {['Biner la terre entre les rangs', 'Semer en godets, protéger des gelées'].map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 14,
            padding: '14px 0',
            borderBottom: `1px solid ${dir.border}`,
            fontSize: 13,
            lineHeight: 1.4,
          }}>
            <div style={{
              fontFamily: dir.mono, fontSize: 10, color: dir.accent,
              minWidth: 22, marginTop: 1,
            }}>0{i+1}</div>
            <div style={{ flex: 1 }}>{t}</div>
            <div style={{
              width: 14, height: 14, border: `1px solid ${dir.ink}`,
              marginTop: 1, flexShrink: 0,
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeSerre({ dir }) {
  return (
    <div style={{ padding: 14, paddingBottom: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, padding: '4px 4px 0' }}>
        <div>
          <div style={{ fontSize: 11, color: dir.inkMuted, fontWeight: 500 }}>Bonjour Léa,</div>
          <div style={{ fontFamily: dir.display, fontSize: 22, lineHeight: 1.05, marginTop: 2 }}>
            Mai au potager
          </div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 18,
          background: dir.surfaceAlt,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: dir.accent,
        }}>
          <Glyph kind="pin" color="currentColor" size={16} />
        </div>
      </div>

      {/* Weather hero card */}
      <div style={{
        background: `linear-gradient(135deg, ${dir.accent} 0%, ${dir.accentDim} 100%)`,
        borderRadius: dir.radius,
        padding: 16,
        color: dir.accentInk,
        marginBottom: 12,
        boxShadow: dir.shadow,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.2 }}>
          <WeatherIcon kind="cloud" color="#fff" size={90} />
        </div>
        <div style={{ fontFamily: dir.mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.85 }}>
          Aujourd'hui · Bordeaux
        </div>
        <div style={{ fontFamily: dir.display, fontSize: 38, lineHeight: 1, marginTop: 8 }}>33°</div>
        <div style={{ fontSize: 11, marginTop: 4, opacity: 0.9 }}>Nuageux · 4 jours sans pluie</div>
      </div>

      {/* 7-day strip */}
      <div style={{
        background: dir.surface,
        borderRadius: dir.radius,
        padding: '12px 8px',
        marginBottom: 14,
        boxShadow: dir.shadow,
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2,
      }}>
        {window.WEATHER.map((w, i) => (
          <div key={i} style={{
            textAlign: 'center',
            padding: '4px 2px',
            borderRadius: 10,
            background: i === 0 ? dir.surfaceAlt : 'transparent',
          }}>
            <div style={{ fontSize: 9, color: dir.inkMuted, fontWeight: 500 }}>{w.d}</div>
            <div style={{ marginTop: 4, color: dir.accent }}>
              <WeatherIcon kind={w.kind} color="currentColor" size={14} />
            </div>
            <div style={{ fontSize: 10.5, fontWeight: 600, marginTop: 4, color: dir.ink }}>{w.t}°</div>
          </div>
        ))}
      </div>

      {/* Quick actions grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <ActionCard dir={dir} icon="sprout" label="À semer" value="3 variétés" tint={dir.accent} />
        <ActionCard dir={dir} icon="basket" label="À récolter" value="3 prêtes" tint={dir.warning} />
      </div>

      {/* Tâches */}
      <SectionTitle dir={dir} kicker="Cette semaine" />
      <div style={{
        background: dir.surface,
        borderRadius: dir.radius,
        padding: 4,
        boxShadow: dir.shadow,
      }}>
        {['Biner la terre entre les rangs', 'Semer en godets, protéger des gelées'].map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 12px',
            borderBottom: i === 0 ? `1px solid ${dir.border}` : 'none',
            fontSize: 12,
            lineHeight: 1.3,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: 7,
              background: dir.surfaceAlt,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: dir.accent,
              flexShrink: 0,
            }}>
              <Glyph kind="check" color="currentColor" size={12} />
            </div>
            <div style={{ flex: 1 }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionCard({ dir, icon, label, value, tint }) {
  return (
    <div style={{
      background: dir.surface,
      borderRadius: dir.radius,
      padding: 14,
      boxShadow: dir.shadow,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 12,
        background: `${tint}22`,
        color: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
      }}>
        <Glyph kind={icon} color="currentColor" size={18} />
      </div>
      <div style={{ fontSize: 10.5, color: dir.inkMuted, fontWeight: 500 }}>{label}</div>
      <div style={{ fontFamily: dir.display, fontSize: 17, marginTop: 1 }}>{value}</div>
    </div>
  );
}

function SectionTitle({ dir, kicker, action }) {
  if (dir.key === 'editorial') {
    return (
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginBottom: 4,
      }}>
        <div style={{ fontFamily: dir.mono, fontSize: 9.5, color: dir.accent, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {kicker}
        </div>
        {action && <div style={{ fontSize: 10, color: dir.inkMuted, fontFamily: dir.mono }}>{action}</div>}
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      marginBottom: 10, padding: '0 2px',
    }}>
      <div style={{
        fontFamily: dir.key === 'serre' ? dir.sans : dir.display,
        fontSize: dir.key === 'serre' ? 13 : 16,
        fontWeight: dir.key === 'serre' ? 600 : 500,
        letterSpacing: dir.key === 'serre' ? 0 : '-0.01em',
        color: dir.key === 'foret' ? dir.accent : dir.ink,
      }}>
        {kicker}
      </div>
      {action && <div style={{ fontSize: 10.5, color: dir.accent, fontWeight: 500 }}>{action}</div>}
    </div>
  );
}

function Chip({ dir, icon, emoji, children, active }) {
  if (dir.key === 'editorial') {
    return (
      <span style={{
        fontFamily: dir.display,
        fontStyle: 'italic',
        fontSize: 13,
        color: dir.accent,
        borderBottom: `1px solid ${dir.accent}`,
        padding: '2px 0',
      }}>
        {children}
      </span>
    );
  }
  return (
    <div style={{
      background: active ? dir.accent : (dir.key === 'foret' ? 'rgba(166,227,107,0.10)' : dir.surfaceAlt),
      border: dir.key === 'foret' ? `1px solid rgba(166,227,107,0.22)` : 'none',
      borderRadius: 999,
      padding: emoji ? '5px 12px 5px 6px' : '6px 12px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 12,
      fontWeight: 600,
      color: active ? dir.accentInk : dir.accent,
    }}>
      {emoji && (
        <img
          src={window.emojiToOpenmojiUrl ? window.emojiToOpenmojiUrl(emoji) : ''}
          alt={emoji}
          style={{
            width: 16, height: 16,
            filter: `drop-shadow(0 2px 3px rgba(0,0,0,0.4)) drop-shadow(0 0 6px ${dir.accent}55)`,
            display: 'block',
          }}
          onError={(e) => { e.target.replaceWith(Object.assign(document.createElement('span'), { textContent: emoji, style: 'font-size:14px' })); }}
        />
      )}
      {icon && !emoji && <Glyph kind={icon} color="currentColor" size={12} />}
      {children}
    </div>
  );
}

Object.assign(window, {
  HomeScreen, ScreenShell, StatusBar, BottomTabs, SectionTitle, Chip, Glyph, WeatherIcon, ActionCard, TabIcon
});
