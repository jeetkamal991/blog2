import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper py-12 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <span className="font-serif text-xl font-semibold tracking-wide">JANE DOE</span>
            <p className="text-sm text-ink-light max-w-xs">
              Documenting the quiet moments between the noise. A journal of travel, photography, and finding meaning in the everyday.
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-light">Explore</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/blog" className="text-sm hover:text-accent transition-colors">All Essays</Link>
              <Link href="/category/travel" className="text-sm hover:text-accent transition-colors">Travel</Link>
              <Link href="/category/photography" className="text-sm hover:text-accent transition-colors">Photography</Link>
              <Link href="/photography" className="text-sm hover:text-accent transition-colors">Photo Works</Link>
              <Link href="/about" className="text-sm hover:text-accent transition-colors">About</Link>
              <Link href="/admin" className="text-sm text-accent hover:underline font-medium">CMS Admin</Link>
            </nav>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-light">Connect</h4>
            <nav className="flex flex-col gap-2">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-sm hover:text-accent transition-colors">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-sm hover:text-accent transition-colors">Instagram</a>
              <a href="https://substack.com" target="_blank" rel="noreferrer" className="text-sm hover:text-accent transition-colors">Substack</a>
              <a href="mailto:hello@janedoe.com" className="text-sm hover:text-accent transition-colors">Email</a>
            </nav>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink/5 pt-8 sm:flex-row text-center sm:text-left">
          <p className="text-xs text-ink-light">
            &copy; {new Date().getFullYear()} Jane Doe. Powered by Next.js &amp; Supabase Payload CMS.
          </p>
          <p className="text-xs text-ink-light max-w-md sm:text-right">
            Photos from <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline hover:text-accent transition-colors">Unsplash</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
