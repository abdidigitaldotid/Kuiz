// app/components/SelectionScreen.tsx
"use client";

import { allQuizData, pointsPerDifficulty } from '../quizData';

interface SelectionScreenProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onDifficultySelect: (difficulty: string) => void;
  onShowLeaderboard: () => void;
  onBack: () => void;
}

export function SelectionScreen({
  selectedCategory,
  onCategorySelect,
  onDifficultySelect,
  onShowLeaderboard,
  onBack,
}: SelectionScreenProps) {
  return (
    <main style={styles.container}>
      <div style={styles.quizCard}>
        {!selectedCategory ? (
          <>
            <h1>Pilih Kategori</h1>
            <div style={styles.selectionGrid}>
              {Object.keys(allQuizData).map(category => (
                <button key={category} onClick={() => onCategorySelect(category)} style={styles.primaryButton}>
                  {category}
                </button>
              ))}
            </div>
            <button onClick={onShowLeaderboard} style={{...styles.secondaryButton, marginTop: '20px', width: '100%'}}>🏆 Lihat Papan Peringkat</button>
          </>
        ) : (
          <>
            <h1>Pilih Level: {selectedCategory}</h1>
            <div style={styles.selectionGrid}>
              {Object.keys(allQuizData[selectedCategory]).map(difficulty => (
                <button key={difficulty} onClick={() => onDifficultySelect(difficulty)} style={styles.primaryButton}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} (+{pointsPerDifficulty[difficulty]} Poin)
                </button>
              ))}
            </div>
            <button onClick={onBack} style={{...styles.secondaryButton, marginTop: '20px', width: '100%'}}>Kembali</button>
          </>
        )}
      </div>
    </main>
  );
}

// Anda bisa memindahkan 'styles' ke file terpisah nanti, tapi untuk sekarang kita letakkan di sini.
const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px', textAlign: 'center' },
  primaryButton: { width: '100%', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  secondaryButton: { padding: '12px', fontSize: '14px', border: '1px solid #6c757d', borderRadius: '8px', background: 'transparent', color: '#6c757d', cursor: 'pointer' },
  selectionGrid: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
};
