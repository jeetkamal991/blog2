'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, ShieldCheck } from 'lucide-react';
import { MenuOverlay } from './MenuOverlay';
import { SearchOverlay } from './SearchOverlay';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-ink/5 bg-paper/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Menu trigger */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-light hover:text-ink transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline-block">Menu</span>
            </button>
          </div>

          {/* Center: Logo / Blog Title */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl hover:opacity-80 transition-opacity">
                JANE DOE
              </span>
            </Link>
          </div>

          {/* Right: Search + Admin */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-light hover:text-ink transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline-block">Search</span>
            </button>
            <Link
              href="/admin"
              className="flex items-center gap-1 rounded-full border border-ink/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-light hover:text-ink hover:border-ink/30 transition-colors"
              title="Payload CMS Manager"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span className="hidden md:inline-block">CMS</span>
            </Link>
          </div>
        </div>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
