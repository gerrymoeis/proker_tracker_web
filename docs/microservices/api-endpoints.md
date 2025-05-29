# API Endpoints untuk Microservices

Dokumen ini berisi daftar lengkap endpoint API untuk setiap microservice dalam aplikasi Proker Tracker.

## Konvensi API

Semua endpoint API mengikuti konvensi berikut:

- Base URL: `/api/{service-name}/{resource}`
- Format respons: JSON
- Autentikasi: Bearer token dalam header `Authorization`
- Kode status HTTP standar:
  - `200`: Sukses
  - `201`: Berhasil dibuat
  - `400`: Bad request
  - `401`: Tidak terautentikasi
  - `403`: Tidak memiliki izin
  - `404`: Tidak ditemukan
  - `500`: Kesalahan server

## 1. Auth Service

### Base Path: `/api/auth`

| Endpoint | Method | Deskripsi | Request Body | Response |
|----------|--------|-----------|--------------|----------|
| `/login` | POST | Login pengguna | `{ "email": "string", "password": "string" }` | `{ "user": {}, "session": {} }` |
| `/register` | POST | Registrasi pengguna baru | `{ "email": "string", "password": "string", "name": "string", "organization_id": "string" }` | `{ "user": {}, "session": {} }` |
| `/logout` | POST | Logout pengguna | - | `{ "message": "string" }` |
| `/verify` | GET | Verifikasi token | - | `{ "user": {} }` |
| `/refresh` | POST | Refresh token | `{ "refresh_token": "string" }` | `{ "access_token": "string", "refresh_token": "string" }` |
| `/update-profile` | PUT | Update profil pengguna | `{ "name": "string", "email": "string" }` | `{ "user": {} }` |
| `/change-password` | PUT | Ubah password | `{ "current_password": "string", "new_password": "string" }` | `{ "message": "string" }` |
| `/health` | GET | Cek kesehatan service | - | `{ "status": "string", "latency": "string" }` |

## 2. User Service

### Base Path: `/api/users`

| Endpoint | Method | Deskripsi | Request Body | Response |
|----------|--------|-----------|--------------|----------|
| `/` | GET | Daftar pengguna | - | `{ "users": [] }` |
| `/{id}` | GET | Detail pengguna | - | `{ "user": {} }` |
| `/{id}` | PUT | Update pengguna | `{ "name": "string", "role": "string", ... }` | `{ "user": {} }` |
| `/{id}/role` | PUT | Update role pengguna | `{ "role": "string" }` | `{ "user": {} }` |
| `/me` | GET | Profil pengguna saat ini | - | `{ "user": {} }` |
| `/organization/{org_id}` | GET | Daftar pengguna dalam organisasi | - | `{ "users": [] }` |
| `/health` | GET | Cek kesehatan service | - | `{ "status": "string", "latency": "string" }` |

## 3. Organization Service

### Base Path: `/api/organizations`

| Endpoint | Method | Deskripsi | Request Body | Response |
|----------|--------|-----------|--------------|----------|
| `/` | GET | Daftar organisasi | - | `{ "organizations": [] }` |
| `/` | POST | Buat organisasi baru | `{ "name": "string", "description": "string", ... }` | `{ "organization": {} }` |
| `/{id}` | GET | Detail organisasi | - | `{ "organization": {} }` |
| `/{id}` | PUT | Update organisasi | `{ "name": "string", "description": "string", ... }` | `{ "organization": {} }` |
| `/{id}` | DELETE | Hapus organisasi | - | `{ "message": "string" }` |
| `/{id}/members` | GET | Daftar anggota organisasi | - | `{ "members": [] }` |
| `/{id}/departments` | GET | Daftar departemen organisasi | - | `{ "departments": [] }` |
| `/departments` | POST | Buat departemen baru | `{ "name": "string", "organization_id": "string", ... }` | `{ "department": {} }` |
| `/departments/{id}` | GET | Detail departemen | - | `{ "department": {} }` |
| `/departments/{id}` | PUT | Update departemen | `{ "name": "string", "description": "string", ... }` | `{ "department": {} }` |
| `/departments/{id}` | DELETE | Hapus departemen | - | `{ "message": "string" }` |
| `/health` | GET | Cek kesehatan service | - | `{ "status": "string", "latency": "string" }` |

