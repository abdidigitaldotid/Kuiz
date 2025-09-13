// app/page.tsx

"use client";

import { useState, useEffect } from 'react';

// --- DATA KUIS ---
const quizData = [
  { question: "Apa ibukota Indonesia?", options: ["Jakarta", "Bandung", "Surabaya", "Medan"], correctAnswer: "Jakarta" },
  { question: "Siapakah presiden pertama Indonesia?", options: ["Soeharto", "B.J. Habibie", "Soekarno", "Joko Widodo"], correctAnswer: "Soekarno" },
  { question: "Lagu kebangsaan Indonesia adalah...", options: ["Garuda Pancasila", "Indonesia Raya", "Maju Tak Gentar", "Padamu Negeri"], correctAnswer: "Indonesia Raya" },
  { question: "Berapa hasil dari 5 x 10?", options: ["40", "55", "60", "50"], correctAnswer: "50" },
];

export default function QuizPage() {
  // --- STATE MANAGEMENT ---
  const [lives, setLives] = useState(3); // <-- STATE BARU UNTUK NYAWA
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);

  // --- LOGIKA TIMER PERTANYAAN 15 DETIK ---
  useEffect(() => {
    if (showFeedback || isQuizOver || isPaused) return;

    if (timeLeft === 0) {
      handleWrongAnswer(); // <-- Panggil fungsi handleWrongAnswer saat waktu habis
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, showFeedback, isQuizOver, isPaused]);

  // --- LOGIKA IKLAN PERIODIK (tetap sama) ---
  useEffect(() => {
    // ... (kode iklan periodik tidak berubah)
    const adIntervalId = setInterval(() => {
      if (window.show_9867079) {
        setIsPaused(true);
        window.show_9867079({
          type: 'inApp',
          inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false },
        }).finally(() => setIsPaused(false));
      }
    }, 90000);
    return () => clearInterval(adIntervalId);
  }, []);

  // --- FUNGSI-FUNGSI KUIS ---

  // <-- FUNGSI BANTUAN BARU UNTUK MENANGANI JAWABAN SALAH ---
  const handleWrongAnswer = () => {
    const newLives = lives - 1;
    setLives(newLives);
    setShowFeedback(true);
    if (newLives === 0) {
      setIsQuizOver(true); // Langsung akhiri kuis jika nyawa habis
    }
  };

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    if (answer === quizData[currentQuestionIndex].correctAnswer) {
      setScore(score + 10);
      setShowFeedback(true);
    } else {
      handleWrongAnswer(); // <-- Panggil fungsi ini jika jawaban salah
    }
  };

  const handleNextQuestion = () => {
    // ... (fungsi ini tetap sama)
    setShowFeedback(false);
    setSelectedAnswer(null);
    setTimeLeft(15);
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizOver(true);
    }
  };

  const resetQuiz = () => {
    setLives(3); // <-- RESET NYAWA
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsQuizOver(false);
    setTimeLeft(15);
    setIsPaused(false);
  };

  const handleShowRewardedAd = () => {
    // ... (fungsi ini tetap sama)
    if (isAdLoading || showFeedback) return;
    if (window.show_9867079) {
      setIsPaused(true);
      setIsAdLoading(true);
      window.show_9867079()
        .then(() => {
          alert("Terima kasih! Jawaban yang benar telah ditandai.");
          setShowFeedback(true);
          setSelectedAnswer(quizData[currentQuestionIndex].correctAnswer);
        })
        .catch((error) => console.error("Iklan Gagal:", error))
        .finally(() => {
          setIsPaused(false);
          setIsAdLoading(false);
        });
    }
  };

  // --- TAMPILAN (UI) ---
  if (isQuizOver) {
    return (
      <main style={styles.container}>
        <div style={styles.quizCard}>
          {/* <-- Pesan Game Over yang dinamis */}
          <h1>{lives === 0 ? 'Yah, Nyawa Habis!' : 'Kuis Selesai!'}</h1>
          <p style={styles.finalScore}>Skor Akhir Anda: {score}</p>
          <button onClick={resetQuiz} style={styles.primaryButton}>Main Lagi</button>
        </div>
      </main>
    );
  }

  const currentQuestion = quizData[currentQuestionIndex];
  return (
    <main style={styles.container}>
      <div style={styles.quizCard}>
        <div style={styles.header}>
          <span style={styles.questionCounter}>Pertanyaan {currentQuestionIndex + 1} / {quizData.length}</span>
          {/* <-- Tampilan Nyawa Baru */}
          <div style={styles.livesContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <span key={index} style={{ opacity: index < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
          <span style={styles.score}>Skor: {score}</span>
        </div>
        
        {/* ... sisa UI tetap sama ... */}
        <div style={styles.timerWrapper}>
          Waktu Tersisa: <span style={{...styles.timer, color: timeLeft <= 5 ? 'red' : 'black'}}>{timeLeft}</span>
        </div>
        <h2 style={styles.questionText}>{currentQuestion.question}</h2>
        <div style={styles.optionsGrid}>
          {currentQuestion.options.map((option) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            let buttonStyle = styles.optionButton;
            if (showFeedback && isCorrect) buttonStyle = {...buttonStyle, ...styles.correctAnswer};
            else if (showFeedback && isSelected && !isCorrect) buttonStyle = {...buttonStyle, ...styles.wrongAnswer};
            return (<button key={option} onClick={() => handleAnswerClick(option)} style={buttonStyle} disabled={showFeedback}>{option}</button>);
          })}
        </div>
        {showFeedback ? (
          <button onClick={handleNextQuestion} style={{...styles.primaryButton, marginTop: '20px'}}>Lanjut</button>
        ) : (
          <button onClick={handleShowRewardedAd} disabled={isAdLoading} style={{...styles.secondaryButton, marginTop: '20px'}}>
            {isAdLoading ? 'Memuat...' : '💡 Butuh Bantuan?'}
          </button>
        )}
      </div>
    </main>
  );
}

// --- STYLING ---
const styles: { [key: string]: React.CSSProperties } = {
  // ... (salin semua style lama Anda)
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '14px', color: '#555' }, // <-- alignItems: 'center' ditambahkan
  questionCounter: {},
  livesContainer: { display: 'flex', gap: '4px', fontSize: '18px' }, // <-- Style baru untuk nyawa
  score: { fontWeight: 'bold' },
  timerWrapper: { textAlign: 'center', marginBottom: '15px', fontSize: '18px' },
  timer: { fontWeight: 'bold', background: '#eee', padding: '5px 10px', borderRadius: '5px' },
  questionText: { margin: '0 0 25px 0', fontSize: '20px', textAlign: 'center' },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  optionButton: { width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', cursor: 'pointer', transition: 'all 0.2s' },
  primaryButton: { width: '100%', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  secondaryButton: { width: '100%', padding: '12px', fontSize: '14px', border: 'none', borderRadius: '8px', background: '#6c757d', color: 'white', cursor: 'pointer' },
  correctAnswer: { background: '#28a745', color: 'white', borderColor: '#28a745' },
  wrongAnswer: { background: '#dc3545', color: 'white', borderColor: '#dc3545' },
  finalScore: { fontSize: '24px', fontWeight: 'bold', margin: '20px 0' },
};
