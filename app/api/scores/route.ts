// app/api/scores/route.ts

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export interface LeaderboardEntry {
  name: string;
  score: number;
}

export async function GET() {
  try {
    const leaderboard = await kv.get<LeaderboardEntry[]>('leaderboard');
    if (!leaderboard) {
      return NextResponse.json([]);
    }
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Failed to fetch leaderboard:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newEntry: LeaderboardEntry = await request.json();
    if (!newEntry.name || typeof newEntry.score !== 'number') {
      return new NextResponse('Invalid data', { status: 400 });
    }

    // [FIX] Menggunakan const karena variabel tidak diubah lagi
    const leaderboard = await kv.get<LeaderboardEntry[]>('leaderboard') || [];
    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);
    const topScores = leaderboard.slice(0, 20);
    await kv.set('leaderboard', topScores);
    
    return new NextResponse('Score submitted successfully', { status: 200 });
  } catch (error) {
    console.error('Failed to submit score:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
