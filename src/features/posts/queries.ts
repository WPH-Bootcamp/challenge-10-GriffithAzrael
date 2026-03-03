'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';

// Tambahkan type User untuk response Likes
import type { PaginatedPostsResponse, Post, Comment, User } from '@/types/post';

import {
  getMostLikedPosts,
  getPostById,
  getRecommendedPosts,
  getPostComments,
  getPostLikes, // IMPORT BARU
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
  search: (params: SearchParams) =>
    [...postsKeys.all, 'search', params] as const,
  comments: (id: number | string) =>
    [...postsKeys.all, 'comments', id] as const,
  // KEY BARU UNTUK LIKES
  likes: (id: number | string) => [...postsKeys.all, 'likes', id] as const,
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
    enabled: enabled,
  });
}

// Update tipe ID agar support string juga (dari URL)
export function usePostDetailQuery(id?: number | string) {
  return useQuery<Post, Error>({
    queryKey: postsKeys.post(id ?? 'pending'),
    queryFn: () => getPostById(id!),
    enabled: id != null,
  });
}

// Update tipe ID
export function usePostCommentsQuery(id?: number | string) {
  return useQuery<Comment[], Error>({
    queryKey: postsKeys.comments(id ?? 'pending'),
    queryFn: () => getPostComments(id!),
    enabled: id != null,
  });
}

// HOOK BARU UNTUK LIKES
export function usePostLikesQuery(id?: number | string) {
  return useQuery<User[], Error>({
    queryKey: postsKeys.likes(id ?? 'pending'),
    queryFn: () => getPostLikes(id!),
    enabled: id != null,
  });
}
