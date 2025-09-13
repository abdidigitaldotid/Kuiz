// app/page.tsx

"use client";

import { useState, useEffect, useCallback } from 'react';
import { allQuizData, pointsPerDifficulty, Question } from './quizData';

interface LeaderboardEntry {
  name: string;
  score: number;
}

type GameState = 'selection' | 'playing' | 'finished' | 'leaderboard';

export default function QuizPage() {
  // --- STATE MANAGEMENT ---
  const [gameState, setGameState] = useState<GameState>('selection');
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
  
  // --- FUNGSI-FUNGSI KUIS (Didefinisikan di atas useEffect) ---
  const handleWrongAnswer = useCallback(() => {
    const newLives = lives - 1;
    setLives(newLives);
    setShowFeedback(true);
    if (newLives <= 0) {
      setGameState('finished');
    }
  }, [lives]);

  // --- LOGIKA-LOGIKA (useEffect) ---
  useEffect(() => {
    if (gameState !== 'playing' || showFeedback || isPaused) return;
    if (timeLeft === 0) {
      handleWrongAnswer();
      return;
    }
    const timerId = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, showFeedback, isPaused, gameState, handleWrongAnswer]);

  useEffect(() => {
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
  
  useEffect(() => {
    if (gameState === 'leaderboard') {
      setIsLoadingLeaderboard(true);
      fetch('/api/scores')
        .then(res => res.json())
        .then((data: LeaderboardEntry[]) => setLeaderboardData(data))
        .catch(err => console.error("Gagal mengambil leaderboard:", err))
        .finally(() => setIsLoadingLeaderboard(false));
    }
  }, [gameState]);

  // --- FUNGSI ALUR PERMAINAN ---
  const handleCategorySelect = (category: string) => setSelectedCategory(category);
  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setCurrentQuestions(allQuizData[selectedCategory][difficulty]);
    setGameState('playing');
  };

  const resetQuiz = () => {
    setGameState('selection');
    setSelectedCategory('');
    setSelectedDifficulty('');
    setCurrentQuestions([]);
    setLives(3);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(15);
    setIsPaused(false);
    setHasUsed5050(false);
    setDisabledOptions([]);
    setHasSubmitted(false);
    setPlayerName('');
  };

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
    if (answer === currentQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + pointsPerDifficulty[selectedDifficulty!]);
      setShowFeedback(true);
    } else {
      handleWrongAnswer();
    }
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setTimeLeft(15);
    setDisabledOptions([]);
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setGameState('finished');
    }
  };

  const handleSubmitScore = async () => {
    if (!playerName.trim() || isSubmitting) {
      alert("Nama tidak boleh kosong!");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score }),
      });
      setHasSubmitted(true);
    } catch (error) {
      console.error("Gagal mengirim skor:", error);
      alert("Gagal mengirim skor, coba lagi nanti.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- FUNGSI-FUNGSI IKLAN ---
  const handleWatchAdForLife = () => {
    if (isAdLoading) return;
    if (window.show_9867079) {
      setIsAdLoading(true);
      window.show_9867079()
        .then(() => {
          alert('Selamat! Kamu mendapatkan 1 nyawa tambahan!');
          setLives(1);
          setGameState('playing');
          setShowFeedback(false);
          setSelectedAnswer(null);
          setTimeLeft(15);
        })
        .catch((error) => console.error("Iklan Gagal:", error))
        .finally(() => setIsAdLoading(false));
    }
  };
  
  const handle5050 = () => {
    if (hasUsed5050 || showFeedback || isAdLoading) return;
    if (window.show_9867079) {
      setIsPaused(true);
      setIsAdLoading(true);
      window.show_9867079()
        .then(() => {
          alert("Terima kasih! Dua pilihan salah telah dihilangkan.");
          const currentQuestion = currentQuestions[currentQuestionIndex];
          const correctAnswer = currentQuestion.correctAnswer;
          const wrongOptions = currentQuestion.options.filter(opt => opt !== correctAnswer);
          const oneWrongOptionToShow = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
          const optionsToDisable = wrongOptions.filter(opt => opt !== oneWrongOptionToShow);
          setDisabledOptions(optionsToDisable);
          setHasUsed5050(true);
        })
        .catch((error) => alert("Oops, iklan gagal dimuat."))
        .finally(() => {
          setIsPaused(false);
          setIsAdLoading(false);
        });
    }
  };

  // --- TAMPILAN (UI) ---

  if (gameState === 'selection') {
    return (
      <main style={styles.container}>
        <div style={styles.quizCard}>
          {!selectedCategory ? (
            <>
              <h1>Pilih Kategori</h1>
              <div style={styles.selectionGrid}>
                {Object.keys(allQuizData).map(category => (
                  <button key={category} onClick={() => handleCategorySelect(category)} style={styles.primaryButton}>
                    {category}
                  </button>
                ))}
              </div>
              <button onClick={() => setGameState('leaderboard')} style={{...styles.secondaryButton, marginTop: '20px', width: '100%'}}>🏆 Lihat Papan Peringkat</button>
            </>
          ) : (
            <>
              <h1>Pilih Level: {selectedCategory}</h1>
              <div style={styles.selectionGrid}>
                {Object.keys(allQuizData[selectedCategory]).map(difficulty => (
                  <button key={difficulty} onClick={() => handleDifficultySelect(difficulty)} style={styles.primaryButton}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} (+{pointsPerDifficulty[difficulty]} Poin)
                  </button>
                ))}
              </div>
              <button onClick={() => setSelectedCategory('')} style={{...styles.secondaryButton, marginTop: '20px', width: '100%'}}>Kembali</button>
            </>
          )}
        </div>
      </main>
    );
  }
  
  if (gameState === 'leaderboard') {
    return (
      <main style={styles.container}>
        <div style={styles.quizCard}>
          <h1>🏆 Papan Peringkat 🏆</h1>
          {isLoadingLeaderboard ? <p>Memuat data...</p> : (
            <ol style={styles.leaderboardList}>
              {leaderboardData.length > 0 ? leaderboardData.map((entry, index) => (
                <li key={index}>
                  <span>{index + 1}. {entry.name}</span>
                  <span>{entry.score} Poin</span>
                </li>
              )) : <p>Belum ada skor. Jadilah yang pertama!</p>}
            </ol>
          )}
          <button onClick={() => setGameState('selection')} style={{...styles.primaryButton, marginTop: '20px'}}>Kembali</button>
        </div>
      </main>
    )
  }

  if (gameState === 'finished') {
    return (
      <main style={styles.container}>
        <div style={styles.quizCard}>
          <h1>{lives <= 0 ? 'Yah, Nyawa Habis!' : 'Kuis Selesai!'}</h1>
          <p style={styles.finalScore}>Skor Akhir Anda: {score}</p>
          {!hasSubmitted && score > 0 && (
            <div style={styles.submitForm}>
              <input 
                type="text" 
                placeholder="Masukkan Nama Anda" 
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={styles.input}
                maxLength={15}
              />
              <button onClick={handleSubmitScore} disabled={isSubmitting} style={styles.primaryButton}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Skor'}
              </button>
            </div>
          )}
          {hasSubmitted && <p style={{color: 'green'}}>Skor berhasil dikirim!</p>}
          {lives <= 0 && !hasSubmitted && (
            <div style={{ margin: '10px 0' }}>
              <button onClick={handleWatchAdForLife} disabled={isAdLoading} style={{...styles.primaryButton, background: '#28a745'}}>
                {isAdLoading ? 'Memuat...' : '❤️ Tonton Iklan (+1 Nyawa)'}
              </button>
            </div>
          )}
          <button onClick={resetQuiz} style={{...styles.secondaryButton, width: '100%', background: '#6c757d', marginTop: '10px'}}>
            Kembali ke Menu Utama
          </button>
        </div>
      </main>
    );
  }

  // Bagian ini yang sebelumnya hilang dan menyebabkan 'unused variable'
  const currentQuestion = currentQuestions[currentQuestionIndex];
  return (
    <main style={styles.container}>
      <div style={styles.quizCard}>
        <div style={styles.header}>
          <span style={styles.questionCounter}>Pertanyaan {currentQuestionIndex + 1} / {currentQuestions.length}</span>
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
            const isDisabled = disabledOptions.includes(option);
            let buttonStyle = styles.optionButton;
            if (isDisabled) buttonStyle = {...buttonStyle, opacity: 0, pointerEvents: 'none'};
            if (showFeedback && isCorrect) buttonStyle = {...buttonStyle, ...styles.correctAnswer, opacity: 1};
            else if (showFeedback && isSelected && !isCorrect) buttonStyle = {...buttonStyle, ...styles.wrongAnswer, opacity: 1};
            return (<button key={option} onClick={() => handleAnswerClick(option)} style={buttonStyle} disabled={showFeedback || isDisabled}>{option}</button>);
          })}
        </div>
        {showFeedback ? (
          <button onClick={handleNextQuestion} style={{...styles.primaryButton, marginTop: '20px'}}>Lanjut</button>
        ) : (
          <div style={styles.helpButtonsContainer}>
            <button onClick={handle5050} disabled={hasUsed5050 || isAdLoading} style={styles.helpButton}>
              50:50 (Iklan)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// --- STYLING ---
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px', textAlign: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '14px', color: '#555' },
  questionCounter: {},
  livesContainer: { display: 'flex', gap: '4px', fontSize: '18px' },
  score: { fontWeight: 'bold' },
  timerWrapper: { textAlign: 'center', marginBottom: '15px', fontSize: '18px' },
  timer: { fontWeight: 'bold', background: '#eee', padding: '5px 10px', borderRadius: '5px' },
  questionText: { margin: '0 0 25px 0', fontSize: '20px', textAlign: 'center' },
  optionsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', minHeight: '120px' },
  optionButton: { width: '100%', padding: '15px', fontSize: '16px', border: '2px solid #ddd', borderRadius: '8px', background: '#f9f9f9', cursor: 'pointer', transition: 'all 0.2s' },
  primaryButton: { width: '100%', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  secondaryButton: { padding: '12px', fontSize: '14px', border: '1px solid #6c757d', borderRadius: '8px', background: 'transparent', color: '#6c757d', cursor: 'pointer' },
  helpButtonsContainer: { display: 'flex', gap: '10px', marginTop: '20px' },
  helpButton: { flex: 1, padding: '12px', fontSize: '14px', border: 'none', borderRadius: '8px', background: '#6c757d', color: 'white', cursor: 'pointer' },
  correctAnswer: { background: '#28a_745', color: 'white', borderColor: '#28a745' },
  wrongAnswer: { background: '#dc3545', color: 'white', borderColor: '#dc3545' },
  finalScore: { fontSize: '24px', fontWeight: 'bold', margin: '20px 0' },
  selectionGrid: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  submitForm: { display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' },
  input: { padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px' },
  leaderboardList: { listStyle: 'none', padding: 0, textAlign: 'left' },
};
