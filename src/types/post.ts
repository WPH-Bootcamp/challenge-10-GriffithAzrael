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
  content: string; // HTML dari backend
  tags: string[];
  imageUrl: string | null;
  author: Author;
  createdAt: string;
  likes: number;
  comments: number;
};

export type PaginatedPostsResponse = {
  data: Post[];
  total: number;
  page: number;
  lastPage: number;
};

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: Author;
}

export type CommentsResponse = Comment[];
