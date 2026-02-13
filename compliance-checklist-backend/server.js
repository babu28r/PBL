const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ====== ROUTES ======

// 1. Welcome route
app.get('/', (req, res) => {
  res.json({
    message: '✅ Compliance Checklist API is running!',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login'
      }
    }
  });
});

// 2. Health check - THIS IS WHAT YOU'RE TESTING
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Compliance Checklist API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 3. Simple auth endpoints (for testing)
app.post('/api/auth/register', (req, res) => {
  console.log('Register:', req.body);
  res.json({
    success: true,
    message: 'Registration endpoint works',
    data: req.body
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login:', req.body);
  res.json({
    success: true,
    message: 'Login endpoint works',
    token: 'test-jwt-token-123',
    user: {
      id: 1,
      email: req.body.email
    }
  });
});

// 4. Handle 404 - All other routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`
  });
});

// ====== START SERVER ======
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server started successfully!`);
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🏠 Home: http://localhost:${PORT}/`);
});