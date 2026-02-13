const express = require('express');
const app = express();
const PORT = 5001;  // Different port

// Middleware
app.use(express.json());

// Simple test routes
app.get('/', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/api/test', (req, res) => {
  res.json({ 
    received: req.body,
    message: 'POST request works!' 
  });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});