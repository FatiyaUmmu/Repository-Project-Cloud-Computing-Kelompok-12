
## 📊 Status Implementasi

### ✅ Minggu 1: Perencanaan & Arsitektur
- [x] Perancangan arsitektur cloud
- [x] Pemilihan layanan GCP
- [x] Desain database schema
- [x] Security planning

### ✅ Minggu 2: Implementasi Infrastruktur Dasar
- [x] VPC Network configuration
- [x] Firewall rules (least privilege)
- [x] 2 Compute Engine instances (e2-medium)
- [x] IAM roles & service accounts
- [x] SSH key pair setup

### ✅ Minggu 3: Implementasi Layanan Cloud
- [x] **Cloud SQL Instance** (MySQL 8.4, Enterprise Plus)
  - Public IP: 34.101.210.122
  - High Availability enabled
  - Automated backups & point-in-time recovery
  
- [x] **Cloud Storage Bucket** (cfs-bucket-kelompok12)
  - Region: asia-southeast2 (Jakarta)
  - Storage class: Standard
  - Soft delete & versioning enabled
  
- [x] **Cloud CDN Configuration**
  - Origin: cfs-backend-service
  - Cache mode: Cache static content
  
- [x] **Load Balancer Configuration**
  - Global External Application Load Balancer
  - Frontend IP: 8.233.47.193
  - Backend service dengan 2 VM instances
  - Health check: /health endpoint
  
- [x] **Application Deployment**
  - Node.js + Express backend
  - Functional testing (Upload, Download, List, Delete)
  - Health check endpoint implemented

### ✅ Minggu 4: Monitoring, Security & Optimization
- [x] **Cloud Monitoring Dashboard**
  - CPU Utilization: 1.5% - 4% (optimal)
  - Disk Usage: 68.12% - 68.18% (aman)
  - Cloud SQL Connections: 7.6 - 8.4 (stabil)
  - Request Count: Normal fluktuasi
  
- [x] **Alert Rules** (4 policies aktif)
  - High CPU Alert (>80% selama 5 menit)
  - High Disk Usage (>90% selama 5 menit)
  - Uptime Check Alert (failure detection)
  - High Error Rate (>5% selama 5 menit)
  - Notification: Email ke 4 anggota tim
  
- [x] **Security Audit**
  - Security Command Center: 0 temuan aktif
  - Firewall: SSH & MySQL tidak exposed ke public
  - Cloud SQL: Authorized networks = VPC internal only
  - IAM: Least privilege (Storage Admin + SQL Client)
  
- [x] **Backup Configuration**
  - Automated daily backups
  - Point-in-time recovery enabled
  - Retention: 7 hari
  
- [x] **Uptime Check**
  - 6 global regions monitoring
  - Frequency: 60 detik
  - Latency: 747ms (acceptable)

## 🛠️ Layanan GCP yang Digunakan

| Layanan | Spesifikasi | Fungsi |
|---------|-------------|--------|
| **Compute Engine** | 2x e2-medium (2 vCPU, 4 GB RAM) | Backend application servers |
| **Cloud SQL** | MySQL 8.4, db-f1-micro, Enterprise Plus | Metadata database |
| **Cloud Storage** | 500 GB Standard | Object storage untuk files |
| **Cloud Load Balancing** | Global External HTTP(S) LB | Traffic distribution |
| **Cloud CDN** | Enabled | Content caching & delivery |
| **Cloud Monitoring** | Dashboards + Alerts | Performance monitoring |
| **Cloud Logging** | Enabled | Log management |
| **Cloud IAM** | Custom roles | Access control |

## 📈 Testing & Validation

### Functional Testing
- ✅ **Upload File**: Berhasil upload berbagai format (docx, pdf, jpg, png, pptx)
- ✅ **Download File**: Signed URL generation berfungsi
- ✅ **List Files**: Metadata ditampilkan dengan lengkap
- ✅ **Delete File**: Soft delete & hard delete berfungsi
- ✅ **Health Check**: Endpoint /health responsif

### Load Testing
- **Total Requests**: 30 requests
- **Success Rate**: 100% (30/30)
- **Average Response Time**: ~150ms
- **Load Distribution**: 50% VM web-1, 50% VM web-2
- **Status**: ✅ Passed

### Failure Scenarios
- ✅ **VM Failure**: Load Balancer auto-failover berfungsi
- ✅ **Health Check**: Automatic instance removal saat unhealthy

## 👥 Anggota Kelompok 12

| Nama | NIM | Role | Responsibilities |
|------|-----|------|------------------|
| **Agatha Monalisa** | 2330105030008 | Security Engineer | Security audit, IAM policies, firewall configuration |
| **Muhammad Rony Kurniawan** | 2330105030018 | Backend Developer | API development, database integration, cost analysis |
| **Ni Putu Lowryanty** | 2330105030029 | Cloud Architect | Infrastructure design, VPC configuration, architecture documentation |
| **Fatiya Ummu Hanifah Zahra** | 2330205030042 | DevOps Engineer | Deployment, monitoring, alerting, CI/CD, load balancing |

## 🔧 Tech Stack
- **Backend**: Node.js 18.x + Express.js
- **Database**: MySQL 8.4 (Cloud SQL)
- **Storage**: Google Cloud Storage
- **Infrastructure**: Google Cloud Platform
- **Region**: asia-southeast2 (Jakarta)
- **Load Balancer**: Global External Application Load Balancer
- **Monitoring**: Cloud Monitoring + Cloud Logging

## 📊 Cost Analysis (Estimasi Bulanan)
- Compute Engine (2x e2-medium): ~$15-20
- Cloud SQL (db-f1-micro): ~$10-15
- Cloud Storage (500 GB): ~$2-5
- Networking & Load Balancer: ~$1-3
- **Total Estimasi**: ~$28-43/bulan

### Optimasi Biaya
- ✅ CPU usage monitoring (<5% → resize opportunity)
- ✅ Committed use discount planning
- ✅ Cloud Storage lifecycle policies

## 🔐 Security Features
- ✅ Firewall rules: Restricted SSH & MySQL access
- ✅ Service Account: Least privilege principle
- ✅ Cloud SQL: Authorized networks only
- ✅ HTTPS: Encrypted communication
- ✅ Signed URLs: Secure file download
- ✅ Security Command Center: Continuous monitoring

## 📝 API Endpoints
- `GET /health` - Health check endpoint
- `POST /upload` - Upload file (max 10MB)
- `GET /files` - List all files
- `GET /download/:id` - Generate signed URL
- `DELETE /delete/:id` - Delete file

## 📚 Dokumentasi
- [Laporan Lengkap](./Laporan_UAS_CC_Kelompok_12.docx)
- [Implementasi Minggu 3](./implementasi_minggu_3.pdf)
- [Security Audit](./Penjelasan_security_audit.txt)
- [Alerting Configuration](./alerting_configuration.pdf)

## 🚀 Quick Start
```bash
# Clone repository
git clone https://github.com/your-repo/cloud-file-sharing.git

# Install dependencies
cd cloud-filesharing/app
npm install

# Configure environment
cp .env.example .env
# Edit .env dengan konfigurasi GCP Anda

# Start application
npm start

# Access application
# http://localhost:8080
