// app/page.tsx

"use client";

import { useState, useEffect } from 'react';

// --- 1. DATA PERTANYAAN KUIS ---
// Anda bisa menambah atau mengubah pertanyaan di sini
const quizData = [
  {
    question: "Apa ibukota Indonesia?",
    options: ["Jakarta", "Bandung", "Surabaya", "Medan"],
    correctAnswer: "Jakarta",
  },
  {
    question: "Siapakah presiden pertama Indonesia?",
    options: ["Soeharto", "B.J. Habibie", "Soekarno", "Joko Widodo"],
    correctAnswer: "Soekarno",
  },
  {
    question: "Lagu kebangsaan Indonesia adalah...",
    options: ["Garuda Pancasila", "Indonesia Raya", "Maju Tak Gentar", "Padamu Negeri"],
    correctAnswer: "Indonesia Raya",
  },
  {
    question: "Berapa hasil dari 5 x 10?",
    options: ["40", "55", "60", "50"],
    correctAnswer: "50",
  },
];

export default function QuizPage() {
  // --- 2. STATE MANAGEMENT KUIS ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isQuizOver, setIsQuizOver] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(false);

  // --- 3. LOGIKA UTAMA KUIS ---

  // Fungsi yang dijalankan saat user memilih jawaban
  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return; // Jangan biarkan user menjawab lagi jika sudah dijawab

    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === quizData[currentQuestionIndex].correctAnswer) {
      setScore(score + 10); // Tambah 10 poin jika benar
    }
  };

  // Fungsi untuk lanjut ke pertanyaan berikutnya
  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);

    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizOver(true); // Jika pertanyaan habis, kuis selesai
    }
  };
  
  // Fungsi untuk mengulang kuis dari awal
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsQuizOver(false);
  }

  // --- 4. INTEGRASI IKLAN MONETAG ---
  const handleShowRewardedAd = () => {
    if (isAdLoading || showFeedback) return;

    if (window.show_9867079) {
      setIsAdLoading(true);
      window.show_9867079()
        .then(() => {
          // INILAH HADIAHNYA: Setelah nonton iklan, jawaban yang benar akan ditandai
          alert("Terima kasih! Jawaban yang benar telah ditandai.");
          setSelectedAnswer(quizData[currentQuestionIndex].correctAnswer);
          setShowFeedback(true); // Langsung tunjukkan feedback
        })
        .catch((error) => {
          console.error("Gagal menampilkan iklan:", error);
          alert("Oops, iklan gagal dimuat. Coba lagi nanti.");
        })
        .finally(() => {
          setIsAdLoading(false);
        });
    } else {
      alert("Fitur bantuan belum siap, coba sesaat lagi.");
    }
  };

  // --- 5. TAMPILAN (RENDER UI) ---
  
  // Tampilan saat kuis selesai
  if (isQuizOver) {
    return (
      <main style={styles.container}>
        <div style={styles.quizCard}>
          <h1>Kuis Selesai!</h1>
          <p style={styles.finalScore}>Skor Akhir Anda: {score}</p>
          <button onClick={resetQuiz} style={styles.primaryButton}>
            Main Lagi
          </button>
        </div>
      </main>
    );
  }

  // Tampilan utama saat kuis berjalan
  const currentQuestion = quizData[currentQuestionIndex];
  return (
    <main style={styles.container}>
      <div style={styles.quizCard}>
        <div style={styles.header}>
          <span style={styles.questionCounter}>Pertanyaan {currentQuestionIndex + 1} dari {quizData.length}</span>
          <span style={styles.score}>Skor: {score}</span>
        </div>
        
        <h2 style={styles.questionText}>{currentQuestion.question}</h2>
        
        <div style={styles.optionsGrid}>
          {currentQuestion.options.map((option) => {
            const isCorrect = option === currentQuestion.correctAnswer;
            const isSelected = option === selectedAnswer;
            let buttonStyle = styles.optionButton;
            if (showFeedback && isCorrect) {
              buttonStyle = {...buttonStyle, ...styles.correctAnswer};
            } else if (showFeedback && isSelected && !isCorrect) {
              buttonStyle = {...buttonStyle, ...styles.wrongAnswer};
            }

            return (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                style={buttonStyle}
                disabled={showFeedback}
              >
                {option}
              </button>
            );
          })}
        </div>
        
        {showFeedback ? (
          <button onClick={handleNextQuestion} style={{...styles.primaryButton, marginTop: '20px'}}>
            Lanjut
          </button>
        ) : (
          <button onClick={handleShowRewardedAd} disabled={isAdLoading} style={{...styles.secondaryButton, marginTop: '20px'}}>
            {isAdLoading ? 'Memuat...' : '💡 Butuh Bantuan?'}
          </button>
        )}
      </div>
    </main>
  );
}

// --- 6. STYLING UNTUK TAMPILAN ---
// Anda bisa memindahkan ini ke file CSS jika mau
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '14px', color: '#555' },
  questionCounter: {},
  score: { fontWeight: 'bold' },
  questionText: { margin: '0 0 25px 0', fontSize: '20px', textAlign: 'center' },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  optionButton: { width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', cursor: 'pointer', transition: 'all 0.2s' },
  primaryButton: { width: '100%', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  secondaryButton: { width: '100%', padding: '12px', fontSize: '14px', border: 'none', borderRadius: '8px', background: '#6c757d', color: 'white', cursor: 'pointer' },
  correctAnswer: { background: '#28a745', color: 'white', borderColor: '#28a745' },
  wrongAnswer: { background: '#dc3545', color: 'white', borderColor: '#dc3545' },
  finalScore: { fontSize: '24px', fontWeight: 'bold', margin: '20px 0' },
};
