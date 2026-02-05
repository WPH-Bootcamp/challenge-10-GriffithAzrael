'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

import type { PaginatedPostsResponse, Post } from '@/types/post';

import { getMostLikedPosts, getPostById, getRecommendedPosts } from './api';

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
  post: (id: number | string) => [...postsKeys.all, 'detail', id] as const, // <-- key untuk detail
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

// QUERY DETAIL POST
export function usePostDetailQuery(id?: number) {
  return useQuery<Post, Error>({
    queryKey: postsKeys.post(id ?? 'pending'),
    queryFn: () => getPostById(id!), // aman karena disabled jika id undefined
    enabled: id != null,
  });
}
