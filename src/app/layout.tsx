// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Europmat - Équipement Professionnel pour Cuisines & Restaurants",
    template: '%s | Europmat - Équipement Professionnel'
  },
  description: 'Europmat - Fournisseur leader d\'équipements professionnels pour restaurants, boulangeries, snacks et cuisines professionnelles au Maroc. Réfrigération, cuisson, préparation.',
keywords: [
  // French keywords
  'équipement professionnel Maroc',
  'matériel restaurant Nador',
  'équipement cuisine professionnelle Maroc',
  'froid commercial Maroc',
  'four pizza professionnel Maroc',
  'vitrine réfrigérée Nador',
  'matériel boulangerie Maroc',
  'équipement snack Maroc',
  'Europmat Nador',
  'matériel CHR Maroc',
  'équipement restauration Maroc',
  'fournisseur équipement cuisine',
  'matériel pâtisserie professionnel',
  // Arabic keywords
  'معدات المطاعم المغرب',
  'تجهيزات المطابخ المهنية',
  'معدات المخابز المغرب',
  'ثلاجات عرض تبريد',
  'أفران بيتزا احترافية',
  'معدات الوجبات السريعة',
  'تجهيزات محلات الحلويات',
  'أثاث المطاعم المغرب',
  'معدات مطاعم الناظور',
  'يوروبمات',
  'تجهيزات كوفي شوب',
  'معدات المطاعم والكافيهات',
],
  authors: [{ name: 'Europmat' }],
  creator: 'Europmat',
  publisher: 'Europmat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://europmat.com'),
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/',
      'ar': '/ar',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://europmat.com',
    siteName: 'Europmat',
    title: 'Europmat - Équipement Professionnel pour Cuisines & Restaurants',
    description: 'Fournisseur d\'équipements professionnels pour restaurants, boulangeries et snacks au Maroc. Large gamme de produits de qualité.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Europmat - Équipement Professionnel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Europmat - Équipement Professionnel',
    description: 'Équipements professionnels pour cuisines et restaurants au Maroc',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: ['/favicon.ico'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <GoogleAnalytics gaId="G-H7VP1SEDC6" />
      </body>
    </html>
  );
}