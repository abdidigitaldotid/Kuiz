// types/global.d.ts

/**
 * Deklarasi ini memberitahu TypeScript bahwa akan ada fungsi 'show_9867079'
 * yang tersedia secara global di object 'window'.
 * Ini mencegah error "Cannot find name 'show_9867079'".
 */
declare global {
  interface Window {
    show_9867079: (options?: any) => Promise<void>;
  }
}

// Baris ini penting untuk memastikan file ini diperlakukan sebagai module oleh TypeScript.
export {};
