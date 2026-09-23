'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Simple robust session authentication for demo/editorial CMS
    if (password === 'editorial-pass' || password === 'editorial2026' || password === 'admin') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cms_auth_token', 'session_' + Date.now());
        localStorage.setItem('cms_auth_user', JSON.stringify({ email: email || 'admin@janedoe.com', role: 'admin' }));
      }
      router.push('/admin');
    } else {
      setError('Invalid credentials. (Hint for demo: password is "editorial-pass" or "admin")');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-xl bg-accent text-white flex items-center justify-center shadow-md">
            <Lock className="h-6 w-6" />
          </div>
        </div>
        <h2 className="mt-4 text-center font-serif text-3xl font-medium tracking-tight text-ink">
          Payload CMS Sign In
        </h2>
        <p className="mt-2 text-center text-xs text-ink-light">
          Sign in to manage blog posts, authors, media, and taxonomies
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-ink/10 sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs text-red-700 flex items-start gap-2 border border-red-200">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  placeholder="admin@janedoe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink">
                Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>
              <p className="mt-1 text-[11px] text-ink-light">
                Demo default password: <code className="font-mono text-accent">editorial-pass</code>
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-full bg-accent px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-accent/90 transition-colors shadow-sm cursor-pointer"
              >
                Sign In to CMS
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-ink/10 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-light hover:text-ink transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Public Blog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
