import { Inter } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.css";
import "@/styles/app.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Rushd — Islamic Companion",
  description:
    "Comprehensive Islamic companion app with Quran, Hadith, prayer times, and more.",
  robots: { index: false, follow: false },
  icons: {
    icon: ["/favicon.ico"],
    apple: ["/favicon.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning>
        <Script id="rushd-theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var theme = localStorage.getItem('rushdTheme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch (e) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }
            })();
          `}
        </Script>
        <div className="app-root">
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
