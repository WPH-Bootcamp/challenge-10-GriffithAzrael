export type Author = {
  id: number;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
};

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
