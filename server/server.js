const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database setup
const db = new sqlite3.Database('./compliance.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Checklists table
    db.run(`CREATE TABLE IF NOT EXISTS checklists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        status TEXT DEFAULT 'draft',
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id)
    )`);

    // Checklist items table
    db.run(`CREATE TABLE IF NOT EXISTS checklist_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        checklist_id INTEGER NOT NULL,
        item_text TEXT NOT NULL,
        requirement TEXT,
        status TEXT DEFAULT 'pending',
        assignee_id INTEGER,
        due_date DATETIME,
        completed_date DATETIME,
        comments TEXT,
        FOREIGN KEY (checklist_id) REFERENCES checklists(id),
        FOREIGN KEY (assignee_id) REFERENCES users(id)
    )`);

    // Evidence/Attachments table
    db.run(`CREATE TABLE IF NOT EXISTS evidences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_id INTEGER NOT NULL,
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        uploaded_by INTEGER,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (item_id) REFERENCES checklist_items(id),
        FOREIGN KEY (uploaded_by) REFERENCES users(id)
    )`);
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Auth routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword],
            function(err) {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                res.status(201).json({ id: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: 'User not found' });
        
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );
        
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    });
});

// Checklist routes
app.get('/api/checklists', authenticateToken, (req, res) => {
    const { category, status } = req.query;
    let query = 'SELECT * FROM checklists WHERE created_by = ?';
    let params = [req.user.id];
    
    if (category) {
        query += ' AND category = ?';
        params.push(category);
    }
    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }
    
    db.all(query, params, (err, checklists) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(checklists);
    });
});

app.post('/api/checklists', authenticateToken, (req, res) => {
    const { title, description, category, status } = req.body;
    
    db.run(
        'INSERT INTO checklists (title, description, category, status, created_by) VALUES (?, ?, ?, ?, ?)',
        [title, description, category, status || 'draft', req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID });
        }
    );
});

app.get('/api/checklists/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM checklists WHERE id = ? AND created_by = ?', [id, req.user.id], (err, checklist) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!checklist) return res.status(404).json({ error: 'Checklist not found' });
        res.json(checklist);
    });
});

app.put('/api/checklists/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, description, category, status } = req.body;
    
    db.run(
        'UPDATE checklists SET title = ?, description = ?, category = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND created_by = ?',
        [title, description, category, status, id, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

// Checklist items routes
app.get('/api/checklists/:id/items', authenticateToken, (req, res) => {
    const { id } = req.params;
    
    db.all(
        `SELECT ci.*, u.username as assignee_name 
         FROM checklist_items ci 
         LEFT JOIN users u ON ci.assignee_id = u.id 
         WHERE ci.checklist_id = ? 
         AND ci.checklist_id IN (SELECT id FROM checklists WHERE created_by = ?)`,
        [id, req.user.id],
        (err, items) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(items);
        }
    );
});

app.post('/api/checklists/:id/items', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { item_text, requirement, assignee_id, due_date } = req.body;
    
    // Verify checklist belongs to user
    db.get('SELECT id FROM checklists WHERE id = ? AND created_by = ?', [id, req.user.id], (err, checklist) => {
        if (err || !checklist) {
            return res.status(404).json({ error: 'Checklist not found' });
        }
        
        db.run(
            'INSERT INTO checklist_items (checklist_id, item_text, requirement, assignee_id, due_date) VALUES (?, ?, ?, ?, ?)',
            [id, item_text, requirement, assignee_id, due_date],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ id: this.lastID });
            }
        );
    });
});

app.put('/api/items/:itemId', authenticateToken, (req, res) => {
    const { itemId } = req.params;
    const { status, comments, completed_date } = req.body;
    
    db.run(
        'UPDATE checklist_items SET status = ?, comments = ?, completed_date = ? WHERE id = ?',
        [status, comments, completed_date, itemId],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
});

// Dashboard stats
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    const queries = {
        totalChecklists: 'SELECT COUNT(*) as count FROM checklists WHERE created_by = ?',
        completedItems: `SELECT COUNT(*) as count FROM checklist_items ci 
                        JOIN checklists c ON ci.checklist_id = c.id 
                        WHERE c.created_by = ? AND ci.status = 'completed'`,
        pendingItems: `SELECT COUNT(*) as count FROM checklist_items ci 
                      JOIN checklists c ON ci.checklist_id = c.id 
                      WHERE c.created_by = ? AND ci.status = 'pending'`,
        overdueItems: `SELECT COUNT(*) as count FROM checklist_items ci 
                      JOIN checklists c ON ci.checklist_id = c.id 
                      WHERE c.created_by = ? AND ci.status = 'pending' 
                      AND ci.due_date < datetime('now')`
    };
    
    const results = {};
    let completed = 0;
    const totalQueries = Object.keys(queries).length;
    
    Object.keys(queries).forEach((key, index) => {
        db.get(queries[key], [userId], (err, row) => {
            if (err) {
                results[key] = 0;
            } else {
                results[key] = row.count;
            }
            
            completed++;
            if (completed === totalQueries) {
                res.json(results);
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});