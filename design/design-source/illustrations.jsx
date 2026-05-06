/* CSS bottle / glass / ingredient illustrations — compositional, not SVG drawn */

function Bottle({ tone = 'amber', level = 1.0, height = 80, label, labelText }) {
  const bodyH = height * 0.62;
  const neckH = height * 0.24;
  const capH  = height * 0.08;
  const w = height * 0.38;
  const liquidH = bodyH * Math.max(0, Math.min(1, level));

  const tones = {
    amber: { liquid: 'linear-gradient(180deg, #e4a83c, #8b4f10)', glass: 'linear-gradient(90deg, rgba(200,150,80,0.28), rgba(80,40,15,0.42))' },
    clear: { liquid: 'linear-gradient(180deg, #d9c89a, #7a6138)', glass: 'linear-gradient(90deg, rgba(220,200,160,0.3), rgba(130,100,60,0.35))' },
    green: { liquid: 'linear-gradient(180deg, #7a8a4a, #2e3a14)', glass: 'linear-gradient(90deg, rgba(100,130,60,0.35), rgba(30,50,10,0.45))' },
    red:   { liquid: 'linear-gradient(180deg, #c63820, #4a0e05)', glass: 'linear-gradient(90deg, rgba(180,60,40,0.35), rgba(60,10,5,0.45))' },
    blue:  { liquid: 'linear-gradient(180deg, #3a5a7a, #16263e)', glass: 'linear-gradient(90deg, rgba(70,100,140,0.35), rgba(20,30,50,0.45))' },
  };
  const t = tones[tone] || tones.amber;
  return (
    <div style={{ width: w + 4, height, position: 'relative', filter: 'drop-shadow(0 3px 6px rgba(40,20,5,0.3))' }}>
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: w * 0.5, height: capH,
        background: 'linear-gradient(180deg, #6d4410 0%, #3d240a 100%)',
        borderRadius: '2px 2px 0 0',
      }} />
      <div style={{
        position: 'absolute', top: capH, left: '50%', transform: 'translateX(-50%)',
        width: w * 0.35, height: neckH,
        background: t.glass,
      }} />
      <div style={{
        position: 'absolute', top: capH + neckH - 2, left: '50%', transform: 'translateX(-50%)',
        width: w, height: height * 0.06,
        background: t.glass,
        borderRadius: '50% 50% 10% 10% / 60% 60% 10% 10%',
      }} />
      <div style={{
        position: 'absolute', top: capH + neckH + height * 0.04, left: '50%', transform: 'translateX(-50%)',
        width: w, height: bodyH,
        background: t.glass,
        borderRadius: '3px 3px 6px 6px',
        overflow: 'hidden',
        boxShadow: 'inset 2px 0 3px rgba(255,255,255,0.1), inset -2px 0 4px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: liquidH,
          background: t.liquid,
          transition: 'height 0.4s',
        }} />
        {label && (
          <div style={{
            position: 'absolute', top: '38%', left: 2, right: 2,
            padding: '4px 2px',
            background: '#f4ece0',
            borderRadius: 1,
            fontFamily: 'var(--font-serif)',
            fontSize: Math.max(5.5, height * 0.075),
            fontWeight: 700,
            textAlign: 'center',
            color: '#1a1412',
            lineHeight: 1.05,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>{labelText || label}</div>
        )}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '15%',
          width: 2, background: 'rgba(255,255,255,0.2)',
        }} />
      </div>
    </div>
  );
}

function LiquidGauge({ level, width = 36, height = 48 }) {
  return (
    <div style={{
      width, height,
      background: 'linear-gradient(90deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02))',
      border: '1px solid rgba(184,163,132,0.45)',
      borderRadius: 4,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: `${Math.max(0, Math.min(1, level)) * 100}%`,
        background: level < 0.3
          ? 'linear-gradient(180deg, #c63820, #6d2011)'
          : 'linear-gradient(180deg, #e4a83c, #8b4f10)',
        transition: 'height 0.4s',
      }} />
      {[0.25, 0.5, 0.75].map(m => (
        <div key={m} style={{
          position: 'absolute', left: 0, right: 0, bottom: `${m * 100}%`,
          height: 1, background: 'rgba(0,0,0,0.1)',
        }} />
      ))}
    </div>
  );
}

