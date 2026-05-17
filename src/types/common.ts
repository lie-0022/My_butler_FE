/**
 * 백엔드 공통 응답 envelope + 페이지 응답 타입.
 *
 * 성공: { success: true, data: T }       — 204 No Content는 data=null
 * 실패: { code, message, errors[] }       — ApiResponse 미적용, GlobalExceptionHandler 응답.
 *        ↑ 이 형태는 parseApiError에서 처리한다.
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

/** Spring Data 표준 페이지 응답. ?page=0&size=20&sort=createdAt,desc */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
