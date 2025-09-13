// app/components/QuizScreen.tsx
'use client';

import { Question } from '../quizData';

interface QuizScreenProps {
  question: Question;
  onAnswerSelect: (answer: string) => void;
  score: number;
  lives: number;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  showFeedback: boolean;
}

export function QuizScreen({
  question,
  onAnswerSelect,
  score,
  lives,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  showFeedback,
}: QuizScreenProps) {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span>Skor: {score}</span>
        <span>Nyawa: {'❤️'.repeat(lives)}</span>
      </div>
      <h2>Pertanyaan {questionNumber} dari {totalQuestions}</h2>
      {/* DIUBAH: dari question.questionText menjadi question.question 
        agar cocok dengan struktur data Anda.
      */}
      <p style={{ fontSize: '1.2em', minHeight: '60px' }}>{question.question}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '30px' }}>
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = question.correctAnswer === option;
          
          let backgroundColor = '#f0f0f0'; // Default
          if (showFeedback) {
            if (isCorrect) {
              backgroundColor = '#90EE90'; // Hijau untuk jawaban benar
            } else if (isSelected) {
              backgroundColor = '#F08080'; // Merah untuk jawaban salah yang dipilih
            }
          }

          return (
            <button
              key={option}
              onClick={() => onAnswerSelect(option)}
              disabled={!!selectedAnswer}
              style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', background: backgroundColor, cursor: 'pointer' }}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
