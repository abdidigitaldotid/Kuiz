// app/components/QuizPlayScreen.tsx
"use client";

import { Question } from '../quizData';

// Definisikan semua props yang dibutuhkan oleh komponen ini
interface QuizPlayScreenProps {
    currentQuestion: Question;
    currentQuestionIndex: number;
    totalQuestions: number;
    lives: number;
    score: number;
    timeLeft: number;
    selectedAnswer: string | null;
    showFeedback: boolean;
    disabledOptions: string[];
    isAdLoading: boolean;
    hasUsed5050: boolean;
    onAnswerClick: (answer: string) => void;
    onNextQuestion: () => void;
    on5050: () => void;
}

export function QuizPlayScreen({
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    lives,
    score,
    timeLeft,
    selectedAnswer,
    showFeedback,
    disabledOptions,
    isAdLoading,
    hasUsed5050,
    onAnswerClick,
    onNextQuestion,
    on5050
}: QuizPlayScreenProps) {
  return (
    <main style={styles.container}>
      <div style={styles.quizCard}>
        <div style={styles.header}>
          <span style={styles.questionCounter}>Pertanyaan {currentQuestionIndex + 1} / {totalQuestions}</span>
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
            return (<button key={option} onClick={() => onAnswerClick(option)} style={buttonStyle} disabled={showFeedback || isDisabled}>{option}</button>);
          })}
        </div>
        {showFeedback ? (
          <button onClick={onNextQuestion} style={{...styles.primaryButton, marginTop: '20px'}}>Lanjut</button>
        ) : (
          <div style={styles.helpButtonsContainer}>
            <button onClick={on5050} disabled={hasUsed5050 || isAdLoading} style={styles.helpButton}>
              50:50 (Iklan)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// Styling khusus untuk komponen ini
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
    helpButtonsContainer: { display: 'flex', gap: '10px', marginTop: '20px' },
    helpButton: { flex: 1, padding: '12px', fontSize: '14px', border: 'none', borderRadius: '8px', background: '#6c757d', color: 'white', cursor: 'pointer' },
    correctAnswer: { background: '#28a745', color: 'white', borderColor: '#28a745' },
    wrongAnswer: { background: '#dc3545', color: 'white', borderColor: '#dc3545' },
};
