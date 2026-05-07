/* Recipe flow — home, detail, missing ingredients */

function RecipeScreen({ go }) {
  const tonight = {
    name: 'Smoky Old Fashioned',
    sub: '오늘 밤, 당신의 라가불린을 위해',
    tone: 'amber',
    glassStyle: 'rocks',
  };
  const categories = ['All', '위스키 베이스', '진 베이스', '논알콜', '클래식', '시그니처'];
  const [cat, setCat] = React.useState('All');
  const recipes = [
    { name: 'Penicillin', abv: 22, time: 3, tone: 'amber', glass: 'rocks', canMake: true, tag: 'SMOKY' },
    { name: 'Negroni', abv: 28, time: 2, tone: 'red', glass: 'rocks', canMake: true, tag: 'BITTER' },
    { name: 'Gin Basil Smash', abv: 18, time: 4, tone: 'green', glass: 'rocks', canMake: false, missing: 1, tag: 'HERBAL' },
    { name: 'Espresso Martini', abv: 20, time: 3, tone: 'amber', glass: 'martini', canMake: true, tag: 'RICH' },
    { name: 'Aviation', abv: 24, time: 3, tone: 'clear', glass: 'coupe', canMake: false, missing: 2, tag: 'FLORAL' },
  ];

  return (
    <div className="screen active">
      <SysBar />
      <AppBar
        left={<IconBtn><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3" strokeLinecap="round"/></svg></IconBtn>}
        title={<span><em>Recipe</em> Book</span>}
        right={<IconBtn><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 3h10M4 7h6M6 11h2" strokeLinecap="round"/></svg></IconBtn>}
      />

      <div className="content">
        {/* Tonight hero */}
        <div onClick={() => go('recipeDetail')} style={{
          margin: '0 20px 24px',
          background: 'linear-gradient(180deg, var(--ink-900) 0%, var(--ink-800) 100%)',
          borderRadius: 'var(--r-lg)',
          padding: '20px',
          color: 'var(--paper-50)',
          position: 'relative', overflow: 'hidden',
          cursor: 'pointer',
          minHeight: 220,
        }}>
          <div style={{
            position: 'absolute', top: 30, right: -10,
            opacity: 0.95,
          }}>
            <CocktailGlass tone={tonight.tone} size={160} glassStyle={tonight.glassStyle}/>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.22em', color: 'var(--brass)', textTransform: 'uppercase' }}>
            TONIGHT'S POUR · FEB 14
          </div>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.05, marginTop: 8, maxWidth: 200,
          }}>
            Smoky<br/>Old<br/><em style={{ color: 'var(--amber-200)', fontWeight: 500 }}>Fashioned</em>
          </h2>
          <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', marginTop: 12, maxWidth: 180, lineHeight: 1.4 }}>
            {tonight.sub}
          </div>

          <div style={{
            position: 'absolute', bottom: 20, left: 22, right: 22,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ display: 'flex', gap: 12, fontSize: 'var(--fs-xs)' }}>
              <span><span style={{ color: 'var(--brass)' }}>●</span> 3 min</span>
              <span><span style={{ color: 'var(--brass)' }}>●</span> 28% ABV</span>
              <span><span style={{ color: 'var(--ok)' }}>●</span> 재료 OK</span>
            </div>
            <span style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--amber-300)', color: 'var(--ink-900)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 'var(--fs-md)',
            }}>→</span>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {categories.map(c => <Chip key={c} active={c === cat} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>

        {/* Editorial section */}
        <div style={{ padding: '8px 20px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <div>
            <Eyebrow>NOW MAKEABLE</Eyebrow>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginTop: 4 }}>지금 바로 만들 수 있어요</h3>
          </div>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--amber-500)' }}>더보기 →</span>
        </div>

        {/* Recipe list */}
        <div style={{ padding: '12px 20px' }}>
          {recipes.map((r, i) => (
            <div key={r.name} onClick={() => go(r.canMake ? 'recipeDetail' : 'recipeMissing')} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px',
              background: 'var(--paper-100)',
              borderRadius: 'var(--r-md)',
              marginBottom: 8, cursor: 'pointer',
              border: '1px solid rgba(184,163,132,0.2)',
              opacity: r.canMake ? 1 : 0.72,
            }}>
              <div style={{
                width: 68, height: 68, flexShrink: 0,
                background: 'var(--paper-200)',
                borderRadius: 'var(--r-sm)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <CocktailGlass tone={r.tone} size={68} glassStyle={r.glass}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.18em', color: r.canMake ? 'var(--amber-500)' : 'var(--paper-400)' }}>{r.tag}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-lg)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.15, marginTop: 4 }}>{r.name}</div>
                <div style={{ display: 'flex', gap: 12, fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', marginTop: 4 }}>
                  <span>{r.abv}% ABV</span>
                  <span>·</span>
                  <span>{r.time} min</span>
                  {!r.canMake && (
                    <>
                      <span>·</span>
                      <span style={{ color: 'var(--danger)', fontWeight: 600 }}>재료 {r.missing} 부족</span>
                    </>
                  )}
                </div>
              </div>
              {r.canMake ? (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--ink-900)', color: 'var(--paper-50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--fs-md)',
                }}>→</div>
              ) : (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'var(--paper-200)', color: 'var(--paper-400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--fs-md)',
                }}>!</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <TabBar current="recipe" onChange={(t) => go(t)}/>
    </div>
  );
}

