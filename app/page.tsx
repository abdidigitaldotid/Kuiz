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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);

  // --- LOGIKA TIMER PERTANYAAN 15 DETIK---
  useEffect(() => {
    if (showFeedback || isQuizOver) return;
    if (timeLeft === 0) {
      setShowFeedback(true);
      setSelectedAnswer(null);
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, showFeedback, isQuizOver]);

  // --- [LOGIKA BARU] IKLAN MUNCUL SETIAP 90 DETIK SECARA BERULANG ---
  useEffect(() => {
    console.log("Memulai interval iklan per 90 detik.");
  
    const adIntervalId = setInterval(() => {
      // Selama aplikasi terbuka, iklan ini akan coba muncul setiap 90 detik
      if (window.show_9867079) {
        console.log("Waktunya iklan interstitial periodik (90 detik)!");
        window.show_9867079({
          type: 'inApp',
          inAppSettings: { frequency: 2, capping: 0.1, interval: 30, timeout: 5, everyPage: false },
        });
      }
    }, 90000); // 90 detik = 90,000 milidetik
  
    // Fungsi cleanup: Hentikan interval jika pengguna menutup mini app
    return () => {
      clearInterval(adIntervalId);
      console.log("Menghentikan interval iklan.");
    };
  }, []); // <-- Array kosong berarti ini hanya akan di-set SATU KALI saat aplikasi pertama kali dibuka.


  // --- FUNGSI-FUNGSI KUIS ---
  // ... (Tidak ada perubahan di semua fungsi kuis)
  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    setShowFeedback(true);
    setSelectedAnswer(answer);
    if (answer === quizData[currentQuestionIndex].correctAnswer) {
      setScore(score + 10);
    }
  };

  const handleNextQuestion = () => {
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
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsQuizOver(false);
    setTimeLeft(15);
  };

  const handleShowRewardedAd = () => {
    if (isAdLoading || showFeedback) return;
    if (window.show_9867079) {
      setIsAdLoading(true);
      window.show_9867079()
        .then(() => {
          alert("Terima kasih! Jawaban yang benar telah ditandai.");
          setShowFeedback(true);
          setSelectedAnswer(quizData[currentQuestionIndex].correctAnswer);
        })
        .catch((error) => console.error("Iklan Gagal:", error))
        .finally(() => setIsAdLoading(false));
    }
  };


  // --- TAMPILAN (UI) ---
  // ... (Tidak ada perubahan di bagian UI)
  if (isQuizOver) {
    return (
      <main style={styles.container}>
        <div style={styles.quizCard}>
          <h1>Kuis Selesai!</h1>
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
          <span style={styles.questionCounter}>Pertanyaan {currentQuestionIndex + 1} dari {quizData.length}</span>
          <span style={styles.score}>Skor: {score}</span>
        </div>
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
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', color: '#555' },
  questionCounter: {},
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
