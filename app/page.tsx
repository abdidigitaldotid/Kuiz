// app/page.tsx

"use client"; // Wajib ditambahkan untuk menggunakan hooks seperti useState dan useEffect

import { useState, useEffect } from 'react';

export default function HomePage() {
  // State untuk melacak apakah iklan sedang dimuat, agar tombol tidak diklik berkali-kali
  const [isAdLoading, setIsAdLoading] = useState(false);

  // --- IKLAN 1: In-App Interstitial (Berjalan Otomatis) ---
  useEffect(() => {
    // Fungsi ini akan berjalan sekali saat halaman selesai dimuat
    // Kita beri sedikit jeda agar SDK sempat termuat sepenuhnya
    const timer = setTimeout(() => {
      if (window.show_9867079) {
        console.log("Memicu Iklan In-App Interstitial Otomatis...");
        window.show_9867079({
          type: 'inApp',
          inAppSettings: {
            frequency: 2,
            capping: 0.1,
            interval: 30,
            timeout: 5,
            everyPage: false,
          },
        });
      }
    }, 2000); // Jeda 2 detik sebelum iklan otomatis muncul

    return () => clearTimeout(timer); // Membersihkan timer jika komponen di-unmount
  }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali

  // --- IKLAN 2: Rewarded Interstitial (Dipicu oleh Klik Tombol) ---
  const handleShowRewardedAd = () => {
    if (isAdLoading) {
      console.log("Iklan lain sedang diproses, mohon tunggu.");
      return;
    }

    if (window.show_9867079) {
      console.log("Meminta Iklan Rewarded...");
      setIsAdLoading(true);

      window.show_9867079()
        .then(() => {
          // Aksi yang dijalankan SETELAH pengguna menonton iklan
          alert("Terima kasih sudah menonton! Anda mendapatkan 50 poin bonus!");
          // Di sini Anda bisa menambahkan logika untuk memberi hadiah ke user
        })
        .catch((error) => {
          console.error("Terjadi error saat menampilkan iklan:", error);
          alert("Oops, iklan gagal dimuat. Coba lagi nanti.");
        })
        .finally(() => {
          // Pastikan state loading selalu kembali ke false setelah selesai
          setIsAdLoading(false);
        });
    } else {
      alert("Fitur iklan belum siap, coba sesaat lagi.");
      console.error("SDK Monetag belum termuat di window.");
    }
  };

  return (
    <main style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'sans-serif',
      textAlign: 'center'
    }}>
      <h1>Selamat Datang di Kuis!</h1>
      <p style={{ maxWidth: '400px', margin: '1rem 0' }}>
        Jawab pertanyaan untuk menguji pengetahuanmu. Jika butuh bantuan,
        kamu bisa menonton iklan untuk mendapatkan petunjuk gratis.
      </p>

      <button
        onClick={handleShowRewardedAd}
        disabled={isAdLoading}
        style={{
          padding: '12px 24px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: isAdLoading ? 'not-allowed' : 'pointer',
          backgroundColor: isAdLoading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          transition: 'background-color 0.3s'
        }}
      >
        {isAdLoading ? 'Memuat Iklan...' : 'Tonton Iklan & Dapat Hadiah'}
      </button>
    </main>
  );
}
