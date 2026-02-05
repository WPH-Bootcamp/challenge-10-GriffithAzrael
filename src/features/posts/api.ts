import axios from 'axios'; // Import axios langsung untuk local route

import { fetchAPI } from '@/lib/api'; // Gunakan helper yang sudah Anda buat
import type { PaginatedPostsResponse, Post, Comment } from '@/types/post';

export type ListParams = {
  limit?: number;
  page?: number;
};

export type SearchParams = ListParams & {
  query: string;
};

// --- FUNGSI LOCAL API (Next.js Route Handlers) ---
// Kita menggunakan axios langsung di sini (bukan 'api' instance)
// karena route ini bersifat internal (/api/...) dan relatif terhadap domain website,
// sedangkan 'fetchAPI' menggunakan baseURL yang mengarah ke Backend Eksternal.

export function getRecommendedPosts(params: ListParams = {}) {
  const limit = params.limit ?? 5;
  const page = params.page ?? 1;

  // Axios otomatis mengubah object params menjadi query string
  return axios
    .get<PaginatedPostsResponse>('/api/posts/recommended', {
      params: { limit, page },
    })
    .then((res) => res.data);
}

export function getMostLikedPosts(params: ListParams = {}) {
  const limit = params.limit ?? 3;
  const page = params.page ?? 1;

  return axios
    .get<PaginatedPostsResponse>('/api/posts/most-liked', {
      params: { limit, page },
    })
    .then((res) => res.data);
}

// --- FUNGSI BACKEND API (External) ---
// Menggunakan 'fetchAPI' dari lib/api.ts yang sudah terkonfigurasi
// dengan Base URL Backend dan Error Handling.

export function getSearchPosts(params: SearchParams) {
  const limit = params.limit ?? 5;
  const page = params.page ?? 1;

  return fetchAPI<PaginatedPostsResponse>('/posts/search', {
    params: {
      query: params.query,
      limit,
      page,
    },
  });
}

export function getPostById(id: number | string) {
  return fetchAPI<Post>(`/posts/${id}`);
}

export function getPostComments(id: number | string) {
  return fetchAPI<Comment[]>(`/posts/${id}/comments`);
}
