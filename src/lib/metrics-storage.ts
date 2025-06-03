import { ApiMetric } from './api-gateway';

// Create a more stable global namespace for metrics storage (fallback)
// This approach is compatible with Edge Runtime
const GLOBAL_METRICS_KEY = '__PROKER_TRACKER_METRICS__';

// Initialize global metrics storage if it doesn't exist (fallback)
function initGlobalMetrics() {
  if (!(globalThis as any)[GLOBAL_METRICS_KEY]) {
    console.log('Initializing global metrics storage (fallback)');
    (globalThis as any)[GLOBAL_METRICS_KEY] = [];
  }
  return (globalThis as any)[GLOBAL_METRICS_KEY];
}

/**
 * Get metrics from database
 * Falls back to memory storage if database is unavailable
 */
export async function getMetrics(limit = 1000): Promise<ApiMetric[]> {
  try {
    // Gunakan API Route untuk mengambil metrik dari database
    // Karena ini dipanggil dari API Route, kita bisa langsung menggunakan import { executeQuery } from './db'
    // di file route.ts, bukan di sini (Edge Runtime)
    
    // Untuk saat ini, kembalikan metrik dari memory sebagai fallback
    return getMetricsFromMemory();
  } catch (error) {
    console.error('Error retrieving metrics:', error);
    return getMetricsFromMemory();
  }
}

/**
 * Add a metric to database via API Route
 * Falls back to memory storage if API call fails
 */
export async function addMetric(metric: ApiMetric): Promise<void> {
  try {
    // Coba simpan metrik melalui API Route yang kompatibel dengan Server Components
    if (typeof window === 'undefined') {
      // Server-side: simpan ke memory dulu, nanti akan disinkronkan ke database
      addMetricToMemory(metric);
      console.log(`Added metric for ${metric.path} to memory (server-side)`);
      
      // Coba kirim ke API endpoint secara asinkron
      try {
        const response = await fetch('/api/metrics/store', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metric),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to store metric: ${response.status}`);
        }
        
        console.log(`Successfully sent metric for ${metric.path} to database via API`);
      } catch (fetchError) {
        console.error('Error sending metric to API:', fetchError);
        // Sudah disimpan ke memory, jadi tidak perlu tindakan tambahan
      }
    } else {
      // Client-side: simpan ke memory saja
      addMetricToMemory(metric);
      console.log(`Added metric for ${metric.path} to memory (client-side)`);
    }
  } catch (error) {
    console.error('Error adding metric:', error);
    // Fallback ke memory storage
    addMetricToMemory(metric);
  }
}

/**
 * Prune old metrics from database
 * @param daysToKeep Number of days of metrics to keep
 */
export async function pruneOldMetrics(daysToKeep = 30): Promise<void> {
  try {
    // Karena ini dipanggil dari API Route, kita bisa langsung menggunakan database
    // di file route.ts, bukan di sini (Edge Runtime)
    console.log(`Requested pruning of metrics older than ${daysToKeep} days`);
    // Tidak ada implementasi di sini, karena akan diimplementasikan di API Route
  } catch (error) {
    console.error('Error pruning old metrics:', error);
  }
}

// FALLBACK MEMORY STORAGE FUNCTIONS
// These are used only if the database is unavailable

/**
 * Get metrics from memory storage (fallback)
 */
function getMetricsFromMemory(): ApiMetric[] {
  const metrics = initGlobalMetrics();
  console.log(`Retrieved ${metrics.length} metrics from memory (fallback)`);
  return [...metrics]; // Return a copy to prevent direct mutation
}

/**
 * Add a metric to memory storage (fallback)
 */
function addMetricToMemory(metric: ApiMetric): void {
  const metrics = initGlobalMetrics();
  metrics.push(metric);
  
  // Explicitly update the global reference to ensure persistence
  (globalThis as any)[GLOBAL_METRICS_KEY] = metrics;
  
  // Limit to 1000 most recent metrics to prevent memory issues
  if (metrics.length > 1000) {
    const limitedMetrics = metrics.slice(-1000);
    (globalThis as any)[GLOBAL_METRICS_KEY] = limitedMetrics;
    console.log(`Limited metrics to ${limitedMetrics.length} entries (fallback)`);
  }
  
  console.log(`Added metric for ${metric.path} to memory (fallback)`);
}

/**
 * Clear all metrics from memory
 */
export function clearMemoryMetrics(): void {
  (globalThis as any)[GLOBAL_METRICS_KEY] = [];
  console.log('Cleared all metrics from memory');
}
