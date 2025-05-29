-- File 00 (Fixed): Script utama untuk menjalankan semua script secara berurutan
USE proker_tracker_web;

-- Membuat organisasi Himafortic
INSERT INTO organizations (name, description, university, faculty, department, logo)
VALUES (
    'Himafortic', 
    'Himpunan Mahasiswa Manajemen Informatika adalah organisasi mahasiswa yang bergerak dalam pengembangan akademik dan non-akademik mahasiswa program studi D4 Manajemen Informatika.',
    'Universitas Negeri Surabaya',
    'Fakultas Vokasi',
    'D4 Manajemen Informatika',
    NULL
);

-- Mendapatkan ID organisasi yang baru dibuat
SET @organization_id = LAST_INSERT_ID();

-- Membuat departemen-departemen dalam organisasi (termasuk Penristek)
INSERT INTO departments (organization_id, name, description) VALUES
(@organization_id, 'Badan Pengurus Harian', 'Departemen yang bertanggung jawab atas keseluruhan organisasi'),
(@organization_id, 'Departemen Akademik', 'Departemen yang bertanggung jawab atas kegiatan akademik'),
(@organization_id, 'Departemen Humas', 'Departemen yang bertanggung jawab atas hubungan masyarakat'),
(@organization_id, 'Departemen Minat & Bakat', 'Departemen yang bertanggung jawab atas pengembangan minat dan bakat'),
(@organization_id, 'Departemen Kewirausahaan', 'Departemen yang bertanggung jawab atas kegiatan kewirausahaan'),
(@organization_id, 'Departemen Penristek', 'Departemen yang bertanggung jawab atas penelitian dan teknologi');

-- Mendapatkan ID departemen
SET @bph_id = (SELECT id FROM departments WHERE name = 'Badan Pengurus Harian' AND organization_id = @organization_id);
SET @akademik_id = (SELECT id FROM departments WHERE name = 'Departemen Akademik' AND organization_id = @organization_id);
SET @humas_id = (SELECT id FROM departments WHERE name = 'Departemen Humas' AND organization_id = @organization_id);
SET @minat_bakat_id = (SELECT id FROM departments WHERE name = 'Departemen Minat & Bakat' AND organization_id = @organization_id);
SET @kewirausahaan_id = (SELECT id FROM departments WHERE name = 'Departemen Kewirausahaan' AND organization_id = @organization_id);
SET @penristek_id = (SELECT id FROM departments WHERE name = 'Departemen Penristek' AND organization_id = @organization_id);

-- 1. Ketua, Wakil, Sekretaris, Bendahara (BPH)
INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Tegar Pambudi El Akhsan', '23091397101@student.unesa.ac.id', '23091397101', 'Himafortic', 'ketua', NULL);
SET @ketua_id = LAST_INSERT_ID();

INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Ahmad Diky Setiawan', '23091397102@student.unesa.ac.id', '23091397102', 'Himafortic', 'wakil_ketua', NULL);
SET @wakil_id = LAST_INSERT_ID();

INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Alya Fadhilah Putri', '23091397153@student.unesa.ac.id', '23091397153', 'Himafortic', 'sekretaris', NULL);
SET @sekretaris_id = LAST_INSERT_ID();

INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Norma Ardhita Vidyiawati', '23091397169@student.unesa.ac.id', '23091397169', 'Himafortic', 'bendahara', NULL);
SET @bendahara_id = LAST_INSERT_ID();

-- 2. Kepala Departemen
-- Gerry sebagai Kepala Departemen Penristek
INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Gerry Moeis Mahardika Dwi Putra', '23091397164@student.unesa.ac.id', '23091397164', 'Himafortic', 'kepala_departemen', NULL);
SET @kadep_penristek_id = LAST_INSERT_ID();

INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Daniel Satria Putra Raja Bakti', '23091397143@student.unesa.ac.id', '23091397143', 'Himafortic', 'kepala_departemen', NULL);
SET @kadep_akademik_id = LAST_INSERT_ID();

INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Farras Asyam Haqiqi', '23091397141@student.unesa.ac.id', '23091397141', 'Himafortic', 'kepala_departemen', NULL);
SET @kadep_humas_id = LAST_INSERT_ID();

INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Roland Savitar Herdiansyah', '23091397145@student.unesa.ac.id', '23091397145', 'Himafortic', 'kepala_departemen', NULL);
SET @kadep_minatbakat_id = LAST_INSERT_ID();

INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Fauza Ahmad Zaidan', '23091397144@student.unesa.ac.id', '23091397144', 'Himafortic', 'kepala_departemen', NULL);
SET @kadep_kewirausahaan_id = LAST_INSERT_ID();

-- Update departemen dengan kepala departemen
UPDATE departments SET head_id = @ketua_id WHERE id = @bph_id;
UPDATE departments SET head_id = @kadep_akademik_id WHERE id = @akademik_id;
UPDATE departments SET head_id = @kadep_humas_id WHERE id = @humas_id;
UPDATE departments SET head_id = @kadep_minatbakat_id WHERE id = @minat_bakat_id;
UPDATE departments SET head_id = @kadep_kewirausahaan_id WHERE id = @kewirausahaan_id;
UPDATE departments SET head_id = @kadep_penristek_id WHERE id = @penristek_id;

-- Menambahkan anggota BPH ke organization_members
INSERT INTO organization_members (organization_id, user_id, department_id, role)
VALUES
(@organization_id, @ketua_id, @bph_id, 'ketua'),
(@organization_id, @wakil_id, @bph_id, 'wakil_ketua'),
(@organization_id, @sekretaris_id, @bph_id, 'sekretaris'),
(@organization_id, @bendahara_id, @bph_id, 'bendahara');

-- Menambahkan kepala departemen ke organization_members
INSERT INTO organization_members (organization_id, user_id, department_id, role)
VALUES
(@organization_id, @kadep_akademik_id, @akademik_id, 'kepala_departemen'),
(@organization_id, @kadep_humas_id, @humas_id, 'kepala_departemen'),
(@organization_id, @kadep_minatbakat_id, @minat_bakat_id, 'kepala_departemen'),
(@organization_id, @kadep_kewirausahaan_id, @kewirausahaan_id, 'kepala_departemen'),
(@organization_id, @kadep_penristek_id, @penristek_id, 'kepala_departemen');

-- Departemen Penristek
INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Ronald Budi Abdul Wahid', '23091397142@student.unesa.ac.id', '23091397142', 'Himafortic', 'anggota', NULL),
('Achmad Syamsudin', '23091397146@student.unesa.ac.id', '23091397146', 'Himafortic', 'anggota', NULL),
('Muhammad Faiz Noer Rizky', '23091397147@student.unesa.ac.id', '23091397147', 'Himafortic', 'anggota', NULL);

SET @anggota_penristek1_id = (SELECT id FROM users WHERE email = '23091397142@student.unesa.ac.id');
SET @anggota_penristek2_id = (SELECT id FROM users WHERE email = '23091397146@student.unesa.ac.id');
SET @anggota_penristek3_id = (SELECT id FROM users WHERE email = '23091397147@student.unesa.ac.id');

INSERT INTO organization_members (organization_id, user_id, department_id, role)
VALUES
(@organization_id, @anggota_penristek1_id, @penristek_id, 'staff_departemen'),
(@organization_id, @anggota_penristek2_id, @penristek_id, 'staff_departemen'),
(@organization_id, @anggota_penristek3_id, @penristek_id, 'staff_departemen');

-- Departemen Akademik
INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Sekar Hanuman Astasya Karyanto', '23091397148@student.unesa.ac.id', '23091397148', 'Himafortic', 'anggota', NULL);

SET @anggota_akademik1_id = (SELECT id FROM users WHERE email = '23091397148@student.unesa.ac.id');

INSERT INTO organization_members (organization_id, user_id, department_id, role)
VALUES
(@organization_id, @anggota_akademik1_id, @akademik_id, 'staff_departemen');

-- Departemen Humas
INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Zaki Fikri Ardiansyah', '23091397149@student.unesa.ac.id', '23091397149', 'Himafortic', 'anggota', NULL),
('Ahmad Afredo Farikhas Fiya', '23091397150@student.unesa.ac.id', '23091397150', 'Himafortic', 'anggota', NULL),
('Ahmad Aryo Bimo', '23091397151@student.unesa.ac.id', '23091397151', 'Himafortic', 'anggota', NULL);

