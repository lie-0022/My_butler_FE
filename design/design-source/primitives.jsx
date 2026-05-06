/* Shared UI primitives — buttons, chips, sysbar, appbar, gauges, vessels */

// Android status bar — One UI style: left time, right indicators
function SysBar({ dark = false }) {
  const color = dark ? '#faf6ef' : '#1a1412';
  return (
    <div className={'sysbar' + (dark ? ' on-dark' : '')}>
      <span className="time tnum">9:41</span>
      <div className="indicators">
        {/* signal */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M0 11 L17 11 L17 0 Z" fill={color}/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11">
          <path d="M7.5 1.5C4.3 1.5 1.5 2.7 0 4.5l7.5 6.5L15 4.5C13.5 2.7 10.7 1.5 7.5 1.5z" fill={color}/>
        </svg>
        {/* battery — Android horizontal */}
        <svg width="25" height="11" viewBox="0 0 25 11">
          <rect x="0" y="1" width="21" height="9" rx="2" fill={color}/>
          <rect x="22" y="3.5" width="2" height="4" rx="0.5" fill={color}/>
          <text x="10" y="8.2" textAnchor="middle" fontSize="6.5" fontWeight="700" fill={dark ? '#1a1412' : '#faf6ef'} fontFamily="Inter, sans-serif">85</text>
        </svg>
      </div>
    </div>
  );
}

// App bar with left + title + right
function AppBar({ left, title, right, serif = true, dark = false }) {
  return (
    <div className="appbar" style={dark ? { color: '#faf6ef' } : {}}>
      <div style={{ minWidth: 38, display: 'flex', justifyContent: 'flex-start' }}>{left}</div>
      <div className="title" style={{
        fontFamily: serif ? 'var(--font-serif)' : 'var(--font-sans)',
        color: dark ? '#faf6ef' : 'var(--ink-900)',
      }}>{title}</div>
      <div style={{ minWidth: 38, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

function BackBtn({ onClick, dark = false }) {
  return (
    <button className="icon-btn" onClick={onClick} style={dark ? {
      background: 'rgba(250,246,239,0.08)',
      border: '1px solid rgba(250,246,239,0.1)',
      color: '#faf6ef',
    } : {}}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M9 2L3 7l6 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function IconBtn({ children, onClick, dark = false }) {
  return (
    <button className="icon-btn" onClick={onClick} style={dark ? {
      background: 'rgba(250,246,239,0.08)',
      border: '1px solid rgba(250,246,239,0.1)',
      color: '#faf6ef',
    } : {}}>{children}</button>
  );
}

// Primary CTA
function CTA({ children, onClick, variant = 'dark', disabled = false, style = {} }) {
  const base = {
    width: '100%',
    padding: '16px 20px',
    borderRadius: 'var(--r-md)',
    fontFamily: 'var(--font-sans)',
    fontSize: 15,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    letterSpacing: '-0.01em',
    opacity: disabled ? 0.35 : 1,
    transition: 'transform 0.1s',
    ...style,
  };
  const variants = {
    dark: { background: 'var(--ink-900)', color: 'var(--paper-50)' },
    amber: { background: 'var(--amber-300)', color: 'var(--ink-900)' },
    ghost: { background: 'transparent', color: 'var(--ink-900)', border: '1.5px solid var(--ink-900)' },
    danger: { background: 'transparent', color: 'var(--danger)' },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant] }}>
      {children}
    </button>
  );
}

// Chip (selectable)
function Chip({ active, onClick, children, size = 'md' }) {
  const pads = { sm: '6px 12px', md: '9px 16px', lg: '12px 18px' };
  return (
    <button onClick={onClick} style={{
      padding: pads[size],
      borderRadius: 'var(--r-pill)',
      fontSize: 12.5,
      fontWeight: active ? 600 : 500,
      fontFamily: 'var(--font-sans)',
      background: active ? 'var(--ink-900)' : 'transparent',
      color: active ? 'var(--paper-50)' : 'var(--ink-900)',
      border: active ? '1px solid var(--ink-900)' : '1px solid var(--paper-300)',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      letterSpacing: '-0.01em',
    }}>{children}</button>
  );
}

// Input
function Input({ label, value, onChange, placeholder, type = 'text', hint, hintType }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: 'var(--paper-400)',
        marginBottom: 8,
      }}>{label}</label>}
      <input
        type={type}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '14px 16px',
          fontFamily: 'var(--font-sans)',
          fontSize: 15,
          color: 'var(--ink-900)',
          background: 'var(--paper-100)',
          border: '1.5px solid transparent',
          borderRadius: 'var(--r-md)',
          outline: 'none',
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--amber-300)'}
        onBlur={(e) => e.target.style.borderColor = 'transparent'}
      />
      {hint && (
        <div style={{
          fontSize: 11,
          color: hintType === 'ok' ? 'var(--ok)' : hintType === 'err' ? 'var(--danger)' : 'var(--paper-400)',
          marginTop: 6, paddingLeft: 4,
        }}>{hint}</div>
      )}
    </div>
  );
}

