import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { ArticleCard } from '@/src/components/ArticleCard';
import { BlogService } from '@/src/services/blogService';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Essays & Stories',
  description: 'Explore the complete archive of essays, photography collections, and travel dispatches.',
};

export const revalidate = 60;

export default async function BlogIndexPage() {
  const { articles } = await BlogService.getArticles();
  const publishedArticles = articles.filter(a => a.status !== 'draft');

  const categories = Array.from(
    new Set(publishedArticles.flatMap(a => a.categories || a.tags || []))
  );

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="border-b border-ink/10 pb-10 mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-2 block">
              The Complete Archive
            </span>
            <h1 className="font-serif text-5xl md:text-6xl font-medium tracking-tight text-ink">
              All Essays ({publishedArticles.length})
            </h1>
            <p className="mt-4 text-ink-light text-base max-w-2xl">
              Reflections on art, travel, architecture, film photography, and intentional daily living.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
              <span className="text-ink mr-2">Filter By:</span>
              {categories.map((c) => (
                <Link
                  key={c}
                  href={`/category/${c.toLowerCase().replace(/\s+/g, '-')}`}
                  className="rounded-full border border-ink/15 px-3 py-1 text-ink-light hover:text-ink hover:border-ink/40 transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {publishedArticles.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
