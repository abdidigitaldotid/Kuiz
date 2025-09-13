// app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useWebApp } from '@telegram-apps/sdk-react';

// Asumsi Anda memiliki file-file ini
import { allQuizData, Question } from './quizData'; 
import { SelectionScreen } from './components/SelectionScreen';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';

// Tipe untuk tingkat kesulitan
type Difficulty = 'easy' | 'medium' | 'hard';

export default function KuizPage() {
  // --- State untuk Telegram Web App ---
  const webApp = useWebApp();

  // --- State untuk Kontrol Game ---
  const [gameState, setGameState] = useState<'selecting' | 'playing' | 'finished'>('selecting');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // --- State untuk Skor dan Kehidupan (Lives) ---
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  // --- State untuk Interaksi Kuis ---
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15); // Waktu per pertanyaan

  // --- State untuk Power-ups (Contoh) ---
  const [hasUsed5050, setHasUsed5050] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);

  // --- State untuk Leaderboard (Contoh) ---
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // Efek untuk inisialisasi aplikasi Telegram
  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
    }
  }, [webApp]);
  
  // Fungsi untuk memulai kuis setelah memilih kesulitan
  const handleStartQuiz = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setQuestions(allQuizData[difficulty]); // Ambil pertanyaan sesuai kesulitan
    setGameState('playing');
    // Reset state lain jika perlu
    setScore(0);
    setLives(3);
    setCurrentQuestionIndex(0);
  };

  // Fungsi untuk menangani jawaban yang dipilih
  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer) return; // Jangan biarkan memilih lagi jika sudah memilih

    setSelectedAnswer(answer);
    setShowFeedback(true);

    const currentQuestion = questions[currentQuestionIndex];
    if (answer === currentQuestion.correctAnswer) {
      // Jawaban Benar
      setScore(prev => prev + 10); // Contoh penambahan skor
    } else {
      // Jawaban Salah
      setLives(prev => prev - 1);
    }

    // Pindah ke pertanyaan berikutnya setelah beberapa detik
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTimeLeft(15); // Reset waktu
      } else {
        setGameState('finished'); // Kuis selesai
      }
    }, 2000); // Tunggu 2 detik
  };

  // Fungsi untuk memulai ulang kuis
  const handleRestart = () => {
    setGameState('selecting');
    // Reset semua state ke nilai awal
    setSelectedDifficulty(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  // Render komponen berdasarkan state game
  if (gameState === 'selecting') {
    return <SelectionScreen onSelectDifficulty={handleStartQuiz} />;
  }

  if (gameState === 'playing' && questions.length > 0) {
    return (
      <QuizScreen
        question={questions[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
        score={score}
        lives={lives}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        selectedAnswer={selectedAnswer}
        showFeedback={showFeedback}
      />
    );
  }

  if (gameState === 'finished') {
    return (
      <ResultScreen
        score={score}
        totalQuestions={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  // Fallback jika terjadi state yang tidak valid
  return <div>Memuat Kuis...</div>;
}