// Toggle
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 46, height: 26,
      borderRadius: 'var(--r-pill)',
      background: on ? 'var(--ink-900)' : 'var(--paper-300)',
      border: 'none',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background 0.2s',
    }}>
      <div style={{
        position: 'absolute',
        width: 20, height: 20,
        borderRadius: '50%',
        background: '#fff',
        top: 3,
        left: on ? 23 : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      }} />
    </button>
  );
}

// Card — paper with subtle warm border
function Card({ children, style = {}, onClick, dark = false }) {
  return (
    <div onClick={onClick} style={{
      background: dark ? 'var(--ink-800)' : 'var(--paper-100)',
      borderRadius: 'var(--r-lg)',
      border: dark ? '1px solid var(--ink-600)' : '1px solid rgba(184,163,132,0.25)',
      color: dark ? 'var(--paper-50)' : 'var(--ink-900)',
      ...style,
    }}>{children}</div>
  );
}

// Eyebrow label
function Eyebrow({ children, style = {} }) {
  return <div className="eyebrow" style={style}>{children}</div>;
}

// Section head (editorial)
function SectionHead({ kicker, title, action }) {
  return (
    <div style={{ padding: '24px 20px 12px' }}>
      {kicker && <div className="eyebrow" style={{ marginBottom: 6 }}>{kicker}</div>}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10 }}>
        <h2 style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--ink-900)',
          lineHeight: 1.15,
        }}>{title}</h2>
        {action}
      </div>
    </div>
  );
}

// Tab bar (shared)
function TabBar({ current, onChange }) {
  const tabs = [
    { id: 'bar', label: 'My Bar', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 4h10l-1.5 7a3 3 0 01-3 2.5h-1a3 3 0 01-3-2.5L7 4z" strokeLinejoin="round"/>
        <path d="M12 13.5v6M9 20h6" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'recipe', label: 'Recipe', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 3h12v4a6 6 0 01-6 6 6 6 0 01-6-6V3z" strokeLinejoin="round"/>
        <path d="M12 13v6M9 20h6" strokeLinecap="round"/>
      </svg>
    )},
    { id: 'ar', label: 'AR', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )},
    { id: 'feed', label: 'Social', icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="9" r="3"/>
        <circle cx="17" cy="7" r="2"/>
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5M15 19c0-2 2-3.5 4-3.5" strokeLinecap="round"/>
      </svg>
    )},
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => (
        <button key={t.id} className={'tab' + (current === t.id ? ' active' : '')} onClick={() => onChange(t.id)}>
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

// Progress dots (onboarding)
function ProgressDots({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '8px 20px 0' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 3,
          borderRadius: 2,
          background: i < step ? 'var(--amber-300)' : 'var(--paper-300)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  );
}

Object.assign(window, { SysBar, AppBar, BackBtn, IconBtn, CTA, Chip, Input, Toggle, Card, Eyebrow, SectionHead, TabBar, ProgressDots });
