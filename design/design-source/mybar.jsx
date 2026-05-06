/* My Bar flow — inventory screens */

function BarScreen({ go, inventory }) {
  const total = inventory.length;
  const lowStock = inventory.filter(i => i.level < 0.3).length;
  const categories = ['전체', '위스키', '진', '럼', '리큐르', '믹서'];
  const [cat, setCat] = React.useState('전체');
  const filtered = cat === '전체' ? inventory : inventory.filter(i => i.category === cat);

  return (
    <div className="screen active">
      <SysBar />
      <AppBar
        left={<IconBtn><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="9" cy="9" r="6.5"/><path d="M9 6v3l2 2" strokeLinecap="round"/></svg></IconBtn>}
        title={<span>My <em>Bar</em></span>}
        right={<IconBtn onClick={() => go('barAdd')}><svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></IconBtn>}
      />

      <div className="content">
        {/* Hero counter */}
        <div style={{
          margin: '0 20px',
          background: 'linear-gradient(180deg, var(--ink-900) 0%, var(--ink-800) 100%)',
          borderRadius: 'var(--r-lg)',
          padding: '20px 20px 0',
          color: 'var(--paper-50)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.22em',
            color: 'var(--brass)', textTransform: 'uppercase',
          }}>TONIGHT'S COUNTER</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-display)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1 }}>{total}</div>
            <div style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)' }}>bottles on the shelf</div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: 'var(--fs-xs)' }}>
            <div><span style={{ color: 'var(--amber-200)', fontWeight: 600 }}>●</span> 충분 {total - lowStock}</div>
            <div><span style={{ color: '#c63820', fontWeight: 600 }}>●</span> 부족 {lowStock}</div>
          </div>

          {/* shelf */}
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            gap: -6, marginTop: 12, padding: '0 4px',
            borderBottom: '3px solid var(--brass)',
            paddingBottom: 4,
          }}>
            {inventory.slice(0, 6).map((b, i) => (
              <div key={i} style={{ marginRight: -6 }}>
                <Bottle tone={b.tone} level={b.level} height={80 + (i % 2 === 0 ? 8 : 0)} label labelText={b.label.slice(0, 4)}/>
              </div>
            ))}
          </div>
          <div style={{
            height: 8, marginTop: -2,
            background: 'linear-gradient(180deg, #6d4410 0%, #2e180a 100%)',
          }}/>
        </div>

        {/* Category scroller */}
        <div style={{
          display: 'flex', gap: 8, padding: '20px 20px 8px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {categories.map(c => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
          ))}
        </div>

        {/* Inventory list */}
        <div style={{ padding: '12px 20px' }}>
          {filtered.map((item, i) => (
            <div key={i} onClick={() => go('barDetail')} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 12px',
              background: 'var(--paper-100)',
              borderRadius: 'var(--r-md)',
              marginBottom: 8,
              cursor: 'pointer',
              border: '1px solid rgba(184,163,132,0.2)',
            }}>
              <div style={{ width: 30, flexShrink: 0 }}>
                <Bottle tone={item.tone} level={item.level} height={56}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600,
                  letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 4,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{item.name}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)' }}>
                  {item.category} · {item.volume}ml · {item.abv}%
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <LiquidGauge level={item.level} width={8} height={44}/>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', fontWeight: 600,
                  color: item.level < 0.3 ? '#c63820' : 'var(--ink-900)',
                  width: 36, textAlign: 'right',
                }}>{Math.round(item.level * 100)}%</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 20px' }}>
          <button onClick={() => go('barInsight')} style={{
            width: '100%', padding: '16px',
            background: 'var(--paper-100)',
            border: '1px dashed var(--paper-300)',
            borderRadius: 'var(--r-md)',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-md)', color: 'var(--ink-900)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span>지난 30일 소비 인사이트 보기</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <TabBar current="bar" onChange={(t) => go(t)}/>
    </div>
  );
}

