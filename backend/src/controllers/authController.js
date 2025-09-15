const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class AuthController {
  constructor(db) {
    this.db = db;
  }

  // User registration
  async register(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      this.db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", 
        [name, email, hashedPassword], 
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(400).json({ error: 'Email already exists' });
            }
            return res.status(500).json({ error: 'Registration failed' });
          }
          
          const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '24h' });
          res.status(201).json({
            success: true,
            user: { id: this.lastID, name, email },
            token
          });
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }

  // User login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    this.db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Server error' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      try {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
          success: true,
          user: { id: user.id, name: user.name, email: user.email, role: user.role },
          token
        });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    });
  }
}

module.exports = AuthController;