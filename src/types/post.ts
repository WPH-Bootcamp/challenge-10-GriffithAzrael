export type User = {
  id: number;
  name: string;
  username?: string;
  headline?: string;
  avatarUrl?: string;
};

export interface Author {
  id: number;
  name: string;
  username: string;
  headline: string;
  avatarUrl: string | null;
  email?: string;
}

export type Post = {
  id: number;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string; // atau imageUrl
  imageUrl?: string;
  tags: string[];
  author: User; // Author artikel juga strukturnya User
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
};

export type PaginatedPostsResponse = {
  data: Post[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  // Handle jika backend pakai format 'lastPage' langsung di root atau di meta
  lastPage?: number;
};

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: User;
}

export type CommentsResponse = Comment[];
