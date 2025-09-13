// app/components/FinishedScreen.tsx
"use client";

interface FinishedScreenProps {
  score: number;
  lives: number;
  playerName: string;
  isSubmitting: boolean;
  hasSubmitted: boolean;
  isAdLoading: boolean;
  onPlayerNameChange: (name: string) => void;
  onSubmitScore: () => void;
  onWatchAdForLife: () => void;
  onResetQuiz: () => void;
  onShareScore: () => void;
}

export function FinishedScreen({
  score,
  lives,
  playerName,
  isSubmitting,
  hasSubmitted,
  isAdLoading,
  onPlayerNameChange,
  onSubmitScore,
  onWatchAdForLife,
  onResetQuiz,
  onShareScore,
}: FinishedScreenProps) {
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
              onChange={(e) => onPlayerNameChange(e.target.value)}
              style={styles.input}
              maxLength={15}
            />
            <button onClick={onSubmitScore} disabled={isSubmitting} style={styles.primaryButton}>
              {isSubmitting ? 'Mengirim...' : 'Kirim Skor'}
            </button>
          </div>
        )}
        {hasSubmitted && <p style={{color: 'green'}}>Skor berhasil dikirim!</p>}
        
        {score > 0 && 
          <div style={{ margin: '10px 0' }}>
             <button onClick={onShareScore} style={{...styles.primaryButton, background: '#17A2B8', width: '100%'}}>📲 Bagikan Skor</button>
          </div>
        }

        {lives <= 0 && !hasSubmitted && (
          <div style={{ margin: '10px 0' }}>
            <button onClick={onWatchAdForLife} disabled={isAdLoading} style={{...styles.primaryButton, background: '#28a745'}}>
              {isAdLoading ? 'Memuat...' : '❤️ Tonton Iklan (+1 Nyawa)'}
            </button>
          </div>
        )}
        
        <button onClick={onResetQuiz} style={{...styles.secondaryButton, width: '100%', background: '#6c757d', marginTop: '10px'}}>
          Kembali ke Menu Utama
        </button>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px', textAlign: 'center' },
  primaryButton: { width: '100%', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  secondaryButton: { padding: '12px', fontSize: '14px', border: '1px solid #6c757d', borderRadius: '8px', background: 'transparent', color: '#6c757d', cursor: 'pointer' },
  finalScore: { fontSize: '24px', fontWeight: 'bold', margin: '20px 0' },
  submitForm: { display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' },
  input: { padding: '12px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '8px' },
};
