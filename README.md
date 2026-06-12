# Cloud File Sharing System — Kelompok 12

Sistem file sharing berbasis Google Cloud Platform (GCP) yang memungkinkan
pengguna upload, download, dan berbagi file melalui antarmuka web.

## Arsitektur Singkat
User → Cloud CDN → Compute Engine → Cloud Storage / Cloud SQL.
Semua komponen dipantau oleh Cloud Monitoring & Cloud Logging.

## Layanan GCP yang Digunakan
1. Compute Engine (VM e2-medium) — server aplikasi backend.
2. Cloud Storage (500 GB Standard) — penyimpanan file.
3. Cloud SQL (db-f1-micro MySQL) — metadata file.
4. Cloud CDN — distribusi konten statis.
5. Cloud Monitoring + Cloud Logging — observabilitas.
6. Cloud IAM — manajemen akses.

  ## Anggota Kelompok 12
1. Agatha Monalisa — NIM: 2330105030008 — Role: Security Engineer.
2. Muhammad Rony Kurniawan — NIM: 2330105030018 — Role: Backend Developer.
3. Ni Putu Lowryanty — NIM: 2330105030029 — Role: Cloud Architect.
4. Fatiya Ummu Hanifah Zahra — NIM: 2330205030042 — Role: DevOps Engineer.

## Platform Cloud
Google Cloud Platform (GCP) — Region: asia-southeast2 (Jakarta).

### Yang Telah Diimplementasikan
- [x] VPC dengan subnet publik & privat
- [x] Security Groups (prinsip least privilege)
- [x] 2 compute instances (via bastion)
- [x] IAM roles, policies, service accounts
- [x] SSH key pair untuk akses aman
- [x] Infrastructure as Code (Terraform)

## Minggu Saat Ini
Minggu 1 — Perencanaan & Arsitektur.

Minggu 2 — Implementasi Infrastruktur Dasar.

### Minggu 3: Implementasi Layanan & Load Balancing
-  **Cloud SQL Instance**: `filesharing-db` (MySQL 8.4 Enterprise Plus), Public IP: `34.101.210.122`, High Availability & automated backup enabled.
-  **Cloud Storage Bucket**: `cfs-bucket-kelompok12` (Standard class, Not public, Soft delete & versioning enabled) dengan folder `uploads/` untuk menyimpan file.
-  **Cloud CDN**: Origin `cfs-backend-service` dengan cache mode `Cache static content` terintegrasi ke Load Balancer untuk distribusi konten cepat.
-  **Load Balancer**: `cfs-load-balancer` (Global External HTTP), Frontend IP: `8.233.47.193`, mendistribusikan traffic ke 2 VM backend dengan balancing mode utilization (80%).
-  **Health Check Endpoint**: `/health` (port 8080) mengembalikan JSON status, hostname, uptime, & timestamp untuk routing otomatis LB.
-  **Functional Testing**: Upload, List, Delete, & Health check via curl/PowerShell — semua endpoint merespons `200 OK` dengan struktur JSON valid.

### Minggu 4: Monitoring, Security & Optimization
-  **Alert Rules (4 Policies)**: High CPU (>80%), High Disk (>90%), Uptime Failure, & High Error Rate. Notifikasi email aktif ke seluruh anggota tim.
-  **Backup & Recovery**: Cloud SQL automated daily backup, Point-in-Time Recovery (PITR) enabled, retention period 7 hari.
-  **Monitoring Dashboard**: 4 widget utama real-time (CPU: 1.5–4%, Disk: ~68%, SQL Connections: 7.6–8.4, Request Count: normal/fluktuatif).
-  **Security Audit**: Security Command Center = **0 temuan aktif**. Firewall & Cloud SQL dibatasi hanya ke VPC/internal IP. IAM menerapkan prinsip *least privilege* (Storage Admin + SQL Client).
-  **Uptime Check**: Monitoring global (6 regions) ke `8.233.47.193:80/health` setiap 60 detik (latency rata-rata: ~747ms, status passing).
-  **Cost Analysis & Optimization**: Estimasi ~$28–43/bulan. Optimasi biaya via resize VM (CPU usage <5%), planned committed use discount, & Cloud Storage lifecycle policies.

### 🚀 Final Output & Deployment Status
- **Live Demo**: [http://8.233.47.193](http://8.233.47.193)
- **Architecture Status**: ✅ Production Ready
- **High Availability**: Load Balancer aktif mendistribusikan traffic ke 2 VM. Failover testing berhasil (sistem tetap accessible saat 1 VM down).
- **Security Posture**: Hardened (Firewall restricted, DB internal-only, IAM least privilege, SCC clean audit).
- **Testing Coverage**: Functional tests (100% pass), Load test (30 req, ~150ms avg, 50/50 distribution), Failure scenarios (VM down & storage validation handled).
- **Documentation**: Laporan UAS, arsitektur diagram, testing report, security audit, & konfigurasi monitoring tersedia di repository ini.
