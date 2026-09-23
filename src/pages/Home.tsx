import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { BlogService } from "../services/blogService";
import { Article } from "../data/articles";
import { ArticleCard } from "../components/ArticleCard";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router-dom";
import { Database, Plus } from "lucide-react";

export function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const res = await BlogService.getArticles();
      setArticles(res.articles);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const featuredArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 max-w-3xl"
          >
            <h1 className="font-serif text-5xl font-medium leading-tight tracking-tight text-ink sm:text-6xl md:text-7xl">
              Notes on a <span className="italic text-accent">quieter</span> life.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-light sm:text-xl">
              Essays, photography, and reflections on finding meaning in the spaces between the noise.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="h-96 w-full animate-pulse rounded-2xl bg-ink/5" />
          ) : featuredArticle ? (
            <ArticleCard article={featuredArticle} featured index={0} />
          ) : null}
        </section>
        
        {/* Latest Articles */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-12 flex items-center justify-between border-b border-ink/10 pb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink">
              Latest Entries
            </h2>
            <Link 
              to="/admin" 
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent hover:text-ink transition-colors"
            >
              <Database className="h-3.5 w-3.5" />
              <span>CMS Manager</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-2">
            {remainingArticles.map((article, idx) => (
              <ArticleCard key={article.id} article={article} index={idx + 1} />
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

