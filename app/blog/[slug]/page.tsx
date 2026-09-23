import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { AuthorInfo } from '@/src/components/AuthorInfo';
import { ImageEmbed } from '@/src/components/ImageEmbed';
import { QuoteEmbed } from '@/src/components/QuoteEmbed';
import { Gallery } from '@/src/components/Gallery';
import { BlogService } from '@/src/services/blogService';
import Link from 'next/link';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { articles } = await BlogService.getArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await BlogService.getArticleBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const url = `${process.env.APP_URL || 'https://blog3-mauve.vercel.app'}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.publishedDate || post.createdAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1600,
          height: 900,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const article = await BlogService.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const primaryCategory = article.categories?.[0] || article.tags?.[0] || 'Culture';

  // Schema.org BlogPosting structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: [article.coverImage],
    datePublished: article.publishedDate || article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      '@type': 'Person',
      name: article.author.name,
      image: article.author.avatar,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jane Doe Journal',
      logo: {
        '@type': 'ImageObject',
        url: 'https://picsum.photos/seed/editorial/200/200',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.APP_URL || 'https://blog3-mauve.vercel.app'}/blog/${article.slug}`,
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      
      <main className="flex-1">
        <article className="pt-8 sm:pt-16">
          {/* Article Header */}
          <header className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-ink-light">
              <Link 
                href={`/category/${primaryCategory.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-accent hover:underline"
              >
                {primaryCategory}
              </Link>
              <span className="h-1 w-1 rounded-full bg-ink/20" />
              <time>{article.date}</time>
              <span className="h-1 w-1 rounded-full bg-ink/20" />
              <span>{article.readTime}</span>
            </div>
            
            <h1 className="font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12]">
              {article.title}
            </h1>
            
            <p className="mt-6 text-xl text-ink-light leading-relaxed font-serif italic max-w-2xl mx-auto">
              {article.excerpt}
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-3 border-t border-b border-ink/10 py-4 max-w-xs mx-auto">
              <img 
                src={article.author.avatar} 
                alt={article.author.name}
                referrerPolicy="no-referrer"
                className="h-10 w-10 rounded-full object-cover grayscale"
              />
              <div className="text-left">
                <span className="block text-xs font-semibold uppercase tracking-wider text-ink">
                  {article.author.name}
                </span>
                <span className="block text-xs text-ink-light">Author &amp; Photographer</span>
              </div>
            </div>
          </header>

          {/* Full Bleed / Wide Cover Image */}
          <div className="mt-12 sm:mt-16 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-sm bg-ink/5">
              <img 
                src={article.coverImage} 
                alt={article.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Article Body Content */}
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
            <div className="prose prose-stone prose-lg max-w-none prose-p:text-ink/80 prose-p:leading-relaxed prose-headings:font-serif prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-ink prose-a:text-accent prose-a:underline hover:prose-a:text-ink">
              {article.content ? (
                article.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-lg leading-relaxed text-ink/80">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="lead text-2xl font-serif italic text-ink mb-12 leading-relaxed">
                    There is an art to moving through the world without an agenda. In our relentless pursuit of productivity and optimization, we have turned even our leisure into a series of boxes to be checked.
                  </p>
                  
                  <p>
                    We arrive in a new city with a map full of pins and an itinerary timed to the quarter-hour. We move from monument to museum, seeing everything and absorbing nothing. We photograph landmarks to prove we were there, but rarely pause long enough to let the place leave an impression on us.
                  </p>
                  
                  <p>
                    Slow travel is not about doing less for the sake of it; it is about creating space for the unexpected. It is the decision to spend an afternoon sitting on a park bench watching light filter through plane trees, rather than queuing for three hours to see a painting everyone else is photographing.
                  </p>
                </>
              )}
            </div>

            {/* Editorial Quote Embed Example */}
            <QuoteEmbed 
              quote="The real voyage of discovery consists not in seeking new landscapes, but in having new eyes."
              author="Marcel Proust"
              source="In Search of Lost Time"
            />

            <div className="prose prose-stone prose-lg max-w-none prose-p:text-ink/80 prose-p:leading-relaxed">
              <p>
                When you slow down, the textures of a place reveal themselves. You begin to notice the cadence of daily speech, the way morning bread smells when the wind shifts, the quality of sunlight at dusk against weathered limestone. These are the details that anchor a memory long after tourist itineraries fade.
              </p>
            </div>

            {/* Editorial Image Embed Example */}
            <ImageEmbed 
              src="https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1600&h=900&fit=crop"
              alt="Shadows cast on stone steps during late afternoon"
              caption="Late afternoon light carving long shadows across stone alleyways."
              size="default"
            />

            {/* Editorial Gallery Example */}
            <Gallery 
              images={[
                { src: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200&h=800&fit=crop", alt: "City street at dusk", caption: "Dusk settled over the canal" },
                { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&h=800&fit=crop", alt: "Portrait in natural light" },
                { src: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&h=800&fit=crop", alt: "Morning coffee cup" },
              ]}
            />

            {/* Tags & Categories Footer */}
            <div className="mt-16 pt-8 border-t border-ink/10 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-ink-light mr-2">Tags:</span>
              {article.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink-light"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Biography Section */}
            <AuthorInfo author={article.author} />

            {/* Back to Blog Navigation */}
            <div className="mt-12 text-center">
              <Link 
                href="/blog" 
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors"
              >
                &larr; Back to all essays
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