SET @anggota_humas1_id = (SELECT id FROM users WHERE email = '23091397149@student.unesa.ac.id');
SET @anggota_humas2_id = (SELECT id FROM users WHERE email = '23091397150@student.unesa.ac.id');
SET @anggota_humas3_id = (SELECT id FROM users WHERE email = '23091397151@student.unesa.ac.id');

INSERT INTO organization_members (organization_id, user_id, department_id, role)
VALUES
(@organization_id, @anggota_humas1_id, @humas_id, 'staff_departemen'),
(@organization_id, @anggota_humas2_id, @humas_id, 'staff_departemen'),
(@organization_id, @anggota_humas3_id, @humas_id, 'staff_departemen');

-- Departemen Minat & Bakat
INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Alvina Fitria Putri', '23091397152@student.unesa.ac.id', '23091397152', 'Himafortic', 'anggota', NULL),
('Anindita Ayuningtyas', '23091397154@student.unesa.ac.id', '23091397154', 'Himafortic', 'anggota', NULL),
('Aqilah Nur Azizah', '23091397155@student.unesa.ac.id', '23091397155', 'Himafortic', 'anggota', NULL);

SET @anggota_minatbakat1_id = (SELECT id FROM users WHERE email = '23091397152@student.unesa.ac.id');
SET @anggota_minatbakat2_id = (SELECT id FROM users WHERE email = '23091397154@student.unesa.ac.id');
SET @anggota_minatbakat3_id = (SELECT id FROM users WHERE email = '23091397155@student.unesa.ac.id');

INSERT INTO organization_members (organization_id, user_id, department_id, role)
VALUES
(@organization_id, @anggota_minatbakat1_id, @minat_bakat_id, 'staff_departemen'),
(@organization_id, @anggota_minatbakat2_id, @minat_bakat_id, 'staff_departemen'),
(@organization_id, @anggota_minatbakat3_id, @minat_bakat_id, 'staff_departemen');

-- Departemen Kewirausahaan
INSERT INTO users (name, email, password, organization_name, role, profile_image)
VALUES 
('Arini Putri Maharani', '23091397156@student.unesa.ac.id', '23091397156', 'Himafortic', 'anggota', NULL),
('Arum Kusumawati', '23091397157@student.unesa.ac.id', '23091397157', 'Himafortic', 'anggota', NULL),
('Aulia Salsabila', '23091397158@student.unesa.ac.id', '23091397158', 'Himafortic', 'anggota', NULL);

SET @anggota_kewirausahaan1_id = (SELECT id FROM users WHERE email = '23091397156@student.unesa.ac.id');
SET @anggota_kewirausahaan2_id = (SELECT id FROM users WHERE email = '23091397157@student.unesa.ac.id');
SET @anggota_kewirausahaan3_id = (SELECT id FROM users WHERE email = '23091397158@student.unesa.ac.id');


-- File 00 (Fixed Part 2): Script utama untuk menjalankan semua script secara berurutan
USE proker_tracker_web;

-- Membuat program kerja untuk setiap departemen (FIXED: menggunakan status yang sesuai dengan skema)
-- BPH
INSERT INTO programs (organization_id, department_id, name, description, status, start_date, end_date, pic_id)
VALUES
(@organization_id, @bph_id, 'Rapat Kerja Tahunan', 'Rapat kerja untuk merencanakan program kerja selama satu tahun ke depan', 'dalam_progres', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), @ketua_id),
(@organization_id, @bph_id, 'Musyawarah Anggota', 'Musyawarah untuk evaluasi kinerja dan pemilihan pengurus baru', 'belum_dimulai', 
 DATE_ADD(CURDATE(), INTERVAL 90 DAY), DATE_ADD(CURDATE(), INTERVAL 92 DAY), @ketua_id);

