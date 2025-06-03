/**
 * Inisialisasi sistem metrik API
 * File ini akan diimpor saat server dimulai untuk memastikan sistem metrik berjalan dengan benar
 */

import { startMetricsSync } from './metrics-sync';

// Cek apakah kode berjalan di server-side
if (typeof window === 'undefined') {
  console.log('Initializing API metrics system...');
  
  // Mulai sinkronisasi metrik setiap 5 menit
  startMetricsSync(5);
  
  console.log('API metrics system initialized');
}

// Export fungsi dummy untuk memastikan file ini tidak dihapus oleh tree-shaking
export const metricsInitialized = true;
