// app/components/LeaderboardScreen.tsx
"use client";

interface LeaderboardEntry {
  name: string;
  score: number;
}

interface LeaderboardScreenProps {
  isLoading: boolean;
  leaderboardData: LeaderboardEntry[];
  onBack: () => void;
}

export function LeaderboardScreen({ isLoading, leaderboardData, onBack }: LeaderboardScreenProps) {
  return (
    <main style={styles.container}>
      <div style={styles.quizCard}>
        <h1>🏆 Papan Peringkat 🏆</h1>
        {isLoading ? <p>Memuat data...</p> : (
          <ol style={styles.leaderboardList}>
            {leaderboardData.length > 0 ? leaderboardData.map((entry, index) => (
              <li key={index} style={styles.leaderboardItem}>
                <span>{index + 1}. {entry.name}</span>
                <span style={styles.score}>{entry.score} Poin</span>
              </li>
            )) : <p>Belum ada skor. Jadilah yang pertama!</p>}
          </ol>
        )}
        <button onClick={onBack} style={{...styles.primaryButton, marginTop: '20px'}}>Kembali</button>
      </div>
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f2f5', fontFamily: 'sans-serif' },
  quizCard: { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '90%', maxWidth: '500px', textAlign: 'center' },
  primaryButton: { width: '100%', padding: '15px', fontSize: '18px', border: 'none', borderRadius: '8px', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  leaderboardList: { listStyle: 'none', padding: 0, textAlign: 'left' },
  leaderboardItem: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' },
  score: { fontWeight: 'bold' },
};
