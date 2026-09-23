'use client';

import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: "Home", href: "/" },
  { label: "All Essays", href: "/blog" },
  { label: "Photography", href: "/photography" },
  { label: "About", href: "/about" },
];

const categoryItems = [
  { label: "Travel", href: "/category/travel" },
  { label: "Photography", href: "/category/photography" },
  { label: "Mindfulness", href: "/category/mindfulness" },
  { label: "Culture", href: "/category/culture" },
  { label: "Design", href: "/category/design" },
];

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-paper/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-12"
        >
          <div className="flex justify-end">
            <button 
              onClick={onClose} 
              className="p-2 text-ink-light hover:text-ink transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-8 w-8" />
            </button>
          </div>
          
          <div className="mx-auto max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-6 block">Navigation</span>
              <nav className="flex flex-col gap-4">
                {navItems.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="font-serif text-3xl sm:text-4xl text-ink hover:text-accent transition-colors block"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-light mb-6 block">Categories</span>
              <nav className="flex flex-col gap-3">
                {categoryItems.map((cat, idx) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.04 }}
                  >
                    <Link
                      href={cat.href}
                      onClick={onClose}
                      className="font-serif text-xl sm:text-2xl text-ink/80 hover:text-accent transition-colors block"
                    >
                      {cat.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-ink/10">
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full bg-accent/10 text-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-accent hover:text-white transition-colors"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Payload CMS Dashboard</span>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mx-auto max-w-4xl w-full border-t border-ink/10 pt-8 flex flex-col sm:flex-row justify-between gap-4 text-xs text-ink-light">
            <p>&copy; {new Date().getFullYear()} Jane Doe. Editorial Archive.</p>
            <div className="flex gap-6">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Twitter</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Instagram</a>
              <a href="mailto:hello@janedoe.com" className="hover:text-accent transition-colors">Contact</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
