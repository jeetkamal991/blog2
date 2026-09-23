import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://blog3-mauve.vercel.app'),
  title: {
    default: 'Remix Personal Blog Template',
    template: '%s | Remix Personal Blog',
  },
  description: 'A modern editorial blog with Supabase cloud backend, live CMS article manager, and immersive storytelling views.',
  openGraph: {
    title: 'Remix Personal Blog Template',
    description: 'A modern editorial blog with Supabase cloud backend, live CMS article manager, and immersive storytelling views.',
    type: 'website',
    siteName: 'Jane Doe Journal',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remix Personal Blog Template',
    description: 'A modern editorial blog with Supabase cloud backend, live CMS article manager, and immersive storytelling views.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F9F8F6] text-[#1A1A1A] antialiased selection:bg-[#D96C4A]/20 selection:text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
