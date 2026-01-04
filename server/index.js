const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const shortid = require('shortid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// Initialize database
const adapter = new JSONFile(process.env.DB_FILE || './db.json');
const defaultData = { users: [], attempts: [], questions: [] };
const db = new Low(adapter, defaultData);

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Seed data on startup
const seedDatabase = async () => {
  await db.read();
  
  const users = db.data.users;
  
  // Create admin user if not exists
  const adminExists = users.some(user => user.email === 'admin@prepper.test');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('Password123!', 10);
    db.data.users.push({
      id: shortid.generate(),
      name: 'Admin User',
      email: 'admin@prepper.test',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    await db.write();
    console.log('✅ Admin user created: admin@prepper.test / Password123!');
  }

  // Seed quiz questions if empty
  if (db.data.questions.length === 0) {
    const quizQuestions = require('./data/questions.json');
    db.data.questions = quizQuestions;
    await db.write();
    console.log('✅ Quiz questions seeded');
  }
};

// Routes

// Auth Routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    await db.read();

    // Check if user already exists
    const existingUser = db.data.users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = {
      id: shortid.generate(),
      name,
      email,
      password: hashedPassword,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    db.data.users.push(user);
    await db.write();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    await db.read();

    // Find user
    const user = db.data.users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/auth/me', authenticateToken, async (req, res) => {
  await db.read();
  const user = db.data.users.find(user => user.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// Quiz Routes
app.get('/quiz/questions', async (req, res) => {
  await db.read();
  const questions = db.data.questions;
  res.json(questions);
});

app.post('/quiz/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }

    // TODO: Replace this stub scoring logic with real Gemini AI integration
    // Example Gemini prompt would be:
    // "Based on these quiz answers, recommend a career path with confidence score and reasoning:
    // ${JSON.stringify(answers, null, 2)}
    // 
    // Return format: { careerPath, confidenceScore, explanation, strengths, roadmap }"
    
    // Simple stub scoring logic based on answer patterns
    const score = answers.reduce((acc, answer) => {
      // Simple scoring: higher scores for certain answer patterns
      const scoreMap = {
        'A': 3, 'B': 2, 'C': 1, 'D': 2
      };
      return acc + (scoreMap[answer.answer] || 1);
    }, 0);

    const careerPaths = [
      {
        careerPath: 'Software Development',
        confidenceScore: Math.min(95, Math.max(60, score * 2)),
        explanation: 'Based on your analytical thinking, problem-solving skills, and preference for logical challenges, software development appears to be an excellent career match.',
        strengths: [
          'Strong analytical and logical thinking skills',
          'Excellent problem-solving abilities',
          'Preference for structured and organized work',
          'Interest in technology and innovation'
        ],
        roadmap: [
          'Learn programming fundamentals (JavaScript, Python)',
          'Build portfolio projects',
          'Consider computer science degree or bootcamp',
          'Network with developers and join communities'
        ]
      },
      {
        careerPath: 'Data Science',
        confidenceScore: Math.min(90, Math.max(55, score * 1.8)),
        explanation: 'Your responses indicate strong aptitude for data analysis, statistical thinking, and pattern recognition.',
        strengths: [
          'Strong analytical and statistical skills',
          'Attention to detail and accuracy',
          'Interest in discovering insights from data',
          'Logical reasoning abilities'
        ],
        roadmap: [
          'Learn statistics and probability',
          'Master data analysis tools (Python, R, SQL)',
          'Study machine learning concepts',
          'Work on real-world datasets'
        ]
      },
      {
        careerPath: 'Product Management',
        confidenceScore: Math.min(85, Math.max(50, score * 1.5)),
        explanation: 'Your combination of analytical thinking and communication skills suggests strong potential in product management.',
        strengths: [
          'Good communication and interpersonal skills',
          'Strategic thinking and planning abilities',
          'Understanding of user needs and market trends',
          'Leadership and coordination skills'
        ],
        roadmap: [
          'Learn product management frameworks',
          'Develop business acumen',
          'Practice user research and analysis',
          'Build cross-functional collaboration skills'
        ]
      }
    ];

    // Select best career path based on confidence score
    const recommendedCareer = careerPaths.reduce((best, current) => 
      current.confidenceScore > best.confidenceScore ? current : best
    );

    // Store attempt
    const attempt = {
      id: shortid.generate(),
      userId: req.user.id,
      answers,
      result: recommendedCareer,
      completedAt: new Date().toISOString()
    };

    await db.read();
    db.data.attempts.push(attempt);
    await db.write();

    res.json({
      success: true,
      result: recommendedCareer,
      attemptId: attempt.id
    });

  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Routes
app.get('/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await db.read();
    const totalUsers = db.data.users.length;
    const totalAttempts = db.data.attempts.length;
    const recentAttempts = db.data.attempts
      .filter(attempt => attempt.userId === req.user.id)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 5);

    res.json({
      totalUsers,
      totalAttempts,
      recentAttempts,
      adminUser: {
        id: req.user.id,
        email: req.user.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  seedDatabase();
});

module.exports = app;
