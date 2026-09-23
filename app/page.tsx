import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { ArticleCard } from '@/src/components/ArticleCard';
import { BlogService } from '@/src/services/blogService';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Journal & Stories | Jane Doe',
  description: 'An editorial journal exploring slow travel, mindful living, and visual essays.',
};

export const revalidate = 60; // ISR revalidate every 60 seconds

export default async function HomePage() {
  const { articles } = await BlogService.getArticles();
  const publishedArticles = articles.filter(a => a.status !== 'draft');
  const featuredArticle = publishedArticles[0] || articles[0];
  const remainingArticles = publishedArticles.slice(1);

  // Extract unique categories for quick navigation
  const categories = Array.from(
    new Set(publishedArticles.flatMap(a => a.categories || a.tags || []))
  ).slice(0, 6);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          
          {/* Editorial Intro Banner */}
          <div className="py-12 md:py-20 border-b border-ink/10 mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-semibold tracking-widest text-accent mb-3 block">
                Editorial Journal &amp; Works
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-medium tracking-tight text-ink max-w-3xl leading-[1.08]">
                Observations on stillness, light, &amp; craft.
              </h1>
            </div>
            <p className="text-ink-light text-base max-w-sm leading-relaxed">
              Writing, visual essays, and meditations on living with greater intention amidst the noise.
            </p>
          </div>

          {/* Quick Category Filter Bar */}
          {categories.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-8 text-xs font-semibold uppercase tracking-wider text-ink-light">
              <span className="text-ink">Topics:</span>
              <Link
                href="/blog"
                className="rounded-full bg-ink text-white px-3.5 py-1.5 hover:opacity-90 transition-opacity"
              >
                All Essays
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="rounded-full border border-ink/15 px-3.5 py-1.5 hover:border-ink/40 hover:text-ink transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}

          {/* Featured Hero Article */}
          {featuredArticle && (
            <section className="mb-20">
              <ArticleCard article={featuredArticle} featured index={0} />
            </section>
          )}

          {/* Secondary 2-Column Grid */}
          <div className="border-t border-ink/10 pt-16">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-serif text-3xl font-medium text-ink">Recent Entries</h2>
              <Link 
                href="/blog" 
                className="text-xs font-semibold uppercase tracking-wider text-ink-light hover:text-accent transition-colors"
              >
                View Archive &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {remainingArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index + 1} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