## 4. Program Service

### Base Path: `/api/programs`

| Endpoint | Method | Deskripsi | Request Body | Response |
|----------|--------|-----------|--------------|----------|
| `/` | GET | Daftar program | - | `{ "programs": [] }` |
| `/` | POST | Buat program baru | `{ "name": "string", "description": "string", "start_date": "string", "end_date": "string", ... }` | `{ "program": {} }` |
| `/{id}` | GET | Detail program | - | `{ "program": {} }` |
| `/{id}` | PUT | Update program | `{ "name": "string", "description": "string", ... }` | `{ "program": {} }` |
| `/{id}` | DELETE | Hapus program | - | `{ "message": "string" }` |
| `/{id}/tasks` | GET | Daftar tugas dalam program | - | `{ "tasks": [] }` |
| `/organization/{org_id}` | GET | Daftar program dalam organisasi | - | `{ "programs": [] }` |
| `/department/{dept_id}` | GET | Daftar program dalam departemen | - | `{ "programs": [] }` |
| `/status/{status}` | GET | Daftar program berdasarkan status | - | `{ "programs": [] }` |
| `/search` | GET | Cari program | `{ "query": "string" }` | `{ "programs": [] }` |
| `/health` | GET | Cek kesehatan service | - | `{ "status": "string", "latency": "string" }` |

## 5. Task Service

### Base Path: `/api/tasks`

| Endpoint | Method | Deskripsi | Request Body | Response |
|----------|--------|-----------|--------------|----------|
| `/` | GET | Daftar tugas | - | `{ "tasks": [] }` |
| `/` | POST | Buat tugas baru | `{ "name": "string", "description": "string", "program_id": "string", ... }` | `{ "task": {} }` |
| `/{id}` | GET | Detail tugas | - | `{ "task": {} }` |
| `/{id}` | PUT | Update tugas | `{ "name": "string", "description": "string", ... }` | `{ "task": {} }` |
| `/{id}` | DELETE | Hapus tugas | - | `{ "message": "string" }` |
| `/{id}/status` | PUT | Update status tugas | `{ "status": "string" }` | `{ "task": {} }` |
| `/{id}/assign` | PUT | Assign tugas ke pengguna | `{ "user_id": "string" }` | `{ "task": {} }` |
| `/program/{program_id}` | GET | Daftar tugas dalam program | - | `{ "tasks": [] }` |
| `/user/{user_id}` | GET | Daftar tugas yang ditugaskan ke pengguna | - | `{ "tasks": [] }` |
| `/status/{status}` | GET | Daftar tugas berdasarkan status | - | `{ "tasks": [] }` |
| `/due-date` | GET | Daftar tugas berdasarkan tenggat waktu | `{ "start_date": "string", "end_date": "string" }` | `{ "tasks": [] }` |
| `/health` | GET | Cek kesehatan service | - | `{ "status": "string", "latency": "string" }` |

## 6. API Gateway

### Base Path: `/api`

API Gateway bertindak sebagai proxy untuk semua service. Ini menangani:

1. Autentikasi dan otorisasi
2. Rate limiting
3. Logging
4. Routing ke service yang sesuai

| Endpoint | Method | Deskripsi | Request Body | Response |
|----------|--------|-----------|--------------|----------|
| `/health` | GET | Cek kesehatan semua service | - | `{ "services": { "auth": {}, "users": {}, ... } }` |
| `/metrics` | GET | Metrik API | - | `{ "requests": {}, "latency": {}, ... }` |

## 7. Event Service

### Base Path: `/api/events`

| Endpoint | Method | Deskripsi | Request Body | Response |
|----------|--------|-----------|--------------|----------|
| `/` | GET | Daftar event | - | `{ "events": [] }` |
| `/publish` | POST | Publikasikan event | `{ "event_type": "string", "source_service": "string", "target_service": "string", "payload": {} }` | `{ "event": {} }` |
| `/subscribe` | POST | Subscribe ke event | `{ "event_types": [], "callback_url": "string" }` | `{ "subscription": {} }` |
| `/health` | GET | Cek kesehatan service | - | `{ "status": "string", "latency": "string" }` |

