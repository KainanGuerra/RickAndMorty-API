import type { Metadata } from 'next';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { THEME_INIT_SCRIPT } from '@/theme/theme-init-script';
import { LocaleProvider } from '@/i18n/LocaleProvider';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import '../theme/theme.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rick and Morty API — Episode Characters',
  description: 'Look up every character that appears in a Rick and Morty episode.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line react/no-danger */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <LocaleProvider>
            <div className="app-shell">
              <Header />
              <main className="app-main">{children}</main>
              <Footer />
            </div>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