function RecipeDetailScreen({ go }) {
  const recipe = {
    name: 'Smoky Old Fashioned',
    sub: 'a warm pour for cold nights',
    abv: 28, time: 3, difficulty: '초급',
    tone: 'amber', glassStyle: 'rocks',
    story: '클래식 Old Fashioned에 피티한 싱글몰트 한 방울을 더하면, 잔 위로 모닥불 향이 피어오릅니다.',
    ingredients: [
      { name: 'Bourbon Whisky', amt: '60', unit: 'ml', have: true, kind: 'amber' },
      { name: 'Lagavulin 16', amt: '5', unit: 'ml', have: true, kind: 'amber', note: 'float' },
      { name: 'Demerara Syrup', amt: '7.5', unit: 'ml', have: true, kind: 'syrup' },
      { name: 'Angostura Bitters', amt: '2', unit: 'dashes', have: true, kind: 'bitter' },
      { name: 'Orange Peel', amt: '1', unit: '', have: true, kind: 'orange' },
    ],
    steps: [
      { h: '셰이킹 대신 스터링', d: '믹싱 글라스에 얼음과 시럽, 비터스를 넣고 스터' },
      { h: '버번을 더하기', d: '버번 60ml를 추가 후 30초간 차갑게 저어주세요' },
      { h: '로우 글라스로', d: '큰 얼음 한 덩이가 놓인 로우 글라스에 따르기' },
      { h: '스모크 플로트', d: '라가불린 5ml를 스푼 위로 천천히 띄우기' },
      { h: '오렌지 오일', d: '껍질을 짜 향을 낸 뒤 잔에 걸치기' },
    ],
  };
  return (
    <div className="screen active" style={{ background: 'var(--paper-50)' }}>
      <SysBar />
      <AppBar
        left={<BackBtn onClick={() => go('recipe')}/>}
        title=""
        right={<IconBtn><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 2h8v10l-4-2.5L3 12V2z" strokeLinejoin="round"/></svg></IconBtn>}
      />

      <div className="content">
        {/* Header */}
        <div style={{ padding: '0 24px', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.22em', color: 'var(--amber-500)', textTransform: 'uppercase' }}>CLASSIC · REIMAGINED</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.02, marginTop: 8, color: 'var(--ink-900)' }}>
            Smoky<br/><em style={{ color: 'var(--amber-500)', fontWeight: 500 }}>Old Fashioned</em>
          </h1>
          <div style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)', marginTop: 8, fontStyle: 'italic' }}>{recipe.sub}</div>
        </div>

        {/* Glass on warm tinted card */}
        <div style={{
          margin: '0 20px 20px',
          padding: '20px 0',
          background: 'linear-gradient(180deg, var(--paper-100) 0%, var(--paper-200) 100%)',
          borderRadius: 'var(--r-lg)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          border: '1px solid rgba(184,163,132,0.25)',
        }}>
          <CocktailGlass tone={recipe.tone} size={170} glassStyle={recipe.glassStyle}/>
        </div>

        {/* Stats row */}
        <div style={{
          margin: '0 24px 24px',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          padding: '12px 0',
          borderTop: '1px solid var(--paper-300)',
          borderBottom: '1px solid var(--paper-300)',
        }}>
          {[
            { k: 'ABV', v: `${recipe.abv}%` },
            { k: 'TIME', v: `${recipe.time} min` },
            { k: 'LEVEL', v: recipe.difficulty },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', borderRight: i < 2 ? '1px solid var(--paper-300)' : 'none' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.18em', color: 'var(--paper-400)' }}>{s.k}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-xl)', fontWeight: 700, marginTop: 4, color: 'var(--ink-900)' }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: '0 24px 40px' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', color: 'var(--ink-800)', lineHeight: 1.5, marginBottom: 24, textWrap: 'pretty' }}>
            "{recipe.story}"
          </p>

          {/* Ingredients */}
          <Eyebrow>INGREDIENTS · 1 SERVE</Eyebrow>
          <div style={{ marginTop: 12, marginBottom: 28 }}>
            {recipe.ingredients.map((ing, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0',
                borderBottom: i < recipe.ingredients.length - 1 ? '1px solid var(--paper-200)' : 'none',
              }}>
                <IngChip kind={ing.kind} size={32}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 600 }}>
                    {ing.name}
                    {ing.note && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', color: 'var(--amber-500)', marginLeft: 8, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{ing.note}</span>}
                  </div>
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em' }}>
                  {ing.amt}<span style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', marginLeft: 4, fontWeight: 500 }}>{ing.unit}</span>
                </div>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: ing.have ? 'var(--ok-bg)' : 'var(--danger-bg)',
                  color: ing.have ? 'var(--ok)' : 'var(--danger)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {ing.have ? (
                    <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : (
                    <span style={{ fontSize: 'var(--fs-xs)', fontWeight: 700 }}>!</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Steps */}
          <Eyebrow>METHOD</Eyebrow>
          <div style={{ marginTop: 12 }}>
            {recipe.steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--ink-900)', color: 'var(--amber-200)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 700,
                  }}>{String(i + 1).padStart(2, '0')}</div>
                </div>
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 600, letterSpacing: '-0.01em' }}>{s.h}</div>
                  <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--paper-400)', marginTop: 4, lineHeight: 1.5 }}>{s.d}</div>
                </div>
              </div>
            ))}
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
          padding: '12px 12px', background: 'var(--paper-100)',
          border: '1px solid var(--paper-300)', borderRadius: 'var(--r-md)',
          fontSize: 'var(--fs-md)', cursor: 'pointer', fontWeight: 500,
        }}>♡</button>
        <CTA>만드는 중 · 가이드 시작</CTA>
      </div>
    </div>
  );
}

