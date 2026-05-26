import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

/**
 * 앱 진입점. authStore.isAuthenticated 값에 따라 분기:
 *  - true  → 메인 탭 (재방문 / 자동 로그인)
 *  - false → 로그인 Front Door
 *
 * authStore.initialize()가 _layout.tsx에서 호출되어 SecureStore의 토큰을 확인하고,
 * 그 결과로 isAuthenticated가 세팅된 후 이 컴포넌트가 렌더된다.
 * (isLoading 동안은 _layout.tsx가 null 반환 → 스플래시 유지)
 *
 * 개발 중에는 디버그 메뉴(/_debug)로 직접 진입 가능 — 라우트 자체는 살아있음.
 */
export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/(tabs)' : '/(auth)/login'} />;
}
