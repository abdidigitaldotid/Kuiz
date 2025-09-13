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
  const [lives, setLives] = useState(3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isPaused, setIsPaused] = useState(false);
  const [hasUsed5050, setHasUsed5050] = useState(false); // <-- STATE BARU untuk 50:50
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]); // <-- STATE BARU untuk menonaktifkan pilihan

  // --- LOGIKA-LOGIKA (useEffect tetap sama) ---
  useEffect(() => {
    if (showFeedback || isQuizOver || isPaused) return;
    if (timeLeft === 0) {
      handleWrongAnswer();
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, showFeedback, isQuizOver, isPaused]);

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
  const handleWrongAnswer = () => {
    const newLives = lives - 1;
    setLives(newLives);
    setShowFeedback(true);
    if (newLives <= 0) {
      setIsQuizOver(true);
    }
  };

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    if (answer === quizData[currentQuestionIndex].correctAnswer) {
      setScore(score + 10);
      setShowFeedback(true);
    } else {
      handleWrongAnswer();
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setDisabledOptions([]); // <-- Reset pilihan yang dinonaktifkan
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizOver(true);
    }
  };

  const resetQuiz = () => {
    setLives(3);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsQuizOver(false);
    setTimeLeft(15);
    setIsPaused(false);
    setHasUsed5050(false); // <-- Reset bantuan 50:50
    setDisabledOptions([]); // <-- Reset pilihan yang dinonaktifkan
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

  const handleWatchAdForLife = () => {
    // ... (fungsi ini tetap sama)
    if (isAdLoading) return;
    if (window.show_9867079) {
      setIsAdLoading(true);
      window.show_9867079()
        .then(() => {
          alert('Selamat! Kamu mendapatkan 1 nyawa tambahan!');
          setLives(1);
          setIsQuizOver(false);
          setShowFeedback(false);
          setSelectedAnswer(null);
          setTimeLeft(15);
        })
        .catch((error) => console.error("Iklan Gagal:", error))
        .finally(() => setIsAdLoading(false));
    }
  };

  // <-- [FUNGSI BARU] UNTUK BANTUAN 50:50 ---
  const handle5050 = () => {
    if (hasUsed5050 || showFeedback) return;

    const currentQuestion = quizData[currentQuestionIndex];
    const correctAnswer = currentQuestion.correctAnswer;
    const wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
    
    // Acak pilihan yang salah dan ambil satu untuk tetap ditampilkan
    const oneWrongOptionToShow = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    
    // Cari dua pilihan yang akan disembunyikan
    const optionsToDisable = wrongOptions.filter(opt => opt !== oneWrongOptionToShow);

    setDisabledOptions(optionsToDisable);
    setHasUsed5050(true);
  };


  // --- TAMPILAN (UI) ---
  if (isQuizOver) {
    return (
      <main style={styles.container}>
        <div style={styles.quizCard}>
          <h1>{lives <= 0 ? 'Yah, Nyawa Habis!' : 'Kuis Selesai!'}</h1>
          <p style={styles.finalScore}>Skor Akhir Anda: {score}</p>
          {lives <= 0 && (
            <div style={{ marginBottom: '10px' }}>
              <button onClick={handleWatchAdForLife} disabled={isAdLoading} style={{...styles.primaryButton, background: '#28a745'}}>
                {isAdLoading ? 'Memuat...' : '❤️ Tonton Iklan (+1 Nyawa)'}
              </button>
            </div>
          )}
          <button onClick={resetQuiz} style={{...styles.secondaryButton, width: '100%', background: '#6c757d'}}>
            Mulai Kuis Baru
          </button>
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
          <div style={styles.livesContainer}>
            {Array.from({ length: 3 }).map((_, index) => (
              <span key={index} style={{ opacity: index < lives ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>
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
            const isDisabled = disabledOptions.includes(option); // <-- Cek apakah pilihan ini harus non-aktif
            let buttonStyle = styles.optionButton;

            if (isDisabled) buttonStyle = {...buttonStyle, opacity: 0, pointerEvents: 'none'}; // <-- Sembunyikan tombol
            if (showFeedback && isCorrect) buttonStyle = {...buttonStyle, ...styles.correctAnswer, opacity: 1};
            else if (showFeedback && isSelected && !isCorrect) buttonStyle = {...buttonStyle, ...styles.wrongAnswer, opacity: 1};
            
            return (<button key={option} onClick={() => handleAnswerClick(option)} style={buttonStyle} disabled={showFeedback || isDisabled}>{option}</button>);
          })}
        </div>
        
        {showFeedback ? (
          <button onClick={handleNextQuestion} style={{...styles.primaryButton, marginTop: '20px'}}>Lanjut</button>
        ) : (
          // <-- [TAMPILAN BARU] KELOMPOK TOMBOL BANTUAN -->
          <div style={styles.helpButtonsContainer}>
            <button onClick={handle5050} disabled={hasUsed5050} style={styles.helpButton}>
              50:50
            </button>
            <button onClick={handleShowRewardedAd} disabled={isAdLoading} style={{...styles.helpButton, flexGrow: 2}}>
              {isAdLoading ? 'Memuat...' : '💡 Bantuan Iklan'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// --- STYLING ---
const styles: { [key: string]: React.CSSProperties } = {
  // ... (semua style lama Anda tetap sama)
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px', textAlign: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '14px', color: '#555' },
  questionCounter: {},
  livesContainer: { display: 'flex', gap: '4px', fontSize: '18px' },
  score: { fontWeight: 'bold' },
  timerWrapper: { textAlign: 'center', marginBottom: '15px', fontSize: '18px' },
  timer: { fontWeight: 'bold', background: '#eee', padding: '5px 10px', borderRadius: '5px' },
  questionText: { margin: '0 0 25px 0', fontSize: '20px', textAlign: 'center' },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', minHeight: '120px' }, // <-- minHeight ditambahkan
  optionButton: { width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', cursor: 'pointer', transition: 'all 0.2s' },
  primaryButton: { width: '100%', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  secondaryButton: { width: '100%', padding: '12px', fontSize: '14px', border: 'none', borderRadius: '8px', background: '#6c757d', color: 'white', cursor: 'pointer' },
  helpButtonsContainer: { display: 'flex', gap: '10px', marginTop: '20px' }, // <-- Style baru
  helpButton: { flex: 1, padding: '12px', fontSize: '14px', border: 'none', borderRadius: '8px', background: '#6c757d', color: 'white', cursor: 'pointer' }, // <-- Style baru
  correctAnswer: { background: '#28a745', color: 'white', borderColor: '#28a745' },
  wrongAnswer: { background: '#dc3545', color: 'white', borderColor: '#dc3545' },
  finalScore: { fontSize: '24px', fontWeight: 'bold', margin: '20px 0' },
};
