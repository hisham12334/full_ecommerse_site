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
      
      const query = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role";
      const values = [name, email, hashedPassword];

      const result = await this.db.query(query, values);
      const newUser = result.rows[0];

      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({
        success: true,
        user: newUser,
        token
      });

    } catch (error) {
        if (error.code === '23505') { // Unique constraint violation for PostgreSQL
            return res.status(400).json({ error: 'Email already exists' });
        }
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
  }

  // User login
  async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await this.db.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        // Return user data without the password hash
        const { password: _, ...userResponse } = user;

        res.json({
            success: true,
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
  }

  // Google OAuth authentication
  async googleAuth(req, res) {
    const { credential, name, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    try {
      // Check if user already exists
      const existingUserResult = await this.db.query("SELECT * FROM users WHERE email = $1", [email]);
      let user = existingUserResult.rows[0];

      if (user) {
        // User exists, log them in
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        
        const { password: _, ...userResponse } = user;

        return res.json({
          success: true,
          user: userResponse,
          token
        });
      } else {
        // Create new user with Google account
        const query = "INSERT INTO users (name, email, password, google_id) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role";
        // Use a random password hash for Google users (they won't use it)
        const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
        const values = [name, email, randomPassword, credential];

        const result = await this.db.query(query, values);
        const newUser = result.rows[0];

        const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
        
        return res.status(201).json({
          success: true,
          user: newUser,
          token
        });
      }
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ error: 'Server error during Google authentication' });
    }
  }
}

module.exports = AuthController;