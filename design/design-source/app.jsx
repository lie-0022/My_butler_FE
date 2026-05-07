/* Main app — state + router + Tweaks + screen info */

const { useState, useEffect, useCallback } = React;

// ─────────────────────────────────────────────
// React Native 라우트 매핑 (Expo Router)
// ─────────────────────────────────────────────
// [디자인]         → [RN 라우트]
// login           → app/(auth)/login.tsx
// loginEmail      → app/(auth)/login-email.tsx (신규)
// forgotPassword  → app/(auth)/forgot-password.tsx (기존, 디자인 신규)
// signup1         → app/(auth)/register.tsx
// signup2         → app/(onboarding)/step1.tsx (신규 - 기존 비어있음)
// signup3         → app/(onboarding)/step2.tsx
// welcome         → app/(onboarding)/step3.tsx
// bar             → app/(tabs)/index.tsx (홈 탭)
// recipe          → app/(tabs)/recipes.tsx (신규 탭)
// feed            → app/(tabs)/feed.tsx (신규 탭)
// (ar)            → app/(tabs)/ar.tsx (placeholder, "준비 중")
// profile         → app/(tabs)/profile.tsx
// barDetail       → app/bottle/[id].tsx (스택)
// barAdd          → app/bottle/new.tsx (스택)
// barInsight      → app/bar/insight.tsx (스택)
// recipeDetail    → app/recipe/[id].tsx (스택)
// recipeMissing   → app/recipe/[id]/missing.tsx (스택)
// post            → app/post/[id].tsx (스택)
// ─────────────────────────────────────────────

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "radius": 1,
  "accent": "amber"
}/*EDITMODE-END*/;

const SCREEN_META = {
  login:     { section: 'Onboarding', title: 'Front Door', desc: '바 카운터의 병이 시그니처 — 에디토리얼한 타이포와 함께 입장 분위기를 조성합니다.' },
  loginEmail: { section: 'Onboarding', title: 'Email Sign-in', desc: '이메일 로그인 폼. paper 톤으로 랜딩과 시각적 대비, 비밀번호 찾기·가입 분기 진입점.' },
  forgotPassword: { section: 'Onboarding', title: 'Reset Password', desc: '2단계 구조 — 이메일 입력 후 발송 완료 상태로 전환. 메일 아이콘과 입력 이메일 미러링.' },
  signup1:   { section: 'Onboarding', title: 'Account', desc: '3단계 구조. 상단 진행 도트 + 시리얼 넘버 스타일의 스텝 표기.' },
  signup2:   { section: 'Onboarding', title: 'Profile', desc: '레벨 칩과 생년월일 세리프 숫자로 "기록" 감성을 유지합니다.' },
  signup3:   { section: 'Onboarding', title: 'Taste Shelf', desc: '병 일러스트를 선택지에 내장 — 카테고리가 곧 선반입니다.' },
  welcome:   { section: 'Onboarding', title: 'Welcome In', desc: '병 3개의 실루엣으로 입장을 환영합니다.' },
  bar:       { section: 'My Bar', title: 'The Counter', desc: '바 카운터 메타포 — 병 게이지로 재고를, 브라스 선반으로 무드를.' },
  barDetail: { section: 'My Bar', title: 'Bottle Biography', desc: '제품 상세를 에디토리얼 페이지처럼 — 큰 병 히어로 + 스탯 + 타임라인.' },
  barAdd:    { section: 'My Bar', title: 'Pour In', desc: '스캔을 최상단 CTA로. 병 톤을 직접 고르는 비주얼 입력.' },
  barInsight:{ section: 'My Bar', title: 'Monthly Counter', desc: '이번 달 소비를 숫자 카드와 바 차트로 정리.' },
  recipe:    { section: 'Recipe', title: 'The Recipe Book', desc: '오늘 밤의 한 잔을 히어로로, 만들 수 있는 것과 없는 것을 구분.' },
  recipeDetail: { section: 'Recipe', title: 'Cocktail Recipe', desc: '어두운 히어로 + 밝은 지면 분할. 재료 테이블 + 단계 넘버링.' },
  recipeMissing:{ section: 'Recipe', title: 'Almost There', desc: '진행률을 앰버 톤으로. 대체 재료/대체 칵테일 제안.' },
  feed:      { section: 'Community', title: 'Counter Talk', desc: '스토리 레일 + 카드 피드. 병/잔 비주얼을 공통 언어로.' },
  post:      { section: 'Community', title: 'Post Detail', desc: '게시물을 한 편의 에디토리얼처럼 — 태그, 댓글, 입력까지.' },
  profile:   { section: 'Community', title: 'The Shelf View', desc: '프로필의 히어로는 "내 선반". 정체성 = 소장품.' },
};

const INVENTORY = [
  { name: 'Lagavulin 16', category: '위스키', tone: 'amber', level: 0.42, volume: 700, abv: 43, label: 'LAGAVULIN' },
  { name: 'Hendricks Gin', category: '진', tone: 'clear', level: 0.78, volume: 700, abv: 41.4, label: 'HENDRICKS' },
  { name: 'Campari', category: '리큐르', tone: 'red', level: 0.22, volume: 750, abv: 25, label: 'CAMPARI' },
  { name: 'Green Chartreuse', category: '리큐르', tone: 'green', level: 0.65, volume: 700, abv: 55, label: 'CHARTREUSE' },
  { name: 'Dolin Rouge', category: '리큐르', tone: 'red', level: 0.15, volume: 750, abv: 16, label: 'DOLIN' },
  { name: 'Bulleit Bourbon', category: '위스키', tone: 'amber', level: 0.88, volume: 700, abv: 45, label: 'BULLEIT' },
  { name: 'Plantation Rum', category: '럼', tone: 'amber', level: 0.55, volume: 700, abv: 40, label: 'PLANTATION' },
];

