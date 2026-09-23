import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { BlogService } from "../services/blogService";
import { Article } from "../data/articles";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { AuthorInfo } from "../components/AuthorInfo";
import { QuoteEmbed } from "../components/QuoteEmbed";
import { ImageEmbed } from "../components/ImageEmbed";
import { Gallery } from "../components/Gallery";
import { FadeImage } from "../components/FadeImage";
import { Edit3 } from "lucide-react";

export function Post() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    async function loadPost() {
      if (!slug) return;
      setLoading(true);
      const data = await BlogService.getArticleBySlug(slug);
      setArticle(data);
      setLoading(false);
    }
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center font-serif text-ink-light">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Header />
      
      <main className="flex-1">
        {/* Immersive Hero */}
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-ink">
          <motion.div 
            style={{ y, opacity }}
            className="absolute inset-0"
          >
            <FadeImage 
              src={article.coverImage} 
              alt={article.title} 
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover opacity-60"
            />
          </motion.div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 md:p-24">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-4xl"
            >
              <div className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-paper/80">
                <span>{article.date}</span>
                <span className="h-1 w-1 rounded-full bg-paper/40"></span>
                <span>{article.tags[0]}</span>
                <span className="h-1 w-1 rounded-full bg-paper/40"></span>
                <span>{article.readTime}</span>
              </div>
              
              <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-paper sm:text-5xl md:text-6xl lg:text-7xl">
                {article.title}
              </h1>
            </motion.div>
          </div>
        </div>
        
        {/* Content */}
        <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-ink-light prose-a:text-accent prose-a:no-underline hover:prose-a:underline"
          >
            <p className="lead text-2xl font-serif italic text-ink mb-12">
              {article.excerpt}
            </p>
            
            {article.content ? (
              <div className="whitespace-pre-line text-ink-light leading-relaxed font-sans text-lg space-y-6">
                {article.content}
              </div>
            ) : (
              <>
                <p>
                  The modern world demands our constant attention. We are bombarded with notifications, emails, and the endless scroll of social media. In this cacophony, silence has become a luxury, a rare commodity that we must actively seek out and cultivate.
                </p>
                
                <p>
                  But what does it mean to truly embrace silence? It is not merely the absence of noise, but a state of being—a profound stillness that allows us to connect with our inner selves and the world around us in a more meaningful way.
                </p>

                <QuoteEmbed 
                  quote="In the attitude of silence the soul finds the path in a clearer light, and what is elusive and deceptive resolves itself into crystal clearness."
                  author="Mahatma Gandhi"
                />

                <h2 className="text-3xl mt-16 mb-8 text-ink">The Architecture of Quiet Spaces</h2>
                
                <p>
                  Throughout history, humans have designed spaces specifically to foster contemplation and peace. From the soaring arches of Gothic cathedries to the minimalist serenity of Japanese Zen gardens, these environments share a common purpose: to quiet the mind and elevate the spirit.
                </p>

                <ImageEmbed 
                  src="https://picsum.photos/seed/architecture/1200/800"
                  alt="Minimalist architecture"
                  caption="The interplay of light and shadow creates a natural rhythm that encourages reflection."
                  size="wide"
                />

                <p>
                  When we enter these spaces, we instinctively lower our voices. Our breathing slows. We become acutely aware of the subtle details—the texture of stone, the play of light on water, the gentle rustle of leaves. This heightened awareness is the gift of silence.
                </p>

                <h2 className="text-3xl mt-16 mb-8 text-ink">Cultivating Your Own Sanctuary</h2>

                <p>
                  You don't need to travel to a remote monastery to experience the benefits of silence. You can create your own sanctuary, right where you are. It begins with a simple intention: to carve out a few moments of quiet each day.
                </p>

                <Gallery 
                  images={[
                    { src: "https://picsum.photos/seed/gallery1/800/1000", alt: "Morning light" },
                    { src: "https://picsum.photos/seed/gallery2/800/800", alt: "Coffee cup" },
                    { src: "https://picsum.photos/seed/gallery3/800/800", alt: "Open book" }
                  ]}
                />

                <p>
                  Start small. Turn off your phone for an hour. Sit by a window and watch the clouds drift by. Take a walk without headphones. Notice the sounds that emerge when the artificial noise fades away—the hum of the refrigerator, the distant chirp of a bird, the rhythm of your own breath.
                </p>

                <p>
                  As you practice this intentional silence, you may find that it becomes less daunting and more inviting. It becomes a refuge, a place where you can return to yourself, again and again.
                </p>
              </>
            )}
          </motion.div>
          
          <AuthorInfo author={article.author} />
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
