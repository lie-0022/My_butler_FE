import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Index() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }
  // TEMP: 작업 12-1 검증용. 작업 12-2에서 login Front Door 완성 후 원복할 것.
  // 원복 방법: '/(auth)/login-email' → '/(auth)/login'
  return <Redirect href="/(auth)/login-email" />;
}
