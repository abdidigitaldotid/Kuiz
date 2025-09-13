// app/components/ResultScreen.tsx
'use client';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export function ResultScreen({ score, totalQuestions, onRestart }: ResultScreenProps) {
  return (
    <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80vh' }}>
      <h1>Kuis Selesai! 🎉</h1>
      <p style={{ fontSize: '1.5em', margin: '20px 0' }}>
        Skor Akhir Anda:
      </p>
      <p style={{ fontSize: '2.5em', fontWeight: 'bold' }}>
        {score}
      </p>
      <p>Dari {totalQuestions} pertanyaan</p>
      <button
        onClick={onRestart}
        style={{ padding: '15px 30px', marginTop: '30px', fontSize: '1em', cursor: 'pointer', borderRadius: '8px', border: 'none', background: '#007bff', color: 'white' }}
      >
        Main Lagi
      </button>
    </div>
  );
}
