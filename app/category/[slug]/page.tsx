import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { ArticleCard } from '@/src/components/ArticleCard';
import { BlogService } from '@/src/services/blogService';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { articles } = await BlogService.getArticles();
  const allCategories = Array.from(
    new Set(articles.flatMap(a => a.categories || a.tags || []))
  );
  return allCategories.map(c => ({
    slug: c.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const capitalized = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return {
    title: `${capitalized} Essays`,
    description: `Browse all articles, photography dispatches, and thoughts categorized under ${capitalized}.`,
    alternates: {
      canonical: `${process.env.APP_URL || 'https://blog3-mauve.vercel.app'}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const articles = await BlogService.getArticlesByCategory(slug);
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="border-b border-ink/10 pb-8 mb-12">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-light mb-2">
              <Link href="/blog" className="hover:text-ink transition-colors">Essays</Link>
              <span>/</span>
              <span className="text-accent">{categoryName}</span>
            </div>
            <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-ink">
              {categoryName} ({articles.length})
            </h1>
            <p className="mt-4 text-ink-light text-base max-w-xl">
              Curated thoughts and visual essays focusing on {categoryName.toLowerCase()}.
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-ink">No essays found in this category yet.</p>
              <p className="mt-2 text-sm text-ink-light">Check back soon or explore other categories.</p>
              <Link 
                href="/blog" 
                className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white"
              >
                View all essays
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
