import { Redirect } from 'expo-router';

export default function Index() {
  // TEMP-DEBUG: 개발 중 진입 경로. 배포 전 (auth)/login으로 원복할 것.
  // 원복 위치: 작업 24 (실기기 테스트) 또는 배포 직전.
  // 원복 시: useAuthStore.isAuthenticated 분기 복원 + Redirect href를 '/(auth)/login'으로.
  return <Redirect href="/_debug" />;
}
