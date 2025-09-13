// app/quizData.ts

// Tipe data untuk sebuah pertanyaan
export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Tipe data untuk semua data kuis
export interface QuizData {
  [category: string]: {
    [difficulty: string]: Question[];
  };
}

// Objek untuk menyimpan poin per level
export const pointsPerDifficulty: { [key: string]: number } = {
  mudah: 2,
  normal: 5,
  susah: 10,
};

// Data utama kuis yang sudah terstruktur
export const allQuizData: QuizData = {
  "Pengetahuan Umum": {
    mudah: [
      { question: "Apa warna bendera Indonesia?", options: ["Merah-Putih", "Putih-Merah", "Biru-Putih", "Merah-Kuning"], correctAnswer: "Merah-Putih" },
      { question: "Berapa jumlah provinsi di Indonesia saat ini (2025)?", options: ["34", "36", "38", "40"], correctAnswer: "38" },
    ],
    normal: [
      { question: "Apa nama candi Buddha terbesar di dunia yang ada di Indonesia?", options: ["Prambanan", "Borobudur", "Mendut", "Pawon"], correctAnswer: "Borobudur" },
      { question: "Gunung tertinggi di Indonesia adalah...", options: ["Gunung Semeru", "Gunung Rinjani", "Puncak Jaya", "Gunung Kerinci"], correctAnswer: "Puncak Jaya" },
    ],
    susah: [
      { question: "Siapakah pahlawan yang dijuluki 'Ayam Jantan dari Timur'?", options: ["Pangeran Diponegoro", "Sultan Hasanuddin", "Tuanku Imam Bonjol", "Pattimura"], correctAnswer: "Sultan Hasanuddin" },
      { question: "Pada tahun berapa Sumpah Pemuda diikrarkan?", options: ["1926", "1928", "1930", "1945"], correctAnswer: "1928" },
    ],
  },
  "Sains & Teknologi": {
    mudah: [
      { question: "Apa rumus kimia untuk air?", options: ["O2", "CO2", "H2O", "NaCl"], correctAnswer: "H2O" },
      { question: "Planet terdekat dengan Matahari adalah...", options: ["Venus", "Mars", "Merkurius", "Bumi"], correctAnswer: "Merkurius" },
    ],
    normal: [
      { question: "Siapakah penemu bola lampu?", options: ["Albert Einstein", "Isaac Newton", "Alexander Graham Bell", "Thomas Edison"], correctAnswer: "Thomas Edison" },
      { question: "Proses tumbuhan membuat makanannya sendiri disebut...", options: ["Respirasi", "Fotosintesis", "Evaporasi", "Metamorfosis"], correctAnswer: "Fotosintesis" },
    ],
    susah: [
      { question: "Apa kepanjangan dari 'LASER'?", options: ["Light Amplification by Stimulated Emission of Radiation", "Light Absorption by Spontaneous Emitting Radiation", "Light Amplification by Sound Emission of Radiation", "Light Alteration by Stimulated Emission of Rays"], correctAnswer: "Light Amplification by Stimulated Emission of Radiation" },
      { question: "Unsur apa yang paling melimpah di alam semesta?", options: ["Oksigen", "Karbon", "Hidrogen", "Helium"], correctAnswer: "Hidrogen" },
    ],
  },
};
