import { AxiosError } from 'axios';

export interface ParsedApiError {
  message: string;
  status?: number;
  code?: string;
}

interface ApiErrorBody {
  message?: string;
  code?: string;
}

const FALLBACK = '알 수 없는 오류가 발생했습니다.';

export function parseApiError(err: unknown): ParsedApiError {
  if (err instanceof AxiosError) {
    const body = err.response?.data as ApiErrorBody | undefined;
    return {
      message: body?.message ?? err.message ?? FALLBACK,
      status: err.response?.status,
      code: body?.code,
    };
  }
  if (err instanceof Error) {
    return { message: err.message };
  }
  return { message: FALLBACK };
}