-- Departemen Akademik
INSERT INTO programs (organization_id, department_id, name, description, status, start_date, end_date, pic_id)
VALUES
(@organization_id, @akademik_id, 'Workshop Pemrograman Web', 'Workshop untuk meningkatkan kemampuan pemrograman web mahasiswa', 'dalam_progres', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY), @kadep_akademik_id),
(@organization_id, @akademik_id, 'Seminar Teknologi Informasi', 'Seminar tentang perkembangan teknologi informasi terkini', 'belum_dimulai', 
 DATE_ADD(CURDATE(), INTERVAL 45 DAY), DATE_ADD(CURDATE(), INTERVAL 45 DAY), @kadep_akademik_id);

-- Departemen Humas
INSERT INTO programs (organization_id, department_id, name, description, status, start_date, end_date, pic_id)
VALUES
(@organization_id, @humas_id, 'Kunjungan Industri', 'Kunjungan ke perusahaan teknologi untuk menambah wawasan mahasiswa', 'belum_dimulai', 
 DATE_ADD(CURDATE(), INTERVAL 60 DAY), DATE_ADD(CURDATE(), INTERVAL 62 DAY), @kadep_humas_id),
(@organization_id, @humas_id, 'Kolaborasi Antar Himpunan', 'Kegiatan kolaborasi dengan himpunan mahasiswa dari universitas lain', 'dalam_progres', 
 DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 20 DAY), @kadep_humas_id);

-- Departemen Minat & Bakat
INSERT INTO programs (organization_id, department_id, name, description, status, start_date, end_date, pic_id)
VALUES
(@organization_id, @minat_bakat_id, 'Kompetisi Programming', 'Kompetisi pemrograman untuk mahasiswa D4 Manajemen Informatika', 'belum_dimulai', 
 DATE_ADD(CURDATE(), INTERVAL 30 DAY), DATE_ADD(CURDATE(), INTERVAL 32 DAY), @kadep_minatbakat_id),
(@organization_id, @minat_bakat_id, 'Pelatihan Soft Skills', 'Pelatihan untuk meningkatkan soft skills mahasiswa', 'dalam_progres', 
 CURDATE(), DATE_ADD(CURDATE(), INTERVAL 21 DAY), @kadep_minatbakat_id);

-- Departemen Kewirausahaan
INSERT INTO programs (organization_id, department_id, name, description, status, start_date, end_date, pic_id)
VALUES
(@organization_id, @kewirausahaan_id, 'Bazar Kewirausahaan', 'Bazar untuk menjual produk hasil karya mahasiswa', 'belum_dimulai', 
 DATE_ADD(CURDATE(), INTERVAL 75 DAY), DATE_ADD(CURDATE(), INTERVAL 77 DAY), @kadep_kewirausahaan_id),
(@organization_id, @kewirausahaan_id, 'Workshop Digital Marketing', 'Workshop tentang strategi pemasaran digital', 'dalam_progres', 
 DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 10 DAY), @kadep_kewirausahaan_id);

-- Departemen Penristek (Baru)
INSERT INTO programs (organization_id, department_id, name, description, status, start_date, end_date, pic_id)
VALUES
(@organization_id, @penristek_id, 'Riset Teknologi AI', 'Penelitian tentang penerapan AI dalam kehidupan sehari-hari', 'dalam_progres', 
 DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 45 DAY), @kadep_penristek_id),
(@organization_id, @penristek_id, 'Hackathon Inovasi', 'Kompetisi pengembangan aplikasi inovatif', 'belum_dimulai', 
 DATE_ADD(CURDATE(), INTERVAL 50 DAY), DATE_ADD(CURDATE(), INTERVAL 52 DAY), @kadep_penristek_id);


-- File 00 (Fixed Part 3): Script utama untuk menjalankan semua script secara berurutan
USE proker_tracker_web;

