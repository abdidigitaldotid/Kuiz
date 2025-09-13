// app/layout.tsx

import type { Metadata } from 'next';
import Script from 'next/script'; // Import komponen Script dari Next.js
import './globals.css'; // Asumsi Anda punya file CSS global

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
        {children}

        {/* SCRIPT SDK MONETAG
          Script ini akan memuat library iklan Monetag di aplikasi Anda.
          'strategy="afterInteractive"' memastikan script ini tidak memperlambat
          loading awal halaman Anda.
        */}
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