function IngChip({ kind, size = 48 }) {
  const styles = {
    lemon: 'radial-gradient(circle at 30% 30%, #f7d04a, #b88a10)',
    ice:   'linear-gradient(135deg, #d9e8f0 0%, #a0b8c4 100%)',
    syrup: 'radial-gradient(circle at 30% 30%, #d4885a, #6a3414)',
    bitter:'linear-gradient(135deg, #6a3414, #2e1405)',
    sugar: 'linear-gradient(135deg, #f4ece0, #d4c09a)',
    lime:  'radial-gradient(circle at 30% 30%, #a6c34a, #54701e)',
    orange:'radial-gradient(circle at 30% 30%, #e8903a, #8a4010)',
    cherry:'radial-gradient(circle at 30% 30%, #c6323a, #5a0e18)',
    mint:  'radial-gradient(circle at 30% 30%, #8ab462, #2e4a14)',
    soda:  'linear-gradient(135deg, #e8f0d8, #a8c088)',
    coffee:'radial-gradient(circle at 30% 30%, #4a2a10, #1a0a02)',
    cream: 'radial-gradient(circle at 30% 30%, #f4ece0, #c8b088)',
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: styles[kind] || styles.lemon,
      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(40,20,5,0.2)',
    }}/>
  );
}

function CocktailGlass({ tone = 'amber', size = 100, glassStyle = 'rocks' }) {
  const colors = {
    amber: 'linear-gradient(180deg, rgba(228,168,60,0.85), rgba(138,79,16,0.95))',
    red: 'linear-gradient(180deg, rgba(198,56,32,0.88), rgba(74,14,5,0.95))',
    clear: 'linear-gradient(180deg, rgba(217,200,154,0.75), rgba(122,97,56,0.85))',
    green: 'linear-gradient(180deg, rgba(122,138,74,0.88), rgba(46,58,20,0.95))',
    pink: 'linear-gradient(180deg, rgba(230,140,140,0.85), rgba(120,40,60,0.9))',
  };
  if (glassStyle === 'martini') {
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '8%', right: '8%',
          height: '50%',
          background: colors[tone] || colors.amber,
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
        }}/>
        <div style={{
          position: 'absolute', top: '60%', left: '49%', width: 2, height: '24%',
          background: 'rgba(184,163,132,0.6)',
        }}/>
        <div style={{
          position: 'absolute', bottom: '8%', left: '28%', right: '28%',
          height: 3, background: 'rgba(184,163,132,0.6)', borderRadius: 1,
        }}/>
      </div>
    );
  }
  if (glassStyle === 'coupe') {
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '18%', left: '14%', right: '14%',
          height: '30%',
          background: colors[tone] || colors.amber,
          borderRadius: '50% 50% 40% 40% / 30% 30% 80% 80%',
        }}/>
        <div style={{
          position: 'absolute', top: '48%', left: '49%', width: 2, height: '28%',
          background: 'rgba(184,163,132,0.6)',
        }}/>
        <div style={{
          position: 'absolute', bottom: '8%', left: '28%', right: '28%',
          height: 3, background: 'rgba(184,163,132,0.6)', borderRadius: 1,
        }}/>
      </div>
    );
  }
  if (glassStyle === 'highball') {
    return (
      <div style={{ width: size, height: size, position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '10%', left: '30%', right: '30%', bottom: '8%',
          background: colors[tone] || colors.amber,
          borderRadius: '2px 2px 6px 6px',
          border: '1px solid rgba(255,255,255,0.15)',
        }}>
          <div style={{
            position: 'absolute', top: '8%', left: '20%', width: '35%', height: '18%',
            background: 'linear-gradient(135deg, rgba(240,250,255,0.5), rgba(200,220,230,0.3))',
            borderRadius: 3,
          }}/>
        </div>
      </div>
    );
  }
  // rocks
  return (
    <div style={{ width: size, height: size, position: 'relative' }}>
      <div style={{
        position: 'absolute', top: '22%', left: '18%', right: '18%', bottom: '14%',
        background: colors[tone] || colors.amber,
        borderRadius: '4px 4px 10px 10px',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: 'inset 2px 0 4px rgba(255,255,255,0.15), inset -2px 0 4px rgba(0,0,0,0.2)',
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '28%', width: '32%', height: '32%',
          background: 'linear-gradient(135deg, rgba(240,250,255,0.55), rgba(200,220,230,0.3))',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.3)',
        }}/>
      </div>
    </div>
  );
}

Object.assign(window, { Bottle, LiquidGauge, IngChip, CocktailGlass });