-- Mendapatkan ID program
SET @raker_id = (SELECT id FROM programs WHERE name = 'Rapat Kerja Tahunan' AND department_id = @bph_id);
SET @musang_id = (SELECT id FROM programs WHERE name = 'Musyawarah Anggota' AND department_id = @bph_id);
SET @workshop_web_id = (SELECT id FROM programs WHERE name = 'Workshop Pemrograman Web' AND department_id = @akademik_id);
SET @seminar_ti_id = (SELECT id FROM programs WHERE name = 'Seminar Teknologi Informasi' AND department_id = @akademik_id);
SET @kunjungan_id = (SELECT id FROM programs WHERE name = 'Kunjungan Industri' AND department_id = @humas_id);
SET @kolaborasi_id = (SELECT id FROM programs WHERE name = 'Kolaborasi Antar Himpunan' AND department_id = @humas_id);
SET @kompetisi_id = (SELECT id FROM programs WHERE name = 'Kompetisi Programming' AND department_id = @minat_bakat_id);
SET @pelatihan_id = (SELECT id FROM programs WHERE name = 'Pelatihan Soft Skills' AND department_id = @minat_bakat_id);
SET @bazar_id = (SELECT id FROM programs WHERE name = 'Bazar Kewirausahaan' AND department_id = @kewirausahaan_id);
SET @workshop_marketing_id = (SELECT id FROM programs WHERE name = 'Workshop Digital Marketing' AND department_id = @kewirausahaan_id);
SET @riset_ai_id = (SELECT id FROM programs WHERE name = 'Riset Teknologi AI' AND department_id = @penristek_id);
SET @hackathon_id = (SELECT id FROM programs WHERE name = 'Hackathon Inovasi' AND department_id = @penristek_id);

-- Milestone untuk Rapat Kerja Tahunan
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@raker_id, 'Persiapan Rapat', 'Menyiapkan materi dan tempat rapat', 'selesai', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(@raker_id, 'Pelaksanaan Rapat Hari 1', 'Pembukaan dan pemaparan visi misi', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(@raker_id, 'Pelaksanaan Rapat Hari 2', 'Pembahasan program kerja departemen', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 16 DAY)),
(@raker_id, 'Finalisasi Hasil Rapat', 'Menyusun laporan hasil rapat', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 30 DAY));

-- Milestone untuk Musyawarah Anggota
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@musang_id, 'Persiapan Musyawarah', 'Menyiapkan materi dan tempat musyawarah', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 85 DAY)),
(@musang_id, 'Pelaksanaan Musyawarah', 'Evaluasi kinerja dan pemilihan pengurus baru', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 91 DAY)),
(@musang_id, 'Pengumuman Hasil', 'Mengumumkan hasil pemilihan pengurus baru', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 92 DAY));

-- Milestone untuk Workshop Pemrograman Web
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@workshop_web_id, 'Persiapan Materi', 'Menyiapkan materi workshop', 'selesai', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@workshop_web_id, 'Pendaftaran Peserta', 'Membuka pendaftaran untuk peserta workshop', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(@workshop_web_id, 'Pelaksanaan Workshop', 'Melaksanakan workshop pemrograman web', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 14 DAY));

-- Milestone untuk Seminar Teknologi Informasi
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@seminar_ti_id, 'Pencarian Pembicara', 'Mencari dan menghubungi pembicara untuk seminar', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 20 DAY)),
(@seminar_ti_id, 'Persiapan Tempat', 'Menyiapkan tempat pelaksanaan seminar', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 40 DAY)),
(@seminar_ti_id, 'Pelaksanaan Seminar', 'Melaksanakan seminar teknologi informasi', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 45 DAY));


-- File 00 (Fixed Part 4): Script utama untuk menjalankan semua script secara berurutan
USE proker_tracker_web;

-- Milestone untuk Kunjungan Industri
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@kunjungan_id, 'Koordinasi dengan Perusahaan', 'Menghubungi dan berkoordinasi dengan perusahaan tujuan', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 40 DAY)),
(@kunjungan_id, 'Pendaftaran Peserta', 'Membuka pendaftaran untuk peserta kunjungan', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 50 DAY)),
(@kunjungan_id, 'Pelaksanaan Kunjungan', 'Melaksanakan kunjungan ke perusahaan', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 61 DAY));