function App() {
  const [screen, setScreen] = useState(() => localStorage.getItem('mybutler:screen') || 'bar');
  const [user, setUser] = useState({ email: 'you@bar.com', nickname: '바텐더', level: '즐김', tastes: ['whisky', 'gin'], flavors: ['스모키', '드라이'] });
  const [toastMsg, setToastMsg] = useState('');

  const go = useCallback((s) => {
    if (s === 'bar' || s === 'recipe' || s === 'ar' || s === 'feed') {
      const map = { ar: 'bar', bar: 'bar', recipe: 'recipe', feed: 'feed' };
      setScreen(map[s]);
      localStorage.setItem('mybutler:screen', map[s]);
      return;
    }
    setScreen(s);
    localStorage.setItem('mybutler:screen', s);
  }, []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    const t = document.getElementById('toast');
    if (t) {
      t.textContent = msg;
      t.classList.add('show');
      setTimeout(() => t.classList.remove('show'), 1800);
    }
  }, []);

  // update screen info panel
  useEffect(() => {
    const m = SCREEN_META[screen];
    if (!m) return;
    document.getElementById('screenSection').textContent = m.section;
    document.getElementById('screenTitle').textContent = m.title;
    document.getElementById('screenDesc').textContent = m.desc;
    document.querySelectorAll('.flow-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.screen === screen);
    });
  }, [screen]);

  // wire left rail buttons once
  useEffect(() => {
    const handler = (e) => {
      const btn = e.target.closest('.flow-btn');
      if (btn) go(btn.dataset.screen);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [go]);

  // Tweaks: radius + accent segmented controls (in right rail)
  useEffect(() => {
    const apply = (r, a) => {
      document.documentElement.style.setProperty('--r-mult', r);
      const accents = {
        amber:  { '--amber-300': '#e4a83c', '--amber-400': '#c88820', '--amber-200': '#f2c977', '--amber-500': '#9a6414' },
        brass:  { '--amber-300': '#c8a265', '--amber-400': '#a1813f', '--amber-200': '#e0c791', '--amber-500': '#7a5e2a' },
        copper: { '--amber-300': '#c9793c', '--amber-400': '#9e5620', '--amber-200': '#e0a479', '--amber-500': '#773e16' },
      };
      const vars = accents[a] || accents.amber;
      Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    };
    apply(TWEAK_DEFAULTS.radius, TWEAK_DEFAULTS.accent);

    const rSeg = document.getElementById('radiusSeg');
    const aSeg = document.getElementById('accentSeg');
    let curR = TWEAK_DEFAULTS.radius, curA = TWEAK_DEFAULTS.accent;

    const rClick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      curR = parseFloat(b.dataset.r);
      [...rSeg.children].forEach(c => c.classList.toggle('active', c === b));
      apply(curR, curA);
    };
    const aClick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      curA = b.dataset.a;
      [...aSeg.children].forEach(c => c.classList.toggle('active', c === b));
      apply(curR, curA);
    };
    rSeg.addEventListener('click', rClick);
    aSeg.addEventListener('click', aClick);
    return () => {
      rSeg.removeEventListener('click', rClick);
      aSeg.removeEventListener('click', aClick);
    };
  }, []);

  // Tweaks mode protocol
  useEffect(() => {
    const handler = (e) => {
      const d = e.data;
      if (!d || !d.type) return;
      if (d.type === '__activate_edit_mode') {
        // show a floating compact tweaks panel inside device too
        const el = document.getElementById('floatingTweaks');
        if (el) el.style.display = 'flex';
      }
      if (d.type === '__deactivate_edit_mode') {
        const el = document.getElementById('floatingTweaks');
        if (el) el.style.display = 'none';
      }
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const byName = {
    login: <LoginScreen go={go}/>,
    loginEmail: <LoginEmail go={go} toast={toast}/>,
    forgotPassword: <ForgotPassword go={go} toast={toast}/>,
    signup1: <Signup1 go={go} user={user} setUser={setUser}/>,
    signup2: <Signup2 go={go} user={user} setUser={setUser}/>,
    signup3: <Signup3 go={go} user={user} setUser={setUser}/>,
    welcome: <Welcome go={go} user={user}/>,
    bar: <BarScreen go={go} inventory={INVENTORY}/>,
    barDetail: <BarDetailScreen go={go}/>,
    barAdd: <BarAddScreen go={go} toast={toast}/>,
    barInsight: <BarInsightScreen go={go}/>,
    recipe: <RecipeScreen go={go}/>,
    recipeDetail: <RecipeDetailScreen go={go}/>,
    recipeMissing: <RecipeMissingScreen go={go}/>,
    feed: <FeedScreen go={go}/>,
    post: <PostScreen go={go}/>,
    profile: <ProfileScreen go={go}/>,
  };
  return byName[screen] || byName.bar;
}

const root = ReactDOM.createRoot(document.getElementById('screens-root'));
root.render(<App />);