function BarDetailScreen({ go }) {
  const item = {
    name: 'Lagavulin 16',
    origin: 'Islay · Scotland',
    category: '싱글몰트 위스키',
    volume: 700, abv: 43,
    level: 0.42,
    notes: ['스모키', '피트', '바닐라', '해풍'],
    purchased: '2025년 11월 3일',
    opened: '2025년 12월 18일',
  };
  return (
    <div className="screen active" style={{ background: 'var(--paper-50)' }}>
      <SysBar />
      <AppBar
        left={<BackBtn onClick={() => go('bar')}/>}
        title=""
        right={<IconBtn><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="3" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="13" cy="8" r="1.3"/></svg></IconBtn>}
      />

      <div className="content">
        {/* Hero bottle on warm tinted card */}
        <div style={{
          margin: '0 20px 4px',
          padding: '20px 0 24px',
          background: 'linear-gradient(180deg, var(--paper-100) 0%, var(--paper-200) 100%)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid rgba(184,163,132,0.25)',
          display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          minHeight: 260,
        }}>
          <Bottle tone="amber" level={item.level} height={230} label labelText="LAGAVULIN"/>
        </div>

        {/* Info block on paper */}
        <div style={{ padding: '20px 24px 40px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: '0.22em', color: 'var(--amber-500)', textTransform: 'uppercase', marginBottom: 8 }}>{item.origin}</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--ink-900)' }}>{item.name}</h1>
          <div style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)', marginTop: 8 }}>{item.category}</div>

          {/* Stats row (editorial) */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            marginTop: 24, padding: '20px 0',
            borderTop: '1px solid var(--paper-300)',
            borderBottom: '1px solid var(--paper-300)',
          }}>
            {[
              { k: '남은 양', v: `${Math.round(item.level * 100)}%`, sub: `${Math.round(item.volume * item.level)}ml` },
              { k: '용량', v: `${item.volume}`, sub: 'ml' },
              { k: 'ABV', v: `${item.abv}`, sub: 'alcohol' },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: 'center',
                borderRight: i < 2 ? '1px solid var(--paper-300)' : 'none',
                padding: '0 4px',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--paper-400)' }}>{s.k}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em', color: 'var(--ink-900)' }}>{s.v}</div>
                <div style={{ fontSize: 'var(--fs-xxs)', color: 'var(--paper-400)', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tasting notes */}
          <div style={{ marginTop: 20 }}>
            <Eyebrow>TASTING NOTES</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {item.notes.map(n => (
                <span key={n} style={{
                  padding: '8px 12px',
                  background: 'var(--amber-50)',
                  color: 'var(--amber-600)',
                  border: '1px solid rgba(200,162,101,0.35)',
                  borderRadius: 'var(--r-pill)',
                  fontSize: 'var(--fs-xs)', fontWeight: 500,
                }}>{n}</span>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ marginTop: 20 }}>
            <Eyebrow>TIMELINE</Eyebrow>
            <div style={{ marginTop: 12 }}>
              <TimelineRow label="구매" date={item.purchased} />
              <TimelineRow label="개봉" date={item.opened} />
              <TimelineRow label="예상 완료" date="약 6주 후" muted/>
            </div>
          </div>

          {/* Suggested recipes */}
          <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Eyebrow>MAKE WITH THIS</Eyebrow>
              <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--amber-500)' }}>전체 보기 →</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {[
                { name: 'Penicillin', tone: 'amber', style: 'rocks' },
                { name: 'Smoky Old Fashioned', tone: 'amber', style: 'rocks' },
                { name: 'Rusty Nail', tone: 'amber', style: 'rocks' },
              ].map(r => (
                <div key={r.name} style={{
                  flexShrink: 0, width: 120,
                  padding: 12,
                  background: 'var(--paper-100)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid rgba(184,163,132,0.2)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <CocktailGlass tone={r.tone} size={80} glassStyle={r.style}/>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-sm)', fontWeight: 600, textAlign: 'center', marginTop: 4, lineHeight: 1.2 }}>{r.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 20px',
        background: 'linear-gradient(180deg, rgba(250,246,239,0) 0%, var(--paper-50) 30%)',
        display: 'flex', gap: 8, zIndex: 5,
      }}>
        <button style={{
          padding: '12px 16px', background: 'var(--paper-100)',
          border: '1px solid var(--paper-300)', borderRadius: 'var(--r-md)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-md)', fontWeight: 500,
          cursor: 'pointer', flex: '0 0 auto',
        }}>기록 추가</button>
        <CTA onClick={() => go('recipeDetail')}>이 술로 만들기</CTA>
      </div>
    </div>
  );
}

