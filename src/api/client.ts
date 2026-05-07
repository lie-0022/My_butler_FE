import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// SecureStore 키
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_COOKIE_KEY = 'refresh_token_cookie'; // 쿠키 값 수동 저장

export const tokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),

  getRefreshCookie: () => SecureStore.getItemAsync(REFRESH_TOKEN_COOKIE_KEY),
  setRefreshCookie: (cookie: string) => SecureStore.setItemAsync(REFRESH_TOKEN_COOKIE_KEY, cookie),
  removeRefreshCookie: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_COOKIE_KEY),

  clear: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_COOKIE_KEY);
  },
};

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: access token 자동 주입
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터: 401 시 refresh 토큰으로 재발급
let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    // login/register 응답에서 Set-Cookie 헤더의 refresh_token 추출 후 저장
    const setCookie = response.headers['set-cookie'];
    if (setCookie) {
      const cookieStr = Array.isArray(setCookie) ? setCookie.join('; ') : setCookie;
      const match = cookieStr.match(/refresh_token=([^;]+)/);
      if (match) {
        tokenStorage.setRefreshCookie(match[1]);
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshCookie = await tokenStorage.getRefreshCookie();
        if (!refreshCookie) throw new Error('No refresh token');

        const refreshResponse = await axios.post(
          `${BASE_URL}/api/v1/auth/refresh`,
          {},
          {
            headers: {
              Cookie: `refresh_token=${refreshCookie}; Path=/api/v1/auth/refresh`,
            },
          },
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (!newAccessToken) throw new Error('No access token in refresh response');

        await tokenStorage.setAccessToken(newAccessToken);

        // 새 refresh cookie 저장
        const newCookieHeader = refreshResponse.headers['set-cookie'];
        if (newCookieHeader) {
          const cookieStr = Array.isArray(newCookieHeader)
            ? newCookieHeader.join('; ')
            : newCookieHeader;
          const match = cookieStr.match(/refresh_token=([^;]+)/);
          if (match) {
            await tokenStorage.setRefreshCookie(match[1]);
          }
        }

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        await tokenStorage.clear();
        // 전역 로그아웃 이벤트 (authStore에서 처리)
        authEventEmitter.emit('logout');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// 간단한 이벤트 이미터 (로그아웃 신호용)
type Listener = () => void;
export const authEventEmitter = {
  listeners: new Map<string, Listener[]>(),
  emit(event: string) {
    this.listeners.get(event)?.forEach((fn) => fn());
  },
  on(event: string, listener: Listener) {
    const existing = this.listeners.get(event) ?? [];
    this.listeners.set(event, [...existing, listener]);
    return () => {
      const current = this.listeners.get(event) ?? [];
      this.listeners.set(
        event,
        current.filter((fn) => fn !== listener),
      );
    };
  },
};

export default apiClient;
