import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-accent mb-2">404</span>
      <h1 className="font-serif text-5xl font-medium text-ink mb-4">Page Not Found</h1>
      <p className="text-base text-ink-light max-w-md mb-8">
        The story or article you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="rounded-full bg-accent px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent/90 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  );
}