function TimelineRow({ label, date, muted }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: muted ? 'var(--paper-300)' : 'var(--amber-400)',
        flexShrink: 0,
      }}/>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.15em', color: muted ? 'var(--paper-400)' : 'var(--ink-900)', width: 80 }}>{label}</div>
      <div style={{ fontSize: 'var(--fs-md)', color: muted ? 'var(--paper-400)' : 'var(--ink-900)', fontStyle: muted ? 'italic' : 'normal' }}>{date}</div>
    </div>
  );
}

function BarAddScreen({ go, toast }) {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState('');
  const [tone, setTone] = React.useState('amber');

  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('bar')}/>} title="재료 등록" serif={false}
        right={<span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--paper-400)' }}>{step}/3</span>}
      />

      <div className="content" style={{ padding: '0 24px 40px' }}>
        {/* Scan CTA */}
        <div style={{
          background: 'var(--ink-900)',
          borderRadius: 'var(--r-lg)',
          padding: '16px',
          color: 'var(--paper-50)',
          display: 'flex', alignItems: 'center', gap: 12,
          marginBottom: 20,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 'var(--r-md)',
            background: 'var(--amber-300)', color: 'var(--ink-900)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 7V5a2 2 0 012-2h2M15 3h2a2 2 0 012 2v2M19 15v2a2 2 0 01-2 2h-2M7 19H5a2 2 0 01-2-2v-2" strokeLinecap="round"/>
              <path d="M7 11h8" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 600 }}>라벨 스캔으로 자동 등록</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', marginTop: 4 }}>카메라로 비추면 정보가 채워져요</div>
          </div>
          <span style={{ color: 'var(--amber-200)' }}>→</span>
        </div>

        <div style={{
          textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)',
          letterSpacing: '0.2em', color: 'var(--paper-400)', margin: '12px 0 20px',
        }}>— OR —</div>

        <Eyebrow>STEP ONE · BASIC</Eyebrow>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-xl)', fontWeight: 700, margin: '8px 0 16px' }}>무엇을 추가하시나요?</h2>

        <Input label="제품명" value={name} onChange={(e) => setName(e.target.value)} placeholder="예: Lagavulin 16"/>

        <label style={{
          display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--paper-400)', marginBottom: 12,
        }}>종류</label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
          {['위스키', '진', '럼', '보드카', '리큐르', '와인', '맥주', '기타'].map(c => (
            <Chip key={c} active={c === '위스키'} size="sm">{c}</Chip>
          ))}
        </div>

        <label style={{
          display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--paper-400)', marginBottom: 12,
        }}>병 톤 선택</label>
        <div style={{
          display: 'flex', gap: 8, padding: '16px 12px',
          background: 'var(--paper-100)', borderRadius: 'var(--r-md)',
          alignItems: 'flex-end', justifyContent: 'space-around', marginBottom: 20,
        }}>
          {[
            { id: 'amber', label: 'Amber' },
            { id: 'clear', label: 'Clear' },
            { id: 'green', label: 'Green' },
            { id: 'red', label: 'Red' },
          ].map(t => (
            <div key={t.id} onClick={() => setTone(t.id)} style={{
              textAlign: 'center', cursor: 'pointer',
              padding: 8,
              borderRadius: 'var(--r-sm)',
              background: tone === t.id ? 'var(--ink-900)' : 'transparent',
              color: tone === t.id ? 'var(--paper-50)' : 'var(--ink-900)',
            }}>
              <Bottle tone={t.id} height={60}/>
              <div style={{ fontSize: 'var(--fs-xxs)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>{t.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--paper-400)', marginBottom: 8 }}>용량 (ml)</label>
            <input defaultValue="700" style={{
              width: '100%', padding: '12px 16px', fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-lg)', fontWeight: 600,
              background: 'var(--paper-100)', border: 'none', borderRadius: 'var(--r-md)', outline: 'none', textAlign: 'center',
            }}/>
          </div>
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--paper-400)', marginBottom: 8 }}>ABV (%)</label>
            <input defaultValue="43" style={{
              width: '100%', padding: '12px 16px', fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-lg)', fontWeight: 600,
              background: 'var(--paper-100)', border: 'none', borderRadius: 'var(--r-md)', outline: 'none', textAlign: 'center',
            }}/>
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px', background: 'var(--paper-50)' }}>
        <CTA variant="amber" onClick={() => { toast('카운터에 추가되었어요'); go('bar'); }}>카운터에 추가</CTA>
      </div>
    </div>
  );
}

