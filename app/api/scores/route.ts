// app/api/scores/route.ts

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export interface LeaderboardEntry {
  name: string;
  score: number;
}

// Fungsi ini akan dijalankan saat aplikasi meminta data leaderboard (GET)
export async function GET() {
  try {
    // Ambil data dari Vercel KV dengan kunci 'leaderboard'
    const leaderboard = await kv.get<LeaderboardEntry[]>('leaderboard');
    
    // Jika belum ada data, kembalikan array kosong
    if (!leaderboard) {
      return NextResponse.json([]);
    }
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    // Kembalikan error jika gagal mengambil data
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// Fungsi ini akan dijalankan saat aplikasi mengirim skor baru (POST)
export async function POST(request: Request) {
  try {
    // Baca data yang dikirim oleh aplikasi (nama dan skor)
    const newEntry: LeaderboardEntry = await request.json();

    // Validasi sederhana
    if (!newEntry.name || typeof newEntry.score !== 'number') {
      return new NextResponse('Invalid data', { status: 400 });
    }

    // 1. Ambil leaderboard yang sudah ada
    let leaderboard = await kv.get<LeaderboardEntry[]>('leaderboard') || [];

    // 2. Tambahkan skor baru
    leaderboard.push(newEntry);

    // 3. Urutkan skor dari yang paling tinggi
    leaderboard.sort((a, b) => b.score - a.score);

    // 4. Batasi hanya untuk 20 skor teratas
    const topScores = leaderboard.slice(0, 20);

    // 5. Simpan kembali ke Vercel KV
    await kv.set('leaderboard', topScores);
    
    // Kembalikan respon sukses
    return new NextResponse('Score submitted successfully', { status: 200 });
  } catch (error) {
    console.error('Failed to submit score:', error);
    // Kembalikan error jika gagal menyimpan
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
