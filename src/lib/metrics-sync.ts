/**
 * Modul untuk sinkronisasi metrik API dari memory ke database
 * Dijalankan secara berkala untuk memastikan metrik tidak hilang
 */

let syncIntervalId: NodeJS.Timeout | null = null;

/**
 * Memulai sinkronisasi metrik secara berkala
 * @param intervalMinutes Interval waktu dalam menit
 */
export function startMetricsSync(intervalMinutes = 5) {
  if (syncIntervalId) {
    console.log('Metrics sync already running, stopping previous interval');
    stopMetricsSync();
  }

  console.log(`Starting metrics sync with interval of ${intervalMinutes} minutes`);
  
  // Jalankan sinkronisasi pertama setelah 1 menit
  setTimeout(syncMetrics, 60 * 1000);
  
  // Set interval untuk sinkronisasi berkala
  syncIntervalId = setInterval(syncMetrics, intervalMinutes * 60 * 1000);
}

/**
 * Menghentikan sinkronisasi metrik berkala
 */
export function stopMetricsSync() {
  if (syncIntervalId) {
    clearInterval(syncIntervalId);
    syncIntervalId = null;
    console.log('Stopped metrics sync');
  }
}

/**
 * Melakukan sinkronisasi metrik dari memory ke database
 */
async function syncMetrics() {
  try {
    console.log('Running scheduled metrics sync');
    
    // Gunakan fetch API untuk memanggil endpoint sinkronisasi
    // Ini hanya berjalan di server-side
    if (typeof window === 'undefined') {
      // Buat token JWT untuk autentikasi internal
      const jwt = require('jsonwebtoken');
      const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
      
      // Buat token admin khusus untuk sinkronisasi metrik
      const syncToken = jwt.sign(
        { 
          id: 'system', 
          role: 'admin',
          purpose: 'metrics_sync'
        }, 
        JWT_SECRET, 
        { expiresIn: '5m' }
      );
      
      const response = await fetch('http://localhost:3000/api/metrics/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${syncToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Metrics sync failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Metrics sync result:', result);
    }
  } catch (error) {
    console.error('Error in scheduled metrics sync:', error);
  }
}
