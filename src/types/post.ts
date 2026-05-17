/**
 * Community / Posts 도메인 타입.
 * BE: com.mybutler.community.dto (PostRequest/Response.kt),
 *     com.mybutler.community.entity.Post
 */

export type PostType = 'PHOTO' | 'TEXT';

export interface PostAuthor {
  id: number;
  username: string;
}

export interface RecipeTag {
  recipeId: number;
  recipeName: string;
}

export interface PostSummaryResponse {
  id: number;
  type: PostType;
  author: PostAuthor;
  imageUrls: string[];
  caption?: string | null;
  recipeTag?: RecipeTag | null;
  /** AR 세션일 때만 (1~5) */
  rating?: number | null;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isArGenerated: boolean;
  createdAt: string;
}

export interface PostDetailResponse {
  post: PostSummaryResponse & { isMyPost: boolean };
  comments: import('./common').PageResponse<CommentResponse>;
}

export interface LikeResponse {
  postId: number;
  likeCount: number;
  isLiked: boolean;
}

// ─── Comment ───────────────────────────────────────────────────────────────

export interface CommentReply {
  id: number;
  author: PostAuthor;
  content: string;
  isMyComment: boolean;
  createdAt: string;
}

export interface CommentResponse {
  id: number;
  author: PostAuthor;
  content: string;
  replyCount: number;
  isMyComment: boolean;
  createdAt: string;
  replies: CommentReply[];
}

export interface CommentCreateResponse {
  id: number;
  content: string;
  createdAt: string;
}

// ─── Request ───────────────────────────────────────────────────────────────

export interface CreateCommentRequest {
  content: string;
}

/** POST /posts 의 "request" 파트(JSON) — "images" 파트(파일들)와 함께 multipart 전송. */
export interface CreatePostRequest {
  type: PostType;
  /** max 2000자 */
  caption?: string;
  recipeId?: number;
}

export type PostSortKey = 'LATEST' | 'POPULAR';
