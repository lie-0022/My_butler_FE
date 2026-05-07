/* Community flow — feed, post detail, profile */

function FeedScreen({ go }) {
  const filters = ['All', '팔로잉', '레시피', '리뷰', '홈바'];
  const [filter, setFilter] = React.useState('All');
  const posts = [
    {
      user: '바텐더 김', handle: '@bartender_kim', avatar: 'amber',
      time: '2h', type: 'RECIPE', title: 'Oaxacan Old Fashioned',
      body: '메즈칼로 스모키함을 한층 더. 토요일 밤에 완벽한 한 잔.',
      tone: 'amber', glass: 'rocks',
      likes: 124, comments: 18,
    },
    {
      user: '혜진', handle: '@hyejin_pour', avatar: 'clear',
      time: '5h', type: 'HOME BAR', title: '드디어 선반이 찼어요',
      body: '3년 걸렸네요. 다음은 뭘 들여야 할까요?',
      bottles: true,
      likes: 89, comments: 34,
    },
    {
      user: '민수', handle: '@minsu.drinks', avatar: 'green',
      time: '1d', type: 'REVIEW', title: 'Yamazaki 12 — 드디어 영접',
      body: '생각보다 섬세하고 과일향이 확실했어요. 점수 8.5.',
      tone: 'amber', glass: 'rocks',
      likes: 203, comments: 42,
    },
  ];

  return (
    <div className="screen active">
      <SysBar />
      <AppBar
        left={<IconBtn><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="7" cy="7" r="5"/><path d="M11 11l3 3" strokeLinecap="round"/></svg></IconBtn>}
        title={<span><em>Counter</em> Talk</span>}
        right={<IconBtn><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 2v10M2 7h10" strokeLinecap="round"/></svg></IconBtn>}
      />

      <div className="content">
        {/* Filter */}
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 12px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {filters.map(f => <Chip key={f} active={f === filter} onClick={() => setFilter(f)}>{f}</Chip>)}
        </div>

        {/* Stories rail */}
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[
            { name: '내 바', tone: 'amber', mine: true },
            { name: '혜진', tone: 'clear' },
            { name: '민수', tone: 'green' },
            { name: '도윤', tone: 'red' },
            { name: '수아', tone: 'amber' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                width: 54, height: 54, borderRadius: '50%',
                background: s.mine ? 'var(--paper-100)' : 'transparent',
                padding: s.mine ? 0 : 2,
                border: s.mine ? '1.5px dashed var(--paper-300)' : 'none',
                backgroundImage: s.mine ? 'none' : 'linear-gradient(135deg, var(--amber-300), var(--amber-500))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: s.mine ? 54 : 50, height: s.mine ? 54 : 50, borderRadius: '50%',
                  background: s.tone === 'amber' ? 'linear-gradient(135deg, #e4a83c, #6d4410)' :
                              s.tone === 'clear' ? 'linear-gradient(135deg, #e8dfc9, #70583a)' :
                              s.tone === 'green' ? 'linear-gradient(135deg, #7a8a4a, #2e3a14)' :
                              'linear-gradient(135deg, #c63820, #4a0e05)',
                  border: '2px solid var(--paper-50)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 700,
                }}>{s.mine ? '+' : ''}</div>
              </div>
              <div style={{ fontSize: 'var(--fs-xs)', marginTop: 4, color: 'var(--ink-900)' }}>{s.name}</div>
            </div>
          ))}
        </div>

        {/* Posts */}
        <div style={{ padding: '0 20px' }}>
          {posts.map((p, i) => (
            <div key={i} onClick={() => go('post')} style={{
              background: 'var(--paper-100)',
              border: '1px solid rgba(184,163,132,0.2)',
              borderRadius: 'var(--r-lg)',
              padding: '16px',
              marginBottom: 12,
              cursor: 'pointer',
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: p.avatar === 'amber' ? 'linear-gradient(135deg, #e4a83c, #6d4410)' :
                              p.avatar === 'clear' ? 'linear-gradient(135deg, #e8dfc9, #70583a)' :
                              'linear-gradient(135deg, #7a8a4a, #2e3a14)',
                  flexShrink: 0,
                }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-md)', fontWeight: 600 }}>{p.user}</div>
                  <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)' }}>{p.handle} · {p.time}</div>
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.18em',
                  padding: '4px 8px',
                  background: 'var(--ink-900)', color: 'var(--amber-200)',
                  borderRadius: 'var(--r-pill)',
                }}>{p.type}</div>
              </div>

              {/* Visual */}
              {p.bottles ? (
                <div style={{
                  background: 'linear-gradient(180deg, #2a1a10, var(--ink-900))',
                  borderRadius: 'var(--r-md)',
                  padding: '20px 16px 0',
                  overflow: 'hidden',
                  marginBottom: 12,
                }}>
                  <div style={{ display: 'flex', gap: -8, justifyContent: 'center', alignItems: 'flex-end' }}>
                    {['amber', 'clear', 'green', 'amber', 'red'].map((tn, j) => (
                      <div key={j} style={{ marginRight: -8 }}>
                        <Bottle tone={tn} height={70 + (j % 2 === 0 ? 10 : 0)} level={0.7 + (j * 0.05)}/>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    height: 5, marginTop: 4,
                    background: 'linear-gradient(180deg, var(--brass) 0%, #2e180a 100%)',
                  }}/>
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(180deg, #2a1a10, var(--ink-900))',
                  borderRadius: 'var(--r-md)',
                  padding: '16px',
                  display: 'flex', justifyContent: 'center',
                  marginBottom: 12,
                }}>
                  <CocktailGlass tone={p.tone} size={120} glassStyle={p.glass}/>
                </div>
              )}

              {/* Body */}
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-lg)', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{p.title}</div>
              <p style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)', marginTop: 4, lineHeight: 1.5 }}>{p.body}</p>

              {/* Actions */}
              <div style={{
                display: 'flex', gap: 16, marginTop: 12, paddingTop: 12,
                borderTop: '1px solid var(--paper-200)',
                fontSize: 'var(--fs-sm)', color: 'var(--paper-400)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M7 12s-5-3-5-7a3 3 0 015-2 3 3 0 015 2c0 4-5 7-5 7z"/></svg>
                  {p.likes}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 3h10v7H5l-3 3V3z" strokeLinejoin="round"/></svg>
                  {p.comments}
                </span>
                <span style={{ marginLeft: 'auto', color: 'var(--amber-500)', fontWeight: 600 }}>
                  {p.type === 'RECIPE' ? '내 바로 저장 →' : '자세히 →'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TabBar current="feed" onChange={(t) => go(t)}/>
    </div>
  );
}

function PostScreen({ go }) {
  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('feed')}/>} title="게시물" serif={false}
        right={<IconBtn><svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 1l2 4 4 .5-3 3 1 4-4-2-4 2 1-4-3-3 4-.5z"/></svg></IconBtn>}
      />

      <div className="content" style={{ padding: '0 20px 40px' }}>
        {/* Author */}
        <div onClick={() => go('profile')} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #e4a83c, #6d4410)', flexShrink: 0 }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14.5, fontWeight: 600 }}>바텐더 김</div>
            <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)' }}>@bartender_kim · 서울 · 2시간 전</div>
          </div>
          <button style={{
            padding: '8px 12px', borderRadius: 'var(--r-pill)',
            background: 'var(--ink-900)', color: 'var(--paper-50)',
            border: 'none', fontSize: 'var(--fs-xs)', fontWeight: 600, cursor: 'pointer',
          }}>팔로우</button>
        </div>

        {/* Hero image */}
        <div style={{
          background: 'linear-gradient(180deg, #2a1a10, var(--ink-900))',
          borderRadius: 'var(--r-lg)',
          padding: '30px 20px',
          display: 'flex', justifyContent: 'center',
          marginBottom: 16,
          position: 'relative',
        }}>
          <CocktailGlass tone="amber" size={180} glassStyle="rocks"/>
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'rgba(0,0,0,0.4)', padding: '4px 12px',
            borderRadius: 'var(--r-pill)',
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.15em',
            color: 'var(--amber-200)',
          }}>RECIPE</div>
        </div>

        {/* Title */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.22em', color: 'var(--amber-500)', textTransform: 'uppercase' }}>SMOKY · AGAVE</div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 8 }}>
          Oaxacan Old Fashioned
        </h1>

        <p style={{ fontSize: 'var(--fs-md)', color: 'var(--ink-800)', marginTop: 12, lineHeight: 1.6 }}>
          전통 Old Fashioned에 메즈칼을 더해 스모키하면서도 깊이 있는 플레이버를 만들었습니다.
          큰 얼음 한 덩어리와 오렌지 껍질이 핵심이에요.
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          {['#메즈칼', '#위스키', '#홈바', '#클래식'].map(t => (
            <span key={t} style={{
              padding: '5px 12px', fontSize: 'var(--fs-xs)', color: 'var(--amber-600)',
              background: 'var(--amber-50)', borderRadius: 'var(--r-pill)',
              border: '1px solid rgba(200,162,101,0.25)',
            }}>{t}</span>
          ))}
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', gap: 24, padding: '12px 0', marginTop: 12,
          borderTop: '1px solid var(--paper-200)',
          borderBottom: '1px solid var(--paper-200)',
          alignItems: 'center',
        }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-md)', cursor: 'pointer', color: 'var(--danger)', fontWeight: 600 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M9 15.5s-6-4-6-8.5a4 4 0 016-2 4 4 0 016 2c0 4.5-6 8.5-6 8.5z"/></svg>
            124
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-md)', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 4h12v9H6l-3 3V4z" strokeLinejoin="round"/></svg>
            18
          </button>
          <button style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 2h10v14l-5-3-5 3V2z" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Comments */}
        <Eyebrow style={{ marginTop: 16 }}>COMMENTS · 18</Eyebrow>
        <div style={{ marginTop: 12 }}>
          {[
            { user: '혜진', time: '1h', body: '메즈칼 종류는 어떤 걸 쓰셨어요? Del Maguey?' },
            { user: '도윤', time: '45m', body: '오늘 저녁에 바로 만들어봐야겠어요 🥃' },
            { user: '수아', time: '20m', body: '스모크 향이 진짜 잘 살겠네요.' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #b8a384, #6a5333)',
                flexShrink: 0,
              }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--fs-sm)' }}>
                  <strong style={{ fontFamily: 'var(--font-serif)', fontWeight: 600 }}>{c.user}</strong>
                  <span style={{ color: 'var(--paper-400)', fontSize: 'var(--fs-xs)', marginLeft: 8 }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 'var(--fs-md)', color: 'var(--ink-800)', marginTop: 4, lineHeight: 1.5 }}>{c.body}</div>
                <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', marginTop: 4, display: 'flex', gap: 12 }}>
                  <span>답글</span>
                  <span>♡ 3</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment input */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 16px 20px',
        background: 'var(--paper-50)',
        borderTop: '1px solid var(--paper-200)',
        display: 'flex', gap: 8, alignItems: 'center', zIndex: 5,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #e4a83c, #6d4410)', flexShrink: 0,
        }}/>
        <input placeholder="댓글 남기기..." style={{
          flex: 1, padding: '12px 12px',
          background: 'var(--paper-100)',
          border: '1px solid var(--paper-200)',
          borderRadius: 'var(--r-pill)',
          fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-md)',
          outline: 'none',
        }}/>
        <button style={{
          padding: '9px 16px',
          background: 'var(--ink-900)', color: 'var(--amber-200)',
          border: 'none', borderRadius: 'var(--r-pill)',
          fontSize: 'var(--fs-sm)', fontWeight: 600, cursor: 'pointer',
        }}>올리기</button>
      </div>
    </div>
  );
}

