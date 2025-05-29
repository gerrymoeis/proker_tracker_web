"""
Skrip untuk menjalankan semua pengujian otomatis Proker Tracker.
"""
import os
import sys
import asyncio
import datetime
import subprocess
from pathlib import Path

def jalankan_pengujian():
    """Jalankan semua pengujian otomatis dan buat laporan ringkasan."""
    print("=" * 80)
    print(f"Proker Tracker - Menjalankan Semua Pengujian Otomatis")
    print(f"Tanggal & Waktu: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Pastikan direktori hasil pengujian ada
    os.makedirs("test-results", exist_ok=True)
    os.makedirs("test-results/screenshots", exist_ok=True)
    os.makedirs("test-results/reports", exist_ok=True)
    
    # Daftar skrip pengujian yang akan dijalankan
    skrip_pengujian = [
        "test_login_berhasil.py",
        "test_login_gagal.py",
        "test_register_berhasil.py",
        "test_register_gagal.py",
        "test_tampilan_dashboard.py",
        "test_buat_proker.py",
        "test_buat_tugas.py",
        "test_tambah_anggota.py",
        "test_edit_profil.py",
        "test_ubah_password.py"
    ]
    
    hasil_pengujian = []
    waktu_mulai_total = datetime.datetime.now()
    
    # Jalankan setiap skrip pengujian
    for skrip in skrip_pengujian:
        print(f"\n{'-' * 80}")
        print(f"Menjalankan: {skrip}")
        print(f"{'-' * 80}")
        
        waktu_mulai = datetime.datetime.now()
        
        # Jalankan skrip pengujian sebagai proses terpisah
        try:
            result = subprocess.run(
                [sys.executable, skrip],
                capture_output=True,
                text=True,
                check=False
            )
            
            waktu_selesai = datetime.datetime.now()
            durasi = (waktu_selesai - waktu_mulai).total_seconds()
            
            if result.returncode == 0:
                status = "BERHASIL"
            else:
                status = "GAGAL"
            
            # Simpan hasil pengujian
            hasil_pengujian.append({
                "skrip": skrip,
                "status": status,
                "durasi": durasi,
                "output": result.stdout,
                "error": result.stderr
            })
            
            # Tampilkan output
            print(f"Output:")
            print(result.stdout)
            
            if result.stderr:
                print(f"Error:")
                print(result.stderr)
            
            print(f"Status: {status}")
            print(f"Durasi: {durasi:.2f} detik")
            
        except Exception as e:
            print(f"Error saat menjalankan {skrip}: {e}")
            hasil_pengujian.append({
                "skrip": skrip,
                "status": "ERROR",
                "durasi": 0,
                "output": "",
                "error": str(e)
            })
    
    waktu_selesai_total = datetime.datetime.now()
    durasi_total = (waktu_selesai_total - waktu_mulai_total).total_seconds()
    
    # Buat laporan ringkasan
    buat_laporan_ringkasan(hasil_pengujian, waktu_mulai_total, waktu_selesai_total, durasi_total)


def buat_laporan_ringkasan(hasil_pengujian, waktu_mulai, waktu_selesai, durasi_total):
    """Buat laporan ringkasan HTML untuk semua hasil pengujian."""
    waktu_sekarang = datetime.datetime.now().strftime('%Y%m%d_%H%M%S')
    nama_file = f"test-results/laporan-ringkasan-{waktu_sekarang}.html"
    
    # Hitung statistik
    total_pengujian = len(hasil_pengujian)
    berhasil = sum(1 for hasil in hasil_pengujian if hasil["status"] == "BERHASIL")
    gagal = sum(1 for hasil in hasil_pengujian if hasil["status"] == "GAGAL")
    error = sum(1 for hasil in hasil_pengujian if hasil["status"] == "ERROR")
    
    html_content = f"""
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Laporan Ringkasan Pengujian Proker Tracker</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 20px;
                color: #333;
            }}
            .container {{
                max-width: 1000px;
                margin: 0 auto;
                background: #f9f9f9;
                padding: 20px;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }}
            h1, h2, h3 {{
                color: #2c3e50;
            }}
            .header {{
                margin-bottom: 20px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }}
            .summary {{
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }}
            .summary-item {{
                flex: 1;
                min-width: 200px;
                padding: 15px;
                margin: 5px;
                border-radius: 5px;
                text-align: center;
            }}
            .total {{
                background-color: #e9ecef;
            }}
            .success {{
                background-color: #d4edda;
                color: #155724;
            }}
            .failure {{
                background-color: #f8d7da;
                color: #721c24;
            }}
            .error {{
                background-color: #fff3cd;
                color: #856404;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }}
            th, td {{
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }}
            th {{
                background-color: #f2f2f2;
            }}
            tr:hover {{
                background-color: #f5f5f5;
            }}
            .status-cell {{
                font-weight: bold;
                text-align: center;
            }}
            .status-BERHASIL {{
                color: #155724;
            }}
            .status-GAGAL {{
                color: #721c24;
            }}
            .status-ERROR {{
                color: #856404;
            }}
            .details {{
                margin-top: 10px;
                padding: 10px;
                background-color: #f8f9fa;
                border-radius: 5px;
                white-space: pre-wrap;
                font-family: monospace;
                font-size: 14px;
                max-height: 200px;
                overflow-y: auto;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Laporan Ringkasan Pengujian Proker Tracker</h1>
                <p>
                    <strong>Waktu Mulai:</strong> {waktu_mulai.strftime('%Y-%m-%d %H:%M:%S')}<br>
                    <strong>Waktu Selesai:</strong> {waktu_selesai.strftime('%Y-%m-%d %H:%M:%S')}<br>
                    <strong>Durasi Total:</strong> {durasi_total:.2f} detik
                </p>
            </div>
            
            <h2>Ringkasan</h2>
            <div class="summary">
                <div class="summary-item total">
                    <h3>Total Pengujian</h3>
                    <p>{total_pengujian}</p>
                </div>
                <div class="summary-item success">
                    <h3>Berhasil</h3>
                    <p>{berhasil}</p>
                </div>
                <div class="summary-item failure">
                    <h3>Gagal</h3>
                    <p>{gagal}</p>
                </div>
                <div class="summary-item error">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            </div>
            
            <h2>Detail Hasil Pengujian</h2>
            <table>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Skrip Pengujian</th>
                        <th>Status</th>
                        <th>Durasi (detik)</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
    """
    
    for i, hasil in enumerate(hasil_pengujian, 1):
        html_content += f"""
                    <tr>
                        <td>{i}</td>
                        <td>{hasil['skrip']}</td>
                        <td class="status-cell status-{hasil['status']}">{hasil['status']}</td>
                        <td>{hasil['durasi']:.2f}</td>
                        <td>
                            <details>
                                <summary>Lihat Detail</summary>
                                <div class="details">
                                    <strong>Output:</strong>
                                    {hasil['output']}
                                    
                                    {"<strong>Error:</strong><br>" + hasil['error'] if hasil['error'] else ""}
                                </div>
                            </details>
                        </td>
                    </tr>
        """
    
    html_content += """
                </tbody>
            </table>
            
            <h2>Laporan Detail</h2>
            <p>Laporan detail untuk setiap pengujian tersedia di direktori <code>test-results</code>.</p>
        </div>
    </body>
    </html>
    """
    
    with open(nama_file, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print("\n" + "=" * 80)
    print(f"Laporan ringkasan dibuat: {nama_file}")
    print("=" * 80)
    
    # Buka laporan di browser
    try:
        import webbrowser
        file_url = Path(nama_file).absolute().as_uri()
        webbrowser.open(file_url)
    except Exception as e:
        print(f"Tidak dapat membuka laporan di browser: {e}")


if __name__ == "__main__":
    jalankan_pengujian()
