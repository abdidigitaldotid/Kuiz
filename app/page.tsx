import Head from 'next/head';
import type { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Kuis Interaktif</title>
        {/* PASTE META TAG DARI MONETAG DI SINI */}
        <script src='//libtl.com/sdk.js' data-zone='9867079' data-sdk='show_9867079'></script>
      </Head>

      {/* Sisa konten halaman Anda */}
      <h1>Selamat Datang di Kuis!</h1>
    </div>
  );
};

export default HomePage;
