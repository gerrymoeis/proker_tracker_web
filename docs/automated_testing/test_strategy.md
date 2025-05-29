# Strategi Testing Proker Tracker dengan Playwright

## Pendekatan Testing

Strategi testing untuk Proker Tracker mengadopsi pendekatan yang komprehensif dan visual untuk memastikan kualitas aplikasi. Dokumen ini menjelaskan strategi yang akan digunakan dalam implementasi automated testing menggunakan Playwright.

## 1. Strategi Visual Testing

Visual testing adalah komponen penting dalam pendekatan testing kita, yang memungkinkan kita untuk memvisualisasikan proses testing dan memberikan feedback yang jelas kepada pengguna.

### 1.1 Highlighting Elemen

Untuk memvisualisasikan elemen yang sedang diuji, kita akan mengimplementasikan:

```typescript
// Fungsi untuk menambahkan highlight pada elemen
async function highlightElement(page, selector) {
  await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (element) {
      // Simpan style asli
      const originalStyle = element.getAttribute('style') || '';
      
      // Tambahkan outline merah
      element.setAttribute('style', `${originalStyle}; outline: 3px solid red; outline-offset: 2px;`);
      
      // Kembalikan style asli setelah 1 detik
      setTimeout(() => {
        element.setAttribute('style', originalStyle);
      }, 1000);
    }
  }, selector);
  
  // Tunggu sebentar agar highlight terlihat
  await page.waitForTimeout(1000);
}
```

### 1.2 Indikator Progress

Untuk menunjukkan kemajuan testing, kita akan menambahkan indikator progress di pojok kanan atas browser:

```typescript
// Fungsi untuk menambahkan indikator progress
async function showProgress(page, step, totalSteps, message) {
  await page.evaluate(({ step, totalSteps, message }) => {
    // Cek apakah indikator sudah ada
    let progressIndicator = document.getElementById('test-progress-indicator');
    
    if (!progressIndicator) {
      // Buat indikator jika belum ada
      progressIndicator = document.createElement('div');
      progressIndicator.id = 'test-progress-indicator';
      progressIndicator.style.position = 'fixed';
      progressIndicator.style.top = '10px';
      progressIndicator.style.right = '10px';
      progressIndicator.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      progressIndicator.style.color = 'white';
      progressIndicator.style.padding = '10px';
      progressIndicator.style.borderRadius = '5px';
      progressIndicator.style.zIndex = '9999';
      progressIndicator.style.fontSize = '14px';
      progressIndicator.style.fontFamily = 'Arial, sans-serif';
      document.body.appendChild(progressIndicator);
    }
    
    // Update konten indikator
    progressIndicator.innerHTML = `
      <div>Test Progress: ${step}/${totalSteps}</div>
      <div style="margin-top: 5px; font-weight: bold;">${message}</div>
      <div style="margin-top: 5px; width: 100%; background-color: #444; height: 5px; border-radius: 3px;">
        <div style="width: ${(step / totalSteps) * 100}%; background-color: #4F46E5; height: 100%; border-radius: 3px;"></div>
      </div>
    `;
  }, { step, totalSteps, message });
}
```

### 1.3 Screenshot Otomatis

Untuk dokumentasi visual, kita akan mengambil screenshot pada langkah-langkah penting:

```typescript
// Fungsi untuk mengambil screenshot dengan label
async function takeScreenshot(page, name) {
  const screenshotPath = `./test-results/screenshots/${name}-${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}
