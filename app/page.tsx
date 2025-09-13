// app/page.tsx

"use client";

import { useState, useEffect, useCallback } from 'react';
import { allQuizData, pointsPerDifficulty, Question } from './quizData';
import useSound from 'use-sound';
import { useWebApp } from '@twa-dev/sdk-react';

// Import komponen-komponen baru kita
import { SelectionScreen } from './components/SelectionScreen';
import { QuizPlayScreen } from './components/QuizPlayScreen';
import { FinishedScreen } from './components/FinishedScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';

interface LeaderboardEntry { name: string; score: number; }
type GameState = 'selection' | 'playing' | 'finished' | 'leaderboard';

export default function QuizPage() {
  // --- STATE MANAGEMENT (Semua state tetap di sini) ---
  const [gameState, setGameState] = useState<GameState>('selection');
  // ... (semua state lainnya tetap sama persis seperti kode Anda sebelumnya)
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [lives, setLives] = useState(3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [hasUsed5050, setHasUsed5050] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // --- INISIALISASI (Semua hooks tetap di sini) ---
  const WebApp = useWebApp();
  const [playCorrect] = useSound('/correct.mp3', { volume: 0.5 });
  const [playWrong] = useSound('/wrong.mp3', { volume: 0.5 });
  const [playClick] = useSound('/click.mp3', { volume: 0.25 });
  const [playFinish] = useSound('/finish.mp3', { volume: 0.6 });

  // --- FUNGSI-FUNGSI LOGIKA (Semua fungsi tetap di sini) ---
  const handleWrongAnswer = useCallback(() => { /* ... */ });
  // ... (semua useEffect dan fungsi-fungsi lainnya tetap di sini, tidak ada yang berubah)
  

  // --- RENDER KONDISIONAL ---
  // "Otak" akan memutuskan komponen mana yang akan ditampilkan
  if (gameState === 'selection') {
    return (
      <SelectionScreen
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => { playClick(); setSelectedCategory(category); }}
        onDifficultySelect={(difficulty) => { playClick(); setSelectedDifficulty(difficulty); setCurrentQuestions(allQuizData[selectedCategory][difficulty]); setGameState('playing'); }}
        onShowLeaderboard={() => { playClick(); setGameState('leaderboard'); }}
        onBack={() => { playClick(); setSelectedCategory(''); }}
      />
    );
  }

  if (gameState === 'leaderboard') {
    return (
      <LeaderboardScreen
        isLoading={isLoadingLeaderboard}
        leaderboardData={leaderboardData}
        onBack={() => { playClick(); setGameState('selection'); }}
      />
    );
  }

  if (gameState === 'finished') {
    return (
      <FinishedScreen
        score={score}
        lives={lives}
        playerName={playerName}
        isSubmitting={isSubmitting}
        hasSubmitted={hasSubmitted}
        isAdLoading={isAdLoading}
        onPlayerNameChange={setPlayerName}
        onSubmitScore={() => { playClick(); /* ... fungsi handleSubmitScore ... */ }}
        onWatchAdForLife={() => { /* ... fungsi handleWatchAdForLife ... */ }}
        onResetQuiz={resetQuiz}
        onShareScore={() => { /* ... fungsi handleShareScore ... */ }}
      />
    );
  }

  if (gameState === 'playing') {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    return (
      <QuizPlayScreen
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={currentQuestions.length}
        lives={lives}
        score={score}
        timeLeft={timeLeft}
        selectedAnswer={selectedAnswer}
        showFeedback={showFeedback}
        disabledOptions={disabledOptions}
        isAdLoading={isAdLoading}
        hasUsed5050={hasUsed5050}
        onAnswerClick={handleAnswerClick}
        onNextQuestion={handleNextQuestion}
        on5050={handle5050}
      />
    );
  }

  return null; // Fallback
}
