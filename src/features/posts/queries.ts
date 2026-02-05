'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { PaginatedPostsResponse, Post, Comment } from '@/types/post';

import {
  getMostLikedPosts,
  getPostById,
  getRecommendedPosts,
  getPostComments,
  getSearchPosts,
  SearchParams,
} from './api';

export type ListParams = {
  limit?: number;
  page?: number;
};

export const postsKeys = {
  all: ['posts'] as const,
  recommended: (params: ListParams) =>
    [...postsKeys.all, 'recommended', params] as const,
  mostLiked: (params: ListParams) =>
    [...postsKeys.all, 'most-liked', params] as const,
  post: (id: number | string) => [...postsKeys.all, 'detail', id] as const,
  // Key baru untuk search
  search: (params: SearchParams) =>
    [...postsKeys.all, 'search', params] as const,
  // Key baru untuk comments
  comments: (id: number | string) =>
    [...postsKeys.all, 'comments', id] as const,
};

export function useRecommendedPostsQuery(params: ListParams) {
  return useQuery<PaginatedPostsResponse, Error>({
    queryKey: postsKeys.recommended(params),
    queryFn: () => getRecommendedPosts(params),
    placeholderData: keepPreviousData,
  });
}

export function useMostLikedPostsQuery(params: ListParams) {
  return useQuery<PaginatedPostsResponse, Error>({
    queryKey: postsKeys.mostLiked(params),
    queryFn: () => getMostLikedPosts(params),
    placeholderData: keepPreviousData,
  });
}

export function useSearchPostsQuery(
  params: SearchParams,
  enabled: boolean = true
) {
  return useQuery<PaginatedPostsResponse, Error>({
    queryKey: postsKeys.search(params),
    queryFn: () => getSearchPosts(params),
    placeholderData: keepPreviousData,
    enabled: enabled, // Agar query tidak jalan otomatis kalau query string kosong
  });
}

export function usePostDetailQuery(id?: number) {
  return useQuery<Post, Error>({
    queryKey: postsKeys.post(id ?? 'pending'),
    queryFn: () => getPostById(id!),
    enabled: id != null,
  });
}

// Hook Baru: Get Comments
export function usePostCommentsQuery(id?: number) {
  return useQuery<Comment[], Error>({
    queryKey: postsKeys.comments(id ?? 'pending'),
    queryFn: () => getPostComments(id!),
    enabled: id != null,
  });
}
