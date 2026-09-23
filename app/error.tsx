'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="font-serif text-3xl font-medium text-ink mb-4">Something went wrong</h2>
      <p className="text-sm text-ink-light max-w-md mb-8">
        We encountered an unexpected error while loading this page. You can try refreshing or returning home.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent/90 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-ink/20 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink hover:bg-ink/5 transition-colors"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
