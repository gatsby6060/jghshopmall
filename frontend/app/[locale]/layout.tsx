import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'ShopMall - 최고의 쇼핑 경험',
    template: '%s | ShopMall',
  },
  description: '다양한 카테고리의 상품을 합리적인 가격에 만나보세요.',
  keywords: ['쇼핑몰', '온라인쇼핑', '패션', '전자제품', '생활용품'],
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the locale is supported
  if (!routing.locales.includes(locale as 'ko' | 'en' | 'ja' | 'fr')) {
    notFound();
  }

  // Get the messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* 포트원 결제 SDK 추가 */}
        <script src="https://cdn.iamport.kr/v1/iamport.js" async />
      </head>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <Providers>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
