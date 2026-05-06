/* Onboarding flow: login, signup (3 steps), welcome */

function LoginScreen({ go }) {
  return (
    <div className="screen active" style={{ background: 'var(--ink-900)', color: 'var(--paper-50)' }}>
      <SysBar dark />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px 28px 30px', position: 'relative' }}>
        {/* bottle stacked hero */}
        <div style={{
          position: 'absolute', top: 60, right: -20,
          display: 'flex', gap: -16, alignItems: 'flex-end', opacity: 0.7,
        }}>
          <div style={{ marginRight: -20 }}><Bottle tone="amber" height={220} label labelText="RESERVE"/></div>
          <div style={{ marginRight: -20, marginBottom: -20 }}><Bottle tone="clear" height={180} label labelText="DRY GIN"/></div>
          <div style={{ marginBottom: -30 }}><Bottle tone="green" height={150} label labelText="AMARO"/></div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 2 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: '0.22em',
            color: 'var(--brass)', textTransform: 'uppercase', marginBottom: 12,
          }}>MY · BUTLER · 2026</div>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 44, lineHeight: 1.02,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 4,
          }}>
            당신의 서재,<br/>
            <em style={{ color: 'var(--amber-200)', fontWeight: 500 }}>한 잔의 기록</em>
          </h1>
          <p style={{ color: 'var(--paper-400)', fontSize: 'var(--fs-md)', lineHeight: 1.55, marginTop: 12, maxWidth: 290 }}>
            소장한 술과 취향을 기록하고,<br/>오늘 밤의 한 잔을 제안받으세요.
          </p>

          <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CTA variant="amber" onClick={() => go('signup1')}>계정 만들기</CTA>
            <button onClick={() => go('loginEmail')} style={{
              padding: '12px 20px',
              background: 'transparent',
              color: 'var(--paper-50)',
              border: '1.5px solid rgba(250,246,239,0.25)',
              borderRadius: 'var(--r-md)',
              fontSize: 'var(--fs-md)', fontWeight: 500, cursor: 'pointer',
            }}>이미 있어요 · 로그인</button>

            <div style={{
              marginTop: 16, fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', textAlign: 'center',
            }}>
              계속 진행 시 <u>이용약관</u> 및 <u>개인정보처리방침</u>에 동의합니다
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Signup1({ go, setUser, user }) {
  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('login')}/>} title={<span><em style={{color:'var(--amber-400)'}}>01</em> / 03</span>} serif={false}/>
      <ProgressDots step={1} total={3}/>

      <div className="content" style={{ padding: '24px 24px 40px' }}>
        <Eyebrow>STEP ONE</Eyebrow>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700,
          letterSpacing: '-0.02em', lineHeight: 1.15, margin: '8px 0 24px',
        }}>
          먼저 <em style={{ color: 'var(--amber-400)' }}>계정</em>부터<br/>만들어 볼까요?
        </h1>

        <Input
          label="이메일"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="you@bar.com"
          hint="유효한 이메일 형식이에요"
          hintType="ok"
        />
        <Input
          label="비밀번호"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="8자 이상"
          hint="숫자 · 특수문자 포함 권장"
        />
        <Input
          label="비밀번호 확인"
          type="password"
          value={user.password2}
          onChange={(e) => setUser({ ...user, password2: e.target.value })}
          placeholder="한 번 더"
        />

        <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 18, height: 18, borderRadius: 4,
            background: 'var(--amber-300)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11"><path d="M2 5.5L4.5 8l4.5-5" stroke="#1a1412" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--paper-400)', lineHeight: 1.5 }}>
            마케팅 정보 수신 동의 (선택)
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px', background: 'var(--paper-50)' }}>
        <CTA onClick={() => go('signup2')}>다음으로</CTA>
      </div>
    </div>
  );
}

function Signup2({ go, setUser, user }) {
  const levels = ['입문', '즐김', '애호', '전문'];
  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('signup1')}/>} title={<span><em style={{color:'var(--amber-400)'}}>02</em> / 03</span>} serif={false}/>
      <ProgressDots step={2} total={3}/>

      <div className="content" style={{ padding: '24px 24px 40px' }}>
        <Eyebrow>STEP TWO</Eyebrow>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700,
          letterSpacing: '-0.02em', lineHeight: 1.15, margin: '8px 0 24px',
        }}>
          어떻게 <em style={{ color: 'var(--amber-400)' }}>불러드릴까요?</em>
        </h1>

        <Input
          label="닉네임"
          value={user.nickname}
          onChange={(e) => setUser({ ...user, nickname: e.target.value })}
          placeholder="바텐더 김"
        />

        <label style={{
          display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--paper-400)', marginBottom: 12, marginTop: 8,
        }}>음주 경력</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {levels.map((lvl, i) => (
            <Chip key={lvl} active={user.level === lvl} onClick={() => setUser({ ...user, level: lvl })}>{lvl}</Chip>
          ))}
        </div>

        <label style={{
          display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)',
          textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--paper-400)', marginBottom: 12,
        }}>생년월일</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['1995', '03', '14'].map((v, i) => (
            <div key={i} style={{
              flex: i === 0 ? 2 : 1,
              padding: '12px 16px',
              background: 'var(--paper-100)',
              borderRadius: 'var(--r-md)',
              fontFamily: 'var(--font-serif)',
              fontSize: 'var(--fs-lg)', fontWeight: 600,
              textAlign: 'center',
              letterSpacing: '0.04em',
            }}>{v}</div>
          ))}
        </div>
        <div style={{ fontSize: 'var(--fs-xs)', color: 'var(--paper-400)', marginTop: 8, paddingLeft: 4 }}>
          만 19세 이상 확인용 · 공개되지 않아요
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px', background: 'var(--paper-50)' }}>
        <CTA onClick={() => go('signup3')}>다음으로</CTA>
      </div>
    </div>
  );
}

