import { supabase } from '@/src/lib/supabase';
import { articles as initialArticles, Article } from '@/src/data/articles';

const STORAGE_KEY = 'editorial_blog_articles_cache_v2';

function getLocalArticles(): Article[] {
  if (typeof window === 'undefined') return initialArticles;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialArticles));
      return initialArticles;
    }
    return JSON.parse(raw);
  } catch {
    return initialArticles;
  }
}

function saveLocalArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const BlogService = {
  /**
   * Fetch all articles.
   * Can run in Next.js Server Components or Client Components.
   */
  async getArticles(): Promise<{ articles: Article[]; isFromSupabase: boolean; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped: Article[] = data.map((item) => ({
          id: String(item.id),
          slug: item.slug || `post-${item.id}`,
          title: item.title,
          excerpt: item.excerpt || '',
          coverImage: item.cover_image || 'https://picsum.photos/seed/blog/1600/900',
          date: item.date || new Date(item.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: item.read_time || '5 min read',
          tags: Array.isArray(item.tags) ? item.tags : (item.tags ? String(item.tags).split(',').map(s => s.trim()) : ['General']),
          categories: Array.isArray(item.categories) ? item.categories : (item.categories ? String(item.categories).split(',').map(s => s.trim()) : ['Culture']),
          status: item.status || 'published',
          publishedDate: item.published_date || item.created_at || new Date().toISOString(),
          seoTitle: item.seo_title || item.title,
          seoDescription: item.seo_description || item.excerpt || '',
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          author: {
            name: item.author_name || 'Jane Doe',
            avatar: item.author_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            bio: item.author_bio || 'Writer & curator of quiet moments.',
            twitter: item.author_twitter || '@janedoe',
            instagram: item.author_instagram || '@jane.captures'
          },
          content: item.content || ''
        }));

        saveLocalArticles(mapped);
        return { articles: mapped, isFromSupabase: true };
      }

      // If Supabase table is not populated or empty, return seeded articles
      const local = getLocalArticles();
      return { 
        articles: local, 
        isFromSupabase: false, 
        error: error ? error.message : undefined 
      };
    } catch (err: unknown) {
      const local = getLocalArticles();
      return { 
        articles: local, 
        isFromSupabase: false, 
        error: err instanceof Error ? err.message : 'Connection error' 
      };
    }
  },

  /**
   * Fetch single article by slug
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!error && data) {
        return {
          id: String(data.id),
          slug: data.slug,
          title: data.title,
          excerpt: data.excerpt || '',
          coverImage: data.cover_image || 'https://picsum.photos/seed/blog/1600/900',
          date: data.date || new Date(data.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          readTime: data.read_time || '5 min read',
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? String(data.tags).split(',').map(s => s.trim()) : ['General']),
          categories: Array.isArray(data.categories) ? data.categories : (data.categories ? String(data.categories).split(',').map(s => s.trim()) : ['Culture']),
          status: data.status || 'published',
          publishedDate: data.published_date || data.created_at || new Date().toISOString(),
          seoTitle: data.seo_title || data.title,
          seoDescription: data.seo_description || data.excerpt || '',
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          author: {
            name: data.author_name || 'Jane Doe',
            avatar: data.author_avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
            bio: data.author_bio || 'Writer & curator of quiet moments.',
            twitter: data.author_twitter || '@janedoe',
            instagram: data.author_instagram || '@jane.captures'
          },
          content: data.content || ''
        };
      }
    } catch {
      // fallback
    }

    const localList = getLocalArticles();
    return localList.find((a) => a.slug === slug) || null;
  },

  /**
   * Fetch articles by category
   */
  async getArticlesByCategory(categorySlug: string): Promise<Article[]> {
    const { articles } = await this.getArticles();
    return articles.filter((a) => {
      const cats = a.categories || a.tags || [];
      return cats.some(c => c.toLowerCase().replace(/\s+/g, '-') === categorySlug.toLowerCase());
    });
  },

  /**
   * Upsert article into Supabase + Local Cache
   */
  async saveArticle(article: Partial<Article> & { title: string; slug: string }): Promise<{ success: boolean; error?: string }> {
    const payload = {
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      cover_image: article.coverImage || 'https://picsum.photos/seed/blog/1600/900',
      date: article.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      read_time: article.readTime || '5 min read',
      tags: article.tags || ['General'],
      categories: article.categories || ['Culture'],
      status: article.status || 'published',
      published_date: article.publishedDate || new Date().toISOString(),
      seo_title: article.seoTitle || article.title,
      seo_description: article.seoDescription || article.excerpt || '',
      author_name: article.author?.name || 'Jane Doe',
      author_avatar: article.author?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      author_bio: article.author?.bio || '',
      content: article.content || '',
      updated_at: new Date().toISOString()
    };

    let supabaseError: string | undefined;

    try {
      if (article.id && !article.id.startsWith('local-')) {
        const { error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', article.id);
        if (error) supabaseError = error.message;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([payload]);
        if (error) supabaseError = error.message;
      }
    } catch (e: unknown) {
      supabaseError = e instanceof Error ? e.message : 'Network error';
    }

    // Always update local cache so changes show instantly
    const local = getLocalArticles();
    const existingIdx = local.findIndex(a => a.id === article.id || a.slug === article.slug);
    const updatedArticle: Article = {
      id: article.id || `local-${Date.now()}`,
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt || '',
      coverImage: article.coverImage || 'https://picsum.photos/seed/blog/1600/900',
      date: article.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      readTime: article.readTime || '5 min read',
      tags: article.tags || ['General'],
      categories: article.categories || ['Culture'],
      status: article.status || 'published',
      publishedDate: article.publishedDate || new Date().toISOString(),
      seoTitle: article.seoTitle || article.title,
      seoDescription: article.seoDescription || article.excerpt || '',
      updatedAt: new Date().toISOString(),
      author: article.author || {
        name: 'Jane Doe',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        bio: 'Writer & curator of quiet moments.'
      },
      content: article.content || ''
    };

    if (existingIdx >= 0) {
      local[existingIdx] = updatedArticle;
    } else {
      local.unshift(updatedArticle);
    }
    saveLocalArticles(local);

    return { 
      success: true, 
      error: supabaseError 
    };
  },

  async deleteArticle(id: string, slug: string): Promise<{ success: boolean; error?: string }> {
    let supabaseError: string | undefined;
    try {
      if (!id.startsWith('local-')) {
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (error) supabaseError = error.message;
      }
    } catch (e: unknown) {
      supabaseError = e instanceof Error ? e.message : 'Network error';
    }

    const local = getLocalArticles();
    const filtered = local.filter(a => a.id !== id && a.slug !== slug);
    saveLocalArticles(filtered);

    return { 
      success: true, 
      error: supabaseError 
    };
  },

  getSchemaSQL(): string {
    return `
-- ===================================================
-- PAYLOAD CMS + SUPABASE DATABASE INITIALIZATION
-- Collections: users, media, categories, posts
-- ===================================================

-- 1. Users Collection Table
create table if not exists public.users (
  id uuid default gen_random_uuid() primary key,
  email text unique,
  name text not null,
  role text default 'author' check (role in ('admin', 'editor', 'author')),
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Media Collection Table
create table if not exists public.media (
  id uuid default gen_random_uuid() primary key,
  alt text not null,
  url text not null,
  filename text not null,
  mime_type text,
  filesize bigint default 0,
  width int,
  height int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Categories Collection Table
create table if not exists public.categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Posts Collection Table (Supports both articles view & full Payload fields)
create table if not exists public.articles (
  id bigint generated by default as identity primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  cover_image text,
  featured_image_id uuid references public.media(id) on delete set null,
  author_id uuid references public.users(id) on delete set null,
  author_name text default 'Jane Doe',
  author_avatar text,
  author_bio text,
  author_twitter text,
  author_instagram text,
  categories jsonb default '["Culture"]'::jsonb,
  tags jsonb default '["General"]'::jsonb,
  date text,
  read_time text default '5 min read',
  status text default 'published' check (status in ('draft', 'published')),
  published_date timestamp with time zone default timezone('utc'::text, now()),
  seo_title text,
  seo_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure newly added columns exist if the table was created previously
alter table public.articles add column if not exists status text default 'published';
alter table public.articles add column if not exists published_date timestamp with time zone default timezone('utc'::text, now());
alter table public.articles add column if not exists categories jsonb default '["Culture"]'::jsonb;
alter table public.articles add column if not exists seo_title text;
alter table public.articles add column if not exists seo_description text;
alter table public.articles add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

-- 5. Enable Row Level Security (RLS) on all tables
alter table public.users enable row level security;
alter table public.media enable row level security;
alter table public.categories enable row level security;
alter table public.articles enable row level security;

-- 6. Safe Policies (Public Read & Manage Access)
drop policy if exists "Allow public read users" on public.users;
create policy "Allow public read users" on public.users for select using (true);
drop policy if exists "Allow public manage users" on public.users;
create policy "Allow public manage users" on public.users for all using (true) with check (true);

drop policy if exists "Allow public read media" on public.media;
create policy "Allow public read media" on public.media for select using (true);
drop policy if exists "Allow public manage media" on public.media;
create policy "Allow public manage media" on public.media for all using (true) with check (true);

drop policy if exists "Allow public read categories" on public.categories;
create policy "Allow public read categories" on public.categories for select using (true);
drop policy if exists "Allow public manage categories" on public.categories;
create policy "Allow public manage categories" on public.categories for all using (true) with check (true);

drop policy if exists "Allow public read access" on public.articles;
create policy "Allow public read access" on public.articles for select using (true);
drop policy if exists "Allow all operations for anon/authenticated" on public.articles;
create policy "Allow all operations for anon/authenticated" on public.articles for all using (true) with check (true);
`.trim();
  }
};
