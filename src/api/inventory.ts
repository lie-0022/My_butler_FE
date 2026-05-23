import apiClient from './client';
import type { ApiResponse, PageResponse } from '../types/common';
import type {
  Category,
  CreateInventoryItemRequest,
  InventoryHomeResponse,
  InventoryInsightsResponse,
  InventoryItemDetailResponse,
  InventoryItemSummary,
  ScanResultResponse,
  UpdateInventoryItemRequest,
  UpdateLevelRequest,
} from '../types/inventory';

interface ListParams {
  category?: Category;
  page?: number;
  size?: number;
  sort?: string;
}

export const inventoryApi = {
  /** GET /inventory/home — 홈 카드 데이터 (insights + categoryCount + 최근 inventory 페이지) */
  getHome: async (params?: { page?: number; size?: number }) => {
    const res = await apiClient.get<ApiResponse<InventoryHomeResponse>>('/inventory/home', {
      params,
    });
    return res.data;
  },

  list: async (params?: ListParams) => {
    const res = await apiClient.get<ApiResponse<PageResponse<InventoryItemSummary>>>('/inventory', {
      params,
    });
    return res.data;
  },

  create: async (data: CreateInventoryItemRequest) => {
    const res = await apiClient.post<ApiResponse<InventoryItemDetailResponse>>('/inventory', data);
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<InventoryItemDetailResponse>>(`/inventory/${id}`);
    return res.data;
  },

  update: async (id: number, data: UpdateInventoryItemRequest) => {
    const res = await apiClient.put<ApiResponse<InventoryItemDetailResponse>>(
      `/inventory/${id}`,
      data,
    );
    return res.data;
  },

  remove: async (id: number) => {
    await apiClient.delete(`/inventory/${id}`);
  },

  /** PATCH /inventory/{id}/open — 개봉 처리 */
  open: async (id: number) => {
    const res = await apiClient.patch<ApiResponse<InventoryItemDetailResponse>>(
      `/inventory/${id}/open`,
    );
    return res.data;
  },

  /** PATCH /inventory/{id}/level — 잔량 상태 변경 (FULL/HALF/LOW) */
  updateLevel: async (id: number, data: UpdateLevelRequest) => {
    const res = await apiClient.patch<ApiResponse<InventoryItemDetailResponse>>(
      `/inventory/${id}/level`,
      data,
    );
    return res.data;
  },

  /** GET /inventory/insights — 인사이트 화면 (카테고리별 분포, 유통기한 경고) */
  getInsights: async () => {
    const res = await apiClient.get<ApiResponse<InventoryInsightsResponse>>('/inventory/insights');
    return res.data;
  },

  /**
   * POST /inventory/scan — 라벨 OCR 스캔.
   * 이미지 파일을 multipart로 업로드 → BE가 OCR + 구조화 → 추출 결과 반환.
   * FormData는 client.ts의 snake_case 변환 인터셉터를 통과하므로 그대로 전송됨.
   *
   * @param imageUri expo-camera/image-manipulator가 만든 로컬 파일 URI
   */
  scan: async (imageUri: string) => {
    const form = new FormData();
    // RN FormData 파일 형식: { uri, name, type }
    form.append('image', {
      uri: imageUri,
      name: 'label.jpg',
      type: 'image/jpeg',
    } as unknown as Blob);

    const res = await apiClient.post<ApiResponse<ScanResultResponse>>('/inventory/scan', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000, // OCR + LLM 처리 시간 고려해 넉넉히
    });
    return res.data;
  },
};