function RecipeMissingScreen({ go }) {
  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('recipe')}/>} title="재료 부족" serif={false}/>

      <div className="content" style={{ padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0 12px' }}>
          <CocktailGlass tone="clear" size={140} glassStyle="coupe"/>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Eyebrow>ALMOST THERE</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h2)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.15, margin: '8px 0 8px',
          }}>
            <em style={{ color: 'var(--amber-400)' }}>Aviation</em>을 위해<br/>두 가지가 더 필요해요
          </h1>
          <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--paper-400)', marginBottom: 20 }}>
            전체 재료 5개 중 <strong style={{ color: 'var(--ink-900)' }}>3개 보유</strong>
          </p>
        </div>

        {/* Progress */}
        <div style={{
          padding: '12px 12px',
          background: 'var(--amber-50)',
          border: '1px solid rgba(200,162,101,0.3)',
          borderRadius: 'var(--r-md)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--fs-xs)', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--amber-600)' }}>READY</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--amber-600)' }}>60%</span>
          </div>
          <div style={{ height: 6, background: 'rgba(200,162,101,0.2)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: 'linear-gradient(90deg, #e4a83c, #c88820)' }}/>
          </div>
        </div>

        {/* Have list */}
        <Eyebrow>보유 중 · 3</Eyebrow>
        <div style={{ marginTop: 12, marginBottom: 20 }}>
          {[
            { name: 'Gin', amt: '45ml', kind: 'clear' },
            { name: 'Lemon Juice', amt: '15ml', kind: 'lemon' },
            { name: 'Crème de Violette', amt: '7.5ml', kind: 'bitter' },
          ].map((ing, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px',
              background: 'var(--paper-100)', borderRadius: 'var(--r-sm)', marginBottom: 8,
              border: '1px solid rgba(184,163,132,0.2)',
            }}>
              <IngChip kind={ing.kind} size={28}/>
              <div style={{ flex: 1, fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 600 }}>{ing.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--paper-400)' }}>{ing.amt}</div>
              <div style={{ color: 'var(--ok)' }}>
                <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 7l2.5 2.5L11 4" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ))}
        </div>

        {/* Missing */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Eyebrow>부족한 재료 · 2</Eyebrow>
          <span style={{ fontSize: 'var(--fs-xs)', color: 'var(--danger)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }}>NEEDED</span>
        </div>
        <div style={{ marginTop: 12, marginBottom: 20 }}>
          {[
            { name: 'Maraschino Liqueur', amt: '15ml', kind: 'cherry', swap: 'Luxardo 추천' },
            { name: 'Lemon Peel', amt: '1 twist', kind: 'lemon', swap: '가니시' },
          ].map((ing, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px',
              background: 'var(--paper-50)',
              border: '1.5px dashed var(--danger)',
              borderRadius: 'var(--r-sm)', marginBottom: 8,
            }}>
              <IngChip kind={ing.kind} size={28}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 600 }}>{ing.name}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--amber-500)', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginTop: 4, textTransform: 'uppercase' }}>↳ {ing.swap}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', color: 'var(--danger)', fontWeight: 600 }}>{ing.amt}</div>
            </div>
          ))}
        </div>

        {/* Similar you can make */}
        <div style={{
          padding: '16px',
          background: 'var(--ink-900)', color: 'var(--paper-50)',
          borderRadius: 'var(--r-md)',
        }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.2em', color: 'var(--brass)', textTransform: 'uppercase' }}>ALTERNATIVE TONIGHT</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, marginTop: 8, lineHeight: 1.3 }}>
            지금 바로 만들 수 있는 <em style={{ color: 'var(--amber-200)' }}>Gin Fizz</em>는 어떠세요?
          </div>
          <button onClick={() => go('recipeDetail')} style={{
            marginTop: 12, padding: '12px 16px',
            background: 'var(--amber-300)', color: 'var(--ink-900)',
            border: 'none', borderRadius: 'var(--r-sm)',
            fontSize: 'var(--fs-sm)', fontWeight: 600, cursor: 'pointer',
          }}>레시피 보기 →</button>
        </div>
      </div>

      <div style={{
        padding: '12px 20px 20px',
        background: 'linear-gradient(180deg, rgba(250,246,239,0) 0%, var(--paper-50) 30%)',
        display: 'flex', gap: 12,
      }}>
        <button onClick={() => go('barAdd')} style={{
          flex: '1 1 0',
          padding: '15px 12px',
          background: 'var(--paper-100)',
          border: '1.5px solid var(--paper-300)',
          color: 'var(--ink-900)',
          borderRadius: 'var(--r-md)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-md)', fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          재료 등록
        </button>
        <button onClick={() => go('bar')} style={{
          flex: '1.4 1 0',
          padding: '15px 12px',
          background: 'var(--ink-900)',
          color: 'var(--paper-50)',
          border: 'none',
          borderRadius: 'var(--r-md)',
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--fs-md)', fontWeight: 600,
          letterSpacing: '-0.01em',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 4h10l-1 7H3L2 4zM5 4V2h4v2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          쇼핑 리스트에 담기
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { RecipeScreen, RecipeDetailScreen, RecipeMissingScreen });
