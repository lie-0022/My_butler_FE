import apiClient from './client';
import type { ApiResponse, PageResponse } from '../types/common';
import type {
  CommentCreateResponse,
  CommentResponse,
  CreateCommentRequest,
  LikeResponse,
  PostDetailResponse,
  PostSortKey,
  PostSummaryResponse,
} from '../types/post';

interface FeedParams {
  sort?: PostSortKey;
  page?: number;
  size?: number;
}

export const postApi = {
  /** GET /posts — 피드 (페이지네이션)
   * NOTE: BE Controller의 @RequestParam("sort")와 Spring Pageable의 sort 파라미터가 충돌해서
   * sort=LATEST/POPULAR 보내면 ORDER BY p.LATEST asc로 잘못 해석돼 500. 우회로 sort는 제거하고
   * BE default(LATEST)만 사용. 정렬 분기는 BE 수정 후 복구.
   */
  getFeed: async (params?: FeedParams) => {
    const { sort: _ignored, ...rest } = params ?? {};
    void _ignored;
    const res = await apiClient.get<ApiResponse<PageResponse<PostSummaryResponse>>>('/posts', {
      params: rest,
    });
    return res.data;
  },

  /** GET /posts/my — 내 게시물 (프로필 그리드) */
  listMine: async () => {
    const res = await apiClient.get<ApiResponse<PageResponse<PostSummaryResponse>>>('/posts/my');
    return res.data;
  },

  getById: async (id: number) => {
    const res = await apiClient.get<ApiResponse<PostDetailResponse>>(`/posts/${id}`);
    return res.data;
  },

  remove: async (id: number) => {
    await apiClient.delete(`/posts/${id}`);
  },

  // ─── Likes (no body) ─────────────────────────────────────────────────────

  like: async (id: number) => {
    const res = await apiClient.post<ApiResponse<LikeResponse>>(`/posts/${id}/likes`);
    return res.data;
  },

  unlike: async (id: number) => {
    const res = await apiClient.delete<ApiResponse<LikeResponse>>(`/posts/${id}/likes`);
    return res.data;
  },

  // ─── Comments ────────────────────────────────────────────────────────────

  getComments: async (id: number, params?: { page?: number; size?: number; sort?: string }) => {
    const res = await apiClient.get<ApiResponse<PageResponse<CommentResponse>>>(
      `/posts/${id}/comments`,
      { params },
    );
    return res.data;
  },

  addComment: async (id: number, data: CreateCommentRequest) => {
    const res = await apiClient.post<ApiResponse<CommentCreateResponse>>(
      `/posts/${id}/comments`,
      data,
    );
    return res.data;
  },

  deleteComment: async (id: number, commentId: number) => {
    await apiClient.delete(`/posts/${id}/comments/${commentId}`);
  },

  addReply: async (id: number, commentId: number, data: CreateCommentRequest) => {
    const res = await apiClient.post<ApiResponse<CommentCreateResponse>>(
      `/posts/${id}/comments/${commentId}/replies`,
      data,
    );
    return res.data;
  },

  deleteReply: async (id: number, commentId: number, replyId: number) => {
    await apiClient.delete(`/posts/${id}/comments/${commentId}/replies/${replyId}`);
  },
};
