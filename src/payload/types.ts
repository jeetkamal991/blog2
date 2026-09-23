export interface PayloadUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'editor' | 'author';
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadMedia {
  id: string;
  alt: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayloadCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type PostStatus = 'draft' | 'published';

export interface PayloadPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: PayloadMedia | string;
  content: string;
  author: PayloadUser | string;
  categories: (PayloadCategory | string)[];
  publishedDate?: string;
  status: PostStatus;
  meta: {
    seoTitle?: string;
    seoDescription?: string;
  };
  readTime?: string;
  createdAt: string;
  updatedAt: string;
}