-- Milestone untuk Kolaborasi Antar Himpunan
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@kolaborasi_id, 'Koordinasi Awal', 'Menghubungi dan berkoordinasi dengan himpunan lain', 'selesai', DATE_SUB(CURDATE(), INTERVAL 8 DAY)),
(@kolaborasi_id, 'Persiapan Kegiatan', 'Menyiapkan kegiatan kolaborasi', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 5 DAY)),
(@kolaborasi_id, 'Pelaksanaan Kegiatan', 'Melaksanakan kegiatan kolaborasi', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(@kolaborasi_id, 'Evaluasi Kegiatan', 'Mengevaluasi hasil kegiatan kolaborasi', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 20 DAY));

-- Milestone untuk Kompetisi Programming
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@kompetisi_id, 'Persiapan Soal', 'Menyiapkan soal untuk kompetisi', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(@kompetisi_id, 'Pendaftaran Peserta', 'Membuka pendaftaran untuk peserta kompetisi', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 25 DAY)),
(@kompetisi_id, 'Pelaksanaan Kompetisi', 'Melaksanakan kompetisi programming', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 31 DAY)),
(@kompetisi_id, 'Pengumuman Pemenang', 'Mengumumkan pemenang kompetisi', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 32 DAY));

-- Milestone untuk Pelatihan Soft Skills
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@pelatihan_id, 'Persiapan Materi', 'Menyiapkan materi pelatihan', 'selesai', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@pelatihan_id, 'Pendaftaran Peserta', 'Membuka pendaftaran untuk peserta pelatihan', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(@pelatihan_id, 'Sesi Pelatihan 1', 'Melaksanakan sesi pelatihan pertama', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(@pelatihan_id, 'Sesi Pelatihan 2', 'Melaksanakan sesi pelatihan kedua', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 21 DAY));

-- File 00 (Fixed Part 5): Script utama untuk menjalankan semua script secara berurutan
USE proker_tracker_web;

-- Milestone untuk Bazar Kewirausahaan
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@bazar_id, 'Persiapan Tempat', 'Menyiapkan tempat pelaksanaan bazar', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 65 DAY)),
(@bazar_id, 'Pendaftaran Peserta', 'Membuka pendaftaran untuk peserta bazar', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 70 DAY)),
(@bazar_id, 'Pelaksanaan Bazar', 'Melaksanakan bazar kewirausahaan', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 76 DAY)),
(@bazar_id, 'Evaluasi Kegiatan', 'Mengevaluasi hasil kegiatan bazar', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 77 DAY));

-- Milestone untuk Workshop Digital Marketing
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@workshop_marketing_id, 'Persiapan Materi', 'Menyiapkan materi workshop', 'selesai', DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@workshop_marketing_id, 'Pendaftaran Peserta', 'Membuka pendaftaran untuk peserta workshop', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 2 DAY)),
(@workshop_marketing_id, 'Pelaksanaan Workshop', 'Melaksanakan workshop digital marketing', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 10 DAY));

-- Milestone untuk Riset Teknologi AI
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@riset_ai_id, 'Studi Literatur', 'Mengumpulkan dan mempelajari literatur terkait AI', 'selesai', DATE_SUB(CURDATE(), INTERVAL 10 DAY)),
(@riset_ai_id, 'Pengembangan Prototype', 'Mengembangkan prototype aplikasi berbasis AI', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 15 DAY)),
(@riset_ai_id, 'Pengujian Aplikasi', 'Melakukan pengujian pada aplikasi yang dikembangkan', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
(@riset_ai_id, 'Publikasi Hasil', 'Mempublikasikan hasil penelitian', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 45 DAY));

-- Milestone untuk Hackathon Inovasi
INSERT INTO milestones (program_id, name, description, status, due_date)
VALUES
(@hackathon_id, 'Persiapan Materi', 'Menyiapkan materi dan aturan hackathon', 'dalam_progres', DATE_ADD(CURDATE(), INTERVAL 20 DAY)),
(@hackathon_id, 'Pendaftaran Peserta', 'Membuka pendaftaran untuk peserta hackathon', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 40 DAY)),
(@hackathon_id, 'Pelaksanaan Hackathon', 'Melaksanakan hackathon selama 2 hari', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 51 DAY)),
(@hackathon_id, 'Pengumuman Pemenang', 'Mengumumkan pemenang hackathon', 'belum_dimulai', DATE_ADD(CURDATE(), INTERVAL 52 DAY));
