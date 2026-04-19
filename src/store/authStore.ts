import { create } from 'zustand';
import { tokenStorage, authEventEmitter } from '../api/client';
import { authApi } from '../api/auth';
import type { UserProfileResponse } from '../types/user';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfileResponse | null;

  // 앱 시작 시 토큰 확인
  initialize: () => Promise<void>;

  // 로그인 후 user 세팅
  setUser: (user: UserProfileResponse) => void;

  // 로그아웃
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // 인터셉터에서 발생하는 전역 로그아웃 이벤트 구독
  authEventEmitter.on('logout', () => {
    set({ isAuthenticated: false, user: null });
  });

  return {
    isAuthenticated: false,
    isLoading: true,
    user: null,

    initialize: async () => {
      try {
        const token = await tokenStorage.getAccessToken();
        set({ isAuthenticated: !!token, isLoading: false });
      } catch {
        set({ isAuthenticated: false, isLoading: false });
      }
    },

    setUser: (user) => {
      set({ isAuthenticated: true, user });
    },

    logout: async () => {
      try {
        await authApi.logout();
      } catch {
        // 서버 오류여도 로컬은 정리
        await tokenStorage.clear();
      }
      set({ isAuthenticated: false, user: null });
    },
  };
});
