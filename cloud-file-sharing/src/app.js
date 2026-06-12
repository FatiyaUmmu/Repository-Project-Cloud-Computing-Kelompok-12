require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const os = require('os');

const { initializeDatabase, query } = require('./db');
const { uploadToGCS, getSignedUrl, deleteFromGCS } = require('./storage');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer (memory storage untuk upload)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10MB
  },
  fileFilter: (req, file, cb) => {
    // Accept all file types (bisa disesuaikan)
    cb(null, true);
  }
});

// ==================== ENDPOINTS ====================

// 1. HEALTH CHECK (WAJIB untuk Load Balancer!)
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await query('SELECT 1');
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      hostname: os.hostname(),
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// 2. UPLOAD FILE
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: 'Tidak ada file yang diupload' 
      });
    }

    const { originalname, buffer, mimetype, size } = req.file;
    
    // Validasi ukuran file (max 10MB)
    if (size > 10 * 1024 * 1024) {
      return res.status(413).json({
        success: false,
        error: 'Ukuran file melebihi batas maksimal 10MB'
      });
    }

    // Upload ke Cloud Storage
    const { gcsPath, gcsUri } = await uploadToGCS(buffer, originalname, mimetype);
    
    // Generate ID unik
    const fileId = require('uuid').v4();
    
    // Simpan metadata ke Cloud SQL
    await query(
      `INSERT INTO files (id, original_name, gcs_filename, file_size, mime_type) 
       VALUES (?, ?, ?, ?, ?)`,
      [fileId, originalname, gcsPath, size, mimetype]
    );

    console.log(`📁 File uploaded: ${originalname} (${size} bytes)`);

    res.status(201).json({
      success: true,
      message: 'File berhasil diupload',
      data: {
        id: fileId,
        filename: originalname,
        size: size,
        mimeType: mimetype,
        gcsUri: gcsUri,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal upload file: ' + error.message
    });
  }
});

// 3. LIST ALL FILES
app.get('/files', async (req, res) => {
  try {
    const files = await query(
      'SELECT id, original_name, file_size, mime_type, uploaded_at FROM files ORDER BY uploaded_at DESC'
    );

    res.json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('❌ List files error:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal mengambil daftar file: ' + error.message
    });
  }
});

// 4. DOWNLOAD FILE (Generate Signed URL)
app.get('/download/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ambil metadata dari database
    const rows = await query(
      'SELECT original_name, gcs_filename, mime_type FROM files WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File tidak ditemukan'
      });
    }
    
    const file = rows[0];
    
    // Generate signed URL (valid 15 menit)
    const downloadUrl = await getSignedUrl(file.gcs_filename, 15);
    
    res.json({
      success: true,
      data: {
        id: id,
        filename: file.original_name,
        mimeType: file.mime_type,
        downloadUrl: downloadUrl,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString()
      }
    });
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal generate download URL: ' + error.message
    });
  }
});

// 5. DELETE FILE
app.delete('/file/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ambil metadata dari database
    const rows = await query(
      'SELECT gcs_filename FROM files WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'File tidak ditemukan'
      });
    }
    
    const gcsPath = rows[0].gcs_filename;
    
    // Hapus dari Cloud Storage
    await deleteFromGCS(gcsPath);
    
    // Hapus metadata dari database
    await query('DELETE FROM files WHERE id = ?', [id]);
    
    console.log(`🗑️ File deleted: ${id}`);
    
    res.json({
      success: true,
      message: 'File berhasil dihapus'
    });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Gagal menghapus file: ' + error.message
    });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Cloud File Sharing API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      upload: 'POST /upload',
      list: 'GET /files',
      download: 'GET /download/:id',
      delete: 'DELETE /file/:id'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// ==================== START SERVER ====================
async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║   🚀 Cloud File Sharing Server is Running!        ║
╠═══════════════════════════════════════════════════╣
║   Port: ${PORT}                                    
║   Hostname: ${os.hostname()}                       
║   Environment: ${process.env.NODE_ENV || 'development'}                     
║   Time: ${new Date().toISOString()}                
╚═══════════════════════════════════════════════════╝

📍 Available endpoints:
   • GET  /health       - Health check
   • POST /upload       - Upload file
   • GET  /files        - List files
   • GET  /download/:id - Download file
   • DELETE /file/:id   - Delete file
`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();