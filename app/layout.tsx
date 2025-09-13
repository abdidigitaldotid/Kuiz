// app/layout.tsx

import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Providers } from './providers'; // 1. Impor komponen Providers yang baru

export const metadata: Metadata = {
  title: 'Aplikasi Kuis Interaktif',
  description: 'Mainkan kuis seru dan dapatkan hadiah!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        {/* 2. Gunakan Providers untuk membungkus children */}
        <Providers>
          {children}
        </Providers>

        {/* SCRIPT SDK MONETAG ANDA TETAP AMAN DI SINI */}
        <Script
          src="//libtl.com/sdk.js"
          data-zone="9867079"
          data-sdk="show_9867079"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

