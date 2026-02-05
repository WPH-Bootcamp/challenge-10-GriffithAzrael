import type { PaginatedPostsResponse, Post } from '@/types/post';

export type ListParams = {
  limit?: number;
  page?: number;
};

export type SearchParams = ListParams & {
  query: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`;
      try {
        const body = await res.json();
        if (typeof (body as any)?.message === 'string') {
          message = (body as any).message;
        }
      } catch {
        // abaikan jika bukan JSON
      }
      throw new Error(message);
    }

    return (await res.json()) as T;
  } catch (error) {
    console.error('Client API request error:', url, error);
    throw error;
  }
}

export function getRecommendedPosts(params: ListParams = {}) {
  const limit = params.limit ?? 5;
  const page = params.page ?? 1;

  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(limit));
  searchParams.set('page', String(page));

  return fetchJson<PaginatedPostsResponse>(
    `/api/posts/recommended?${searchParams.toString()}`
  );
}

export function getMostLikedPosts(params: ListParams = {}) {
  const limit = params.limit ?? 3;
  const page = params.page ?? 1;

  const searchParams = new URLSearchParams();
  searchParams.set('limit', String(limit));
  searchParams.set('page', String(page));

  return fetchJson<PaginatedPostsResponse>(
    `/api/posts/most-liked?${searchParams.toString()}`
  );
}

// === PENAMBAHAN FUNGSI SEARCH ===
export function getSearchPosts(params: SearchParams) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!base) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not set. Please configure it in .env/.env.local'
    );
  }

  const backendBase = base.replace(/\/+$/, '');
  const limit = params.limit ?? 5;
  const page = params.page ?? 1;

  // Construct URL params sesuai endpoint search
  const searchParams = new URLSearchParams();
  searchParams.set('query', params.query);
  searchParams.set('limit', String(limit));
  searchParams.set('page', String(page));

  const url = `${backendBase}/posts/search?${searchParams.toString()}`;

  return fetchJson<PaginatedPostsResponse>(url);
}

export function getPostById(id: number | string) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!base) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not set. Please configure it in .env/.env.local'
    );
  }

  const backendBase = base.replace(/\/+$/, '');
  const url = `${backendBase}/posts/${id}`;

  return fetchJson<Post>(url);
}
