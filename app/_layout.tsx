import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Fraunces_400Regular, Fraunces_600SemiBold } from '@expo-google-fonts/fraunces';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular } from '@expo-google-fonts/jetbrains-mono';
import {
  NotoSerifKR_400Regular,
  NotoSerifKR_600SemiBold,
  NotoSerifKR_700Bold,
} from '@expo-google-fonts/noto-serif-kr';
import { useAuthStore } from '@/store/authStore';
import { authEventEmitter } from '@/api/client';

SplashScreen.preventAutoHideAsync().catch(() => {
  /* noop — already hidden 등 무해한 케이스 */
});

export default function RootLayout() {
  const router = useRouter();
  const { initialize, isLoading } = useAuthStore();

  // 401 → refresh 실패 시 client.ts 인터셉터가 authEventEmitter.emit('logout') 발행.
  // authStore가 isAuthenticated=false로 클리어한 직후 사용자를 로그인 화면으로 강제 이동.
  // (사용자 직접 로그아웃은 profile.tsx에서 별도 router.replace로 처리 — 중복 호출 무해.)
  useEffect(() => {
    const unsubscribe = authEventEmitter.on('logout', () => {
      router.replace('/(auth)/login');
    });
    return unsubscribe;
  }, [router]);

  const [fontsLoaded] = useFonts({
    Fraunces_400Regular,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_400Regular,
    NotoSerifKR_400Regular,
    NotoSerifKR_600SemiBold,
    NotoSerifKR_700Bold,
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <KeyboardProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }} />
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