function BarInsightScreen({ go }) {
  const data = [
    { name: 'Lagavulin 16', consumed: 420, tone: 'amber' },
    { name: 'Hendricks Gin', consumed: 280, tone: 'clear' },
    { name: 'Campari', consumed: 180, tone: 'red' },
    { name: 'Green Chartreuse', consumed: 90, tone: 'green' },
    { name: 'Dolin Rouge', consumed: 70, tone: 'red' },
  ];
  const max = Math.max(...data.map(d => d.consumed));
  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('bar')}/>} title="지난 30일" serif={false}/>
      <div className="content" style={{ padding: '12px 24px 40px' }}>
        <Eyebrow>MONTHLY COUNTER</Eyebrow>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, margin: '8px 0 4px' }}>
          <em style={{ color: 'var(--amber-400)' }}>1,420ml</em>의<br/>한 달이었어요
        </h1>
        <p style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)', lineHeight: 1.5, marginTop: 8 }}>
          지난 달 대비 <span style={{ color: 'var(--ok)', fontWeight: 600 }}>↑ 18% 증가</span>
        </p>

        {/* Big number card */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20,
        }}>
          <div style={{
            background: 'var(--ink-900)', color: 'var(--paper-50)',
            borderRadius: 'var(--r-md)', padding: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.2em', color: 'var(--brass)', textTransform: 'uppercase' }}>DRINKS MADE</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700, marginTop: 4, letterSpacing: '-0.02em' }}>23</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', marginTop: 4 }}>평균 매주 5.7잔</div>
          </div>
          <div style={{
            background: 'var(--amber-300)', color: 'var(--ink-900)',
            borderRadius: 'var(--r-md)', padding: '16px',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.7 }}>TOP FLAVOR</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em', lineHeight: 1.1 }}>스모키<br/>&amp; 드라이</div>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ marginTop: 28 }}>
          <Eyebrow>TOP POURS</Eyebrow>
          <div style={{ marginTop: 12 }}>
            {data.map((d, i) => (
              <div key={d.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 600 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', color: 'var(--paper-400)', marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                    {d.name}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', fontWeight: 600 }}>{d.consumed}ml</div>
                </div>
                <div style={{ height: 10, background: 'var(--paper-200)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{
                    width: `${(d.consumed / max) * 100}%`, height: '100%',
                    background: d.tone === 'amber' ? 'linear-gradient(90deg, #e4a83c, #8b4f10)'
                      : d.tone === 'red' ? 'linear-gradient(90deg, #c63820, #6d2011)'
                      : d.tone === 'green' ? 'linear-gradient(90deg, #7a8a4a, #2e3a14)'
                      : 'linear-gradient(90deg, #d9c89a, #7a6138)',
                  }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div style={{
          marginTop: 24,
          padding: '16px',
          background: 'var(--paper-100)',
          border: '1px solid rgba(184,163,132,0.3)',
          borderRadius: 'var(--r-md)',
        }}>
          <Eyebrow>BUTLER SUGGESTS</Eyebrow>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, marginTop: 8, lineHeight: 1.35 }}>
            곧 <em style={{ color: 'var(--amber-500)' }}>Campari</em>가 바닥날 것 같아요. 다음 주에 구비하면 좋겠어요.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BarScreen, BarDetailScreen, BarAddScreen, BarInsightScreen });