function Signup3({ go, setUser, user }) {
  const tastes = [
    { id: 'whisky', label: '위스키', tone: 'amber' },
    { id: 'gin', label: '진', tone: 'clear' },
    { id: 'rum', label: '럼', tone: 'amber' },
    { id: 'tequila', label: '테킬라', tone: 'clear' },
    { id: 'vodka', label: '보드카', tone: 'clear' },
    { id: 'liqueur', label: '리큐르', tone: 'green' },
    { id: 'wine', label: '와인', tone: 'red' },
    { id: 'beer', label: '맥주', tone: 'amber' },
  ];
  const selected = user.tastes || [];
  const toggle = (id) => {
    const next = selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id];
    setUser({ ...user, tastes: next });
  };
  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('signup2')}/>} title={<span><em style={{color:'var(--amber-400)'}}>03</em> / 03</span>} serif={false}/>
      <ProgressDots step={3} total={3}/>

      <div className="content" style={{ padding: '24px 24px 40px' }}>
        <Eyebrow>STEP THREE</Eyebrow>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700,
          letterSpacing: '-0.02em', lineHeight: 1.15, margin: '8px 0 8px',
        }}>
          어떤 술을 <em style={{ color: 'var(--amber-400)' }}>즐기시나요?</em>
        </h1>
        <p style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)', lineHeight: 1.55, marginBottom: 20 }}>
          여러 개 선택 가능 · 추천에 사용됩니다
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {tastes.map(t => {
            const on = selected.includes(t.id);
            return (
              <button key={t.id} onClick={() => toggle(t.id)} style={{
                padding: '16px 12px',
                background: on ? 'var(--ink-900)' : 'var(--paper-100)',
                color: on ? 'var(--paper-50)' : 'var(--ink-900)',
                border: on ? '1.5px solid var(--ink-900)' : '1.5px solid transparent',
                borderRadius: 'var(--r-md)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 12,
                textAlign: 'left',
                fontFamily: 'var(--font-sans)',
              }}>
                <div style={{ width: 36, flexShrink: 0 }}>
                  <Bottle tone={t.tone} height={52}/>
                </div>
                <div style={{
                  fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em',
                }}>{t.label}</div>
                {on && (
                  <div style={{ marginLeft: 'auto', color: 'var(--amber-300)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 7l3.5 3.5L12 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 20 }}>
          <label style={{
            display: 'block', fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)',
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: 'var(--paper-400)', marginBottom: 12,
          }}>선호 맛 프로필</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['스모키', '드라이', '스위트', '프루티', '허벌', '스파이시', '시트러스'].map(f => {
              const on = (user.flavors || []).includes(f);
              return (
                <Chip key={f} active={on} onClick={() => {
                  const cur = user.flavors || [];
                  setUser({ ...user, flavors: on ? cur.filter(x => x !== f) : [...cur, f] });
                }}>{f}</Chip>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 24px 24px', background: 'var(--paper-50)' }}>
        <CTA variant="amber" onClick={() => go('welcome')} disabled={selected.length === 0}>
          {selected.length ? `${selected.length}개 선택 · 완료` : '하나 이상 선택해주세요'}
        </CTA>
      </div>
    </div>
  );
}

function Welcome({ go, user }) {
  return (
    <div className="screen active" style={{ background: 'var(--ink-900)', color: 'var(--paper-50)' }}>
      <SysBar dark />
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '40px 32px', textAlign: 'center', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '20%',
          display: 'flex', alignItems: 'flex-end', gap: -10,
          opacity: 0.9,
        }}>
          <div style={{ marginRight: -18 }}><Bottle tone="green" height={130}/></div>
          <div style={{ marginRight: -18, marginBottom: -8 }}><Bottle tone="amber" height={160} label labelText="RESERVE"/></div>
          <div style={{ marginBottom: -4 }}><Bottle tone="clear" height={140}/></div>
        </div>

        <div style={{ marginTop: 230 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-xs)', letterSpacing: '0.22em',
            color: 'var(--brass)', textTransform: 'uppercase', marginBottom: 12,
          }}>— WELCOME TO THE COUNTER —</div>

          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 38, lineHeight: 1.05,
            fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12,
          }}>
            반가워요, <em style={{ color: 'var(--amber-200)', fontWeight: 500 }}>{user.nickname || '바텐더'}</em>님.
          </h1>
          <p style={{ fontSize: 'var(--fs-md)', color: 'var(--paper-400)', lineHeight: 1.6, maxWidth: 280, margin: '0 auto' }}>
            이제 당신의 바 카운터를<br/>채워볼 차례예요.
          </p>

          <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
            <CTA variant="amber" onClick={() => go('bar')}>첫 재료 등록하기</CTA>
            <button onClick={() => go('bar')} style={{
              padding: '12px 20px', background: 'transparent',
              color: 'var(--paper-400)', border: 'none',
              fontSize: 'var(--fs-md)', cursor: 'pointer',
            }}>둘러보기 먼저 할게요</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LoginEmail — 이메일 로그인 폼 (paper 톤)
   ───────────────────────────────────────────────────────── */
function LoginEmail({ go, toast }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('login')}/>} title="로그인" serif={false}/>

      <div className="content" style={{ padding: '20px 24px 40px' }}>
        <Eyebrow>WELCOME BACK</Eyebrow>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700,
          letterSpacing: '-0.02em', lineHeight: 1.15, margin: '8px 0 28px',
        }}>
          다시 오신 걸<br/><em style={{ color: 'var(--amber-400)' }}>환영해요</em>
        </h1>

        <Input
          label="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
          <button onClick={() => go('forgotPassword')} style={{
            background: 'none', border: 'none',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)',
            color: 'var(--brass-ink)', cursor: 'pointer',
            padding: '8px 4px', letterSpacing: '-0.01em',
          }}>비밀번호를 잊으셨나요?</button>
        </div>

        <div style={{ marginTop: 20 }}>
          <CTA variant="amber" onClick={() => { toast && toast('환영합니다'); go('bar'); }}>로그인</CTA>
        </div>
      </div>

      <div style={{
        padding: '16px 24px 24px',
        background: 'var(--paper-50)',
        borderTop: '1px dashed var(--paper-300)',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--paper-400)' }}>
          계정이 없으신가요?{' '}
        </span>
        <button onClick={() => go('signup1')} style={{
          background: 'none', border: 'none', padding: 0,
          fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 600,
          color: 'var(--amber-500)', textDecoration: 'underline',
          textUnderlineOffset: 3, cursor: 'pointer',
        }}>가입하기</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ForgotPassword — 2단계: input → sent
   ───────────────────────────────────────────────────────── */
function ForgotPassword({ go, toast }) {
  const [stage, setStage] = React.useState('input'); // 'input' | 'sent'
  const [email, setEmail] = React.useState('');

  const handleSubmit = () => {
    setTimeout(() => setStage('sent'), 1000);
  };

  if (stage === 'input') {
    return (
      <div className="screen active">
        <SysBar />
        <AppBar left={<BackBtn onClick={() => go('loginEmail')}/>} title="비밀번호 찾기" serif={false}/>

        <div className="content" style={{ padding: '20px 24px 40px' }}>
          <Eyebrow>PASSWORD RESET</Eyebrow>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h1)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.15, margin: '8px 0 12px',
          }}>
            <em style={{ color: 'var(--amber-400)' }}>이메일</em>을<br/>알려주세요
          </h1>
          <p style={{
            fontSize: 'var(--fs-md)', color: 'var(--paper-400)', lineHeight: 1.55,
            marginBottom: 24, maxWidth: 280,
          }}>
            가입하신 이메일로 재설정 링크를<br/>보내드릴게요.
          </p>

          <Input
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>

        <div style={{ padding: '12px 24px 24px', background: 'var(--paper-50)' }}>
          <CTA variant="amber" onClick={handleSubmit} disabled={!email}>
            재설정 메일 받기
          </CTA>
        </div>
      </div>
    );
  }

  // stage === 'sent'
  return (
    <div className="screen active">
      <SysBar />
      <AppBar left={<BackBtn onClick={() => go('loginEmail')}/>} title="비밀번호 찾기" serif={false}/>

      <div className="content" style={{
        padding: '40px 24px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', flex: 1,
      }}>
        {/* Mail icon circle */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--paper-100)',
          border: '1px solid rgba(184,163,132,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: 'var(--sh-sm)',
        }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
               stroke="var(--amber-400)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="7" width="20" height="14" rx="2"/>
            <path d="M4 9l10 7 10-7"/>
          </svg>
        </div>

        <Eyebrow>SENT</Eyebrow>
        <h1 style={{
          fontFamily: 'var(--font-serif)', fontSize: 'var(--fs-h2)', fontWeight: 700,
          letterSpacing: '-0.02em', lineHeight: 1.2, margin: '8px 0 12px',
        }}>
          메일을 <em style={{ color: 'var(--amber-400)' }}>보내드렸어요</em>
        </h1>
        <p style={{
          fontSize: 'var(--fs-md)', color: 'var(--ink-800)', lineHeight: 1.6,
          maxWidth: 280, marginBottom: 12,
        }}>
          <strong style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--fs-sm)', color: 'var(--amber-500)' }}>
            {email || 'your@email.com'}
          </strong>
          <br/>으로 재설정 링크를 보냈어요.<br/>메일함을 확인해주세요.
        </p>
        <p style={{
          fontSize: 'var(--fs-sm)', color: 'var(--paper-400)', lineHeight: 1.55,
          maxWidth: 240,
        }}>
          메일이 오지 않았다면<br/>스팸함도 확인해보세요.
        </p>
      </div>

      <div style={{ padding: '12px 24px 24px', background: 'var(--paper-50)' }}>
        <CTA variant="amber" onClick={() => go('loginEmail')}>
          로그인으로 돌아가기
        </CTA>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button onClick={() => { setStage('input'); }} style={{
            background: 'none', border: 'none',
            fontFamily: 'var(--font-sans)', fontSize: 'var(--fs-sm)', fontWeight: 500,
            color: 'var(--brass-ink)', cursor: 'pointer',
            padding: '8px 12px', letterSpacing: '-0.01em',
          }}>다시 받기</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LoginScreen, LoginEmail, ForgotPassword, Signup1, Signup2, Signup3, Welcome });
