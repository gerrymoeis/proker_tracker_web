# Proker Tracker Automated Testing

This directory contains automated tests for the Proker Tracker application using Playwright.

## Setup

The tests are set up to run in a Python virtual environment. All dependencies are already installed in the virtual environment.

## Directory Structure

- `fixtures/`: Test data and fixtures
- `pages/`: Page Object Models for application pages
- `specs/`: Test specifications organized by feature
- `utils/`: Utility functions for testing
- `test-results/`: Generated test results (screenshots, reports, etc.)

## Running Tests

Before running tests, make sure:

1. The Proker Tracker application is running locally on http://localhost:3000
2. The virtual environment is activated

### Running All Tests

```bash
# Using the virtual environment Python
.\venv\Scripts\python.exe run_tests.py
```

### Running Specific Tests

```bash
# Run only authentication tests
.\venv\Scripts\python.exe run_tests.py --test specs/auth

# Run a specific test file
.\venv\Scripts\python.exe run_tests.py --test specs/auth/test_login.py
```

### Running Simplified Test Scripts

We've also created simplified standalone test scripts that can be run directly:

```bash
# Run login success test
.\venv\Scripts\python.exe test_login_berhasil.py

# Run login failure test
.\venv\Scripts\python.exe test_login_gagal.py

# Run dashboard test
.\venv\Scripts\python.exe test_dashboard_sederhana.py

# Run add task test
.\venv\Scripts\python.exe test_tambah_proker.py

# Run all simplified tests
.\venv\Scripts\python.exe jalankan_semua_pengujian.py
```

### Headless Mode

By default, tests run with the browser visible (headless=false). To run in headless mode:

```bash
.\venv\Scripts\python.exe run_tests.py --headless
```

## Test Reports

After running tests, reports are generated in the `test-results/reports` directory. Screenshots are saved in `test-results/screenshots`.

## Visual Feedback

The tests include visual feedback:
- Red outlines around elements being interacted with
- Progress indicators showing the current step
- Screenshots captured at key points

## Bahasa Indonesia

Skrip pengujian sederhana (`test_login_berhasil.py`, `test_login_gagal.py`, `test_dashboard_sederhana.py`, dan `test_tambah_proker.py`) menggunakan bahasa Indonesia untuk:
- Komentar dan dokumentasi kode
- Pesan output selama pengujian
- Laporan hasil pengujian
- Nama variabel dan fungsi

Ini sesuai dengan kebutuhan proyek Proker Tracker yang menggunakan bahasa Indonesia sebagai bahasa utama dalam aplikasi.

## Implemented Tests

1. Authentication
   - Login with valid credentials (`test_login_berhasil.py`)
   - Login with invalid password (`test_login_gagal.py`)

2. Dashboard
   - Verify dashboard elements (`test_dashboard_sederhana.py`)

3. Task Management
   - Add new task (`test_tambah_proker.py`)

## Adding New Tests

To add new tests:
1. Create page objects in the `pages/` directory
2. Add test data in the `fixtures/` directory
3. Create test specifications in the `specs/` directory