function ProfileScreen({ go }) {
  return (
    <div className="screen active" style={{ background: 'var(--paper-50)' }}>
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('feed')}/>} title="" right={<IconBtn><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="3" cy="8" r="1.3"/><circle cx="8" cy="8" r="1.3"/><circle cx="13" cy="8" r="1.3"/></svg></IconBtn>}/>

      <div className="content">
        {/* Avatar + stats */}
        <div style={{ padding: '4px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #e4a83c, #6d4410)',
              border: '3px solid var(--brass)',
              boxShadow: '0 4px 14px rgba(60,32,10,0.18)',
              flexShrink: 0,
            }}/>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, textAlign: 'center' }}>
              {[
                { n: '42', l: 'POSTS' },
                { n: '1.2k', l: 'FOLLOWERS' },
                { n: '328', l: 'FOLLOWING' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-xl)', fontWeight: 700, color: 'var(--ink-900)' }}>{s.n}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.18em', color: 'var(--paper-400)' }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xxs)', letterSpacing: '0.22em', color: 'var(--amber-500)', textTransform: 'uppercase' }}>SEOUL · HOME BAR</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h2)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginTop: 8, color: 'var(--ink-900)' }}>
            바텐더 <em style={{ color: 'var(--amber-500)' }}>김</em>
          </h1>
          <p style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)', marginTop: 8, lineHeight: 1.5 }}>
            위스키 3년차 · 스모키한 한 잔을 사랑하는 사람<br/>
            매주 수요일 실험 기록 공유합니다.
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={{
              flex: 1, padding: '12px',
              background: 'var(--ink-900)', color: 'var(--paper-50)',
              border: 'none', borderRadius: 'var(--r-md)',
              fontSize: 'var(--fs-md)', fontWeight: 600, cursor: 'pointer',
            }}>팔로우</button>
            <button style={{
              flex: 1, padding: '12px',
              background: 'transparent', color: 'var(--ink-900)',
              border: '1.5px solid var(--paper-300)',
              borderRadius: 'var(--r-md)',
              fontSize: 'var(--fs-md)', fontWeight: 500, cursor: 'pointer',
            }}>메시지</button>
          </div>
        </div>

        {/* My shelf */}
        <div style={{ padding: '4px 20px 40px' }}>
          <Eyebrow>THE SHELF · 23 BOTTLES</Eyebrow>
          <div style={{
            marginTop: 12,
            background: 'linear-gradient(180deg, #2a1a10, var(--ink-900))',
            borderRadius: 'var(--r-md)',
            padding: '20px 12px 0',
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', gap: -8, justifyContent: 'center', alignItems: 'flex-end' }}>
              {['amber', 'clear', 'green', 'red', 'amber', 'clear', 'amber'].map((tn, j) => (
                <div key={j} style={{ marginRight: -6 }}>
                  <Bottle tone={tn} height={62 + (j % 2 === 0 ? 6 : 0)} level={0.5 + (j * 0.05)}/>
                </div>
              ))}
            </div>
            <div style={{
              height: 4, marginTop: 4,
              background: 'linear-gradient(180deg, var(--brass) 0%, #2e180a 100%)',
            }}/>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid var(--paper-200)',
            marginTop: 20,
          }}>
            {['POSTS', 'RECIPES', 'SAVED'].map((t, i) => (
              <button key={t} style={{
                flex: 1, padding: '12px 0',
                background: 'none', border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)',
                letterSpacing: '0.18em',
                color: i === 0 ? 'var(--ink-900)' : 'var(--paper-400)',
                borderBottom: i === 0 ? '2px solid var(--amber-400)' : '2px solid transparent',
                cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>

          {/* Post grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginTop: 12 }}>
            {[
              { tone: 'amber', glass: 'rocks' },
              { tone: 'red', glass: 'coupe' },
              { tone: 'amber', glass: 'martini' },
              { tone: 'green', glass: 'rocks' },
              { tone: 'clear', glass: 'highball' },
              { tone: 'amber', glass: 'rocks' },
            ].map((p, i) => (
              <div key={i} style={{
                aspectRatio: '1/1',
                background: 'linear-gradient(180deg, var(--paper-100), var(--paper-200))',
                borderRadius: 'var(--r-sm)',
                border: '1px solid rgba(184,163,132,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', cursor: 'pointer',
              }} onClick={() => go('post')}>
                <CocktailGlass tone={p.tone} size={85} glassStyle={p.glass}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FeedScreen, PostScreen, ProfileScreen });
