import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { keysToCamel, keysToSnake } from '../utils/caseConvert';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

// SecureStore 키
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const tokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) => SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token),
  removeAccessToken: () => SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),

  /**
   * PR #18 이후 refresh_token이 응답 body로 내려옴 (이전엔 HttpOnly Cookie).
   * 단순 SecureStore string 저장.
   */
  getRefreshToken: () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) => SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: () => SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),

  clear: async () => {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  },
};

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: access token 자동 주입 + body/params camelCase → snake_case 변환
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await tokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // BE Jackson SNAKE_CASE 전략 대응. FormData/Blob는 caseConvert가 그대로 통과시킴.
    if (config.data) {
      config.data = keysToSnake(config.data);
    }
    if (config.params) {
      config.params = keysToSnake(config.params);
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
    // 응답 body snake_case → camelCase 변환 (모든 응답 공통)
    if (response.data) {
      response.data = keysToCamel(response.data);
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
        const refreshToken = await tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        // raw axios로 호출 (apiClient 인터셉터의 401 재귀 회피).
        // body로 snake_case 키 전송. 응답도 snake_case (인터셉터 통과 안 함).
        const refreshResponse = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const newAccessToken: string | undefined =
          refreshResponse.data?.data?.access_token ?? refreshResponse.data?.data?.accessToken;
        const newRefreshToken: string | undefined =
          refreshResponse.data?.data?.refresh_token ?? refreshResponse.data?.data?.refreshToken;
        if (!newAccessToken) throw new Error('No access token in refresh response');

        await tokenStorage.setAccessToken(newAccessToken);
        // BE는 refresh rotation — 새 refresh도 같이 내려옴. 갱신 저장.
        if (newRefreshToken) {
          await tokenStorage.setRefreshToken(newRefreshToken);
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