```

## 2. Strategi Reporting

Reporting yang komprehensif dan mudah dibaca adalah kunci untuk memahami hasil testing dengan cepat.

### 2.1 Halaman Hasil Testing

Setelah menjalankan test, kita akan menampilkan halaman hasil testing yang berisi:

```typescript
// Fungsi untuk membuat halaman hasil testing
async function generateTestReport(results) {
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Buat HTML untuk laporan
  const reportHtml = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Laporan Hasil Testing Proker Tracker</title>
      <style>
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f7fa;
        }
        h1, h2, h3 {
          color: #0F52BA;
        }
        .summary {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }
        .summary-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          flex: 1;
        }
        .summary-card h3 {
          margin-top: 0;
        }
        .success { color: #10B981; }
        .failure { color: #EF4444; }
        .skipped { color: #F59E0B; }
        .test-case {
          background: white;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .test-case h3 {
          margin-top: 0;
          display: flex;
          align-items: center;
        }
        .test-case h3::before {
          content: '';
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 10px;
        }
        .test-case.success h3::before { background-color: #10B981; }
        .test-case.failure h3::before { background-color: #EF4444; }
        .test-case.skipped h3::before { background-color: #F59E0B; }
        .steps {
          margin-left: 20px;
        }
        .screenshot {
          max-width: 100%;
          height: auto;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 10px;
        }
        .performance {
          margin-top: 30px;
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <h1>Laporan Hasil Testing Proker Tracker</h1>
      <p>Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Total Test</h3>
          <p style="font-size: 24px; font-weight: bold;">${results.total}</p>
        </div>
        <div class="summary-card">
          <h3>Berhasil</h3>
          <p style="font-size: 24px; font-weight: bold;" class="success">${results.passed}</p>
        </div>
        <div class="summary-card">
          <h3>Gagal</h3>
          <p style="font-size: 24px; font-weight: bold;" class="failure">${results.failed}</p>
        </div>
        <div class="summary-card">
          <h3>Dilewati</h3>
          <p style="font-size: 24px; font-weight: bold;" class="skipped">${results.skipped}</p>
        </div>
      </div>
      
      <h2>Detail Test</h2>
      ${results.tests.map(test => `
        <div class="test-case ${test.status}">
          <h3>${test.name}</h3>
          <p><strong>Status:</strong> ${test.status === 'success' ? 'Berhasil' : test.status === 'failure' ? 'Gagal' : 'Dilewati'}</p>
          <p><strong>Durasi:</strong> ${test.duration}ms</p>
          ${test.error ? `<p><strong>Error:</strong> ${test.error}</p>` : ''}
          
          <h4>Langkah-langkah:</h4>
          <ol class="steps">
            ${test.steps.map(step => `
              <li>${step}</li>
            `).join('')}
          </ol>
          
          ${test.screenshots.length > 0 ? `
            <h4>Screenshots:</h4>
            ${test.screenshots.map(screenshot => `
              <img src="${screenshot}" alt="Screenshot" class="screenshot">
            `).join('')}
          ` : ''}
        </div>
      `).join('')}
      
      <div class="performance">
        <h2>Metrik Performa</h2>
        <p><strong>Waktu Total Eksekusi:</strong> ${results.totalDuration}ms</p>
        <p><strong>Waktu Rata-rata per Test:</strong> ${Math.round(results.totalDuration / results.total)}ms</p>
      </div>
      
      ${results.failed > 0 ? `
        <div class="recommendations">
          <h2>Rekomendasi</h2>
          <ul>
            ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </body>
    </html>
  `;
  
  // Tampilkan laporan di browser
  await page.setContent(reportHtml);
  
  return { page, browser };
}
```

### 2.2 Format JSON untuk Hasil Test

Untuk menyimpan hasil test dalam format yang terstruktur, kita akan menggunakan format JSON:

```typescript
// Contoh struktur data hasil test
const testResults = {
  total: 10,
  passed: 8,
  failed: 1,
  skipped: 1,
  totalDuration: 15000, // dalam milidetik
  tests: [
    {
      name: 'Login dengan kredensial valid',
      status: 'success',
      duration: 1500,
      steps: [
        'Buka halaman login',
        'Masukkan email: user@example.com',
        'Masukkan password: ******',
        'Klik tombol login',
        'Verifikasi redirect ke dashboard'
      ],
      screenshots: ['path/to/screenshot1.png']
    },
    // ... test lainnya
  ],
  recommendations: [
    'Perbaiki validasi form pada halaman registrasi',
    'Tingkatkan performa loading data pada dashboard'
  ]
};
```

## 3. Strategi Eksekusi Test

Untuk memastikan efisiensi dan efektivitas testing, kita akan mengadopsi strategi eksekusi berikut:

### 3.1 Eksekusi Sekuensial

Untuk visualisasi yang jelas, test akan dijalankan secara sekuensial (satu per satu) untuk menghindari interferensi antar test dan memastikan performa yang optimal.

### 3.2 Retry Mechanism

Untuk mengatasi flakiness, kita akan mengimplementasikan mekanisme retry:

```typescript
// Konfigurasi retry
const retryConfig = {
  retries: 2,
  backoff: true
};
```

### 3.3 Timeout yang Konsisten

Untuk memastikan konsistensi, kita akan menggunakan timeout yang seragam:

```typescript
// Konfigurasi timeout
const timeoutConfig = {
  timeout: 30000, // 30 detik
  navigationTimeout: 30000,
  actionTimeout: 15000
};
```

## 4. Integrasi dengan CI/CD

Meskipun fokus utama adalah visualisasi testing, kita juga akan mempersiapkan integrasi dengan CI/CD:

### 4.1 Mode Headless untuk CI

```typescript
// Konfigurasi untuk CI
const ciConfig = {
  headless: true,
  workers: 3,
  reporter: ['html', 'json']
};
```

### 4.2 Artifact Storage

```typescript
// Konfigurasi untuk menyimpan artifact
const artifactConfig = {
  outputDir: './test-results',
  preserveOutput: 'failures-only'
};
```

## Kesimpulan

Strategi testing ini dirancang untuk memberikan visualisasi yang jelas tentang proses testing sambil memastikan kualitas aplikasi Proker Tracker. Dengan pendekatan ini, kita dapat mengidentifikasi masalah dengan cepat, memberikan feedback visual yang jelas, dan menghasilkan laporan yang komprehensif.