## Format Data

### User

```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "string",
  "organization_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Organization

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "university": "string",
  "faculty": "string",
  "department": "string",
  "logo": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Department

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "organization_id": "uuid",
  "head_id": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Program

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "string",
  "start_date": "date",
  "end_date": "date",
  "budget": "number",
  "department_id": "uuid",
  "pic_id": "uuid",
  "organization_id": "uuid",
  "created_by": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Task

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "status": "string",
  "priority": "string",
  "due_date": "date",
  "program_id": "uuid",
  "assigned_to": "uuid",
  "created_by": "uuid",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Event

```json
{
  "id": "uuid",
  "event_type": "string",
  "source_service": "string",
  "target_service": "string",
  "payload": "object",
  "processed": "boolean",
  "created_at": "timestamp"
}
```

## Contoh Penggunaan API

### Login

```bash
curl -X POST https://proker-tracker.netlify.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Respons:

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Membuat Program Baru

```bash
curl -X POST https://proker-tracker.netlify.app/api/programs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Program Pelatihan Coding",
    "description": "Program pelatihan coding untuk mahasiswa baru",
    "start_date": "2023-08-01",
    "end_date": "2023-12-31",
    "department_id": "550e8400-e29b-41d4-a716-446655440001"
  }'
```

Respons:

```json
{
  "program": {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Program Pelatihan Coding",
    "description": "Program pelatihan coding untuk mahasiswa baru",
    "status": "belum_dimulai",
    "start_date": "2023-08-01",
    "end_date": "2023-12-31",
    "department_id": "550e8400-e29b-41d4-a716-446655440001",
    "organization_id": "550e8400-e29b-41d4-a716-446655440003",
    "created_by": "550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2023-07-15T08:30:00Z",
    "updated_at": "2023-07-15T08:30:00Z"
  }
}
```

## Kode Status dan Penanganan Error

### Kode Status

| Kode | Deskripsi |
|------|-----------|
| 200 | OK - Permintaan berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Parameter tidak valid |
| 401 | Unauthorized - Autentikasi diperlukan |
| 403 | Forbidden - Tidak memiliki izin |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Konflik dengan resource yang ada |
| 422 | Unprocessable Entity - Validasi gagal |
| 429 | Too Many Requests - Rate limit terlampaui |
| 500 | Internal Server Error - Kesalahan server |

### Format Error

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Autentikasi dan Otorisasi

Semua endpoint API (kecuali `/api/auth/login`, `/api/auth/register`, dan endpoint health) memerlukan autentikasi. Autentikasi dilakukan dengan menyertakan token JWT dalam header `Authorization`:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Otorisasi didasarkan pada role pengguna dan hubungan dengan resource. Misalnya, pengguna hanya dapat melihat dan mengedit program dalam organisasi mereka sendiri.

## Rate Limiting

API Gateway menerapkan rate limiting untuk mencegah penyalahgunaan API:

- 100 permintaan per menit untuk pengguna terautentikasi
- 20 permintaan per menit untuk pengguna tidak terautentikasi

Ketika rate limit terlampaui, API akan mengembalikan status kode 429 dengan header `Retry-After`.

## Versioning

Versi API ditentukan dalam header `Accept`:

```
Accept: application/json; version=1.0
```

Jika tidak ada versi yang ditentukan, API akan menggunakan versi terbaru.

## Pagination

Endpoint yang mengembalikan daftar resource mendukung pagination dengan parameter query:

- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10, max: 100)

Respons akan menyertakan metadata pagination:

```json
{
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

## Sorting dan Filtering

Endpoint yang mengembalikan daftar resource mendukung sorting dan filtering dengan parameter query:

- `sort`: Field untuk sorting (e.g., `created_at`)
- `order`: Urutan sorting (`asc` atau `desc`, default: `desc`)
- `filter[field]`: Filter berdasarkan field (e.g., `filter[status]=active`)

## CORS

API mendukung Cross-Origin Resource Sharing (CORS) untuk domain yang diizinkan.
