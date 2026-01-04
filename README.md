# Prepper - Career Discovery Quest

A fullstack MVP for career assessment and recommendations powered by AI. Users take a comprehensive quiz to discover their ideal career path with personalized recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation & Setup

1. **Install dependencies for both frontend and backend:**
```bash
npm run install-all
```

2. **Start the development servers:**
```bash
npm run dev
```

This will start both servers concurrently:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Admin Access
Use these credentials to access the admin panel:
- **Email:** admin@prepper.test
- **Password:** Password123!

## 📁 Project Structure

```
prepper-mvp/
├── server/                 # Express.js Backend API
│   ├── index.js           # Main server file
│   ├── data/              # Quiz questions data
│   ├── package.json       # Backend dependencies
│   └── .env.example       # Environment variables template
├── client/                # React Vite Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── lib/           # API utilities
│   │   └── App.jsx        # Main app with routing
│   ├── package.json       # Frontend dependencies
│   └── tailwind.config.js # Tailwind CSS configuration
├── package.json           # Root package with scripts
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **LowDB** - File-based JSON database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 19** + **Vite** - Frontend framework and build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework

## 📋 Features

### User Features
- ✅ User registration and login
- ✅ 40-question career assessment quiz
- ✅ Progress tracking during quiz
- ✅ Personalized career recommendations
- ✅ Confidence scoring
- ✅ Educational roadmap suggestions
- ✅ Dashboard with quiz history

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ User management overview
- ✅ Quiz attempt tracking
- ✅ Platform usage metrics

### Technical Features
- ✅ JWT-based authentication
- ✅ Protected routes
- ✅ File-based database (no external DB required)
- ✅ Responsive design
- ✅ Error handling and loading states

## 🔧 Development

### Backend Development
```bash
# Start backend only
npm run server

# Or navigate to server directory
cd server
npm run dev
```

### Frontend Development
```bash
# Start frontend only
npm run client

# Or navigate to client directory
cd client
npm run dev
```

### Environment Variables
Create `.env` file in the `server/` directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DB_FILE=./db.json
```

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user profile

### Quiz
- `GET /quiz/questions` - Get all quiz questions
- `POST /quiz/submit` - Submit quiz answers and get results

### Admin
- `GET /admin/stats` - Get platform statistics (admin only)

## 🎯 Quiz System

The quiz consists of 40 carefully designed questions covering:
- Work environment preferences
- Problem-solving approaches
- Technology interests
- Learning styles
- Career motivations
- And more...

### Scoring Logic
Currently uses a simple scoring algorithm that assigns weights to different answer patterns. 

**Future Enhancement:** Replace with Gemini AI integration for more sophisticated analysis.

### AI Integration (TODO)
In `server/index.js`, the `/quiz/submit` endpoint includes a TODO for Gemini API integration:

```javascript
// TODO: Replace this stub scoring logic with real Gemini AI integration
// Example Gemini prompt would be:
// "Based on these quiz answers, recommend a career path with confidence score and reasoning:
// ${JSON.stringify(answers, null, 2)}
// 
// Return format: { careerPath, confidenceScore, explanation, strengths, roadmap }"
```

## 🔐 Authentication

- JWT-based authentication with 7-day expiration
- Password hashing with bcryptjs
- Protected routes with middleware
- Role-based access control (user/admin)

## 📱 Frontend Routes

### Public Routes
- `/` - Landing page
- `/auth/login` - User login
- `/auth/signup` - User registration

### Protected Routes
- `/dashboard` - User dashboard
- `/quiz` - Career assessment quiz
- `/result` - Quiz results

### Admin Routes
- `/admin` - Admin dashboard (admin only)

## 🎨 UI Components

### Reusable Components
- `Navbar` - Navigation header
- `Footer` - Page footer
- `ProtectedRoute` - Authentication wrapper
- `AdminRoute` - Admin access wrapper

### Pages
- `LandingPage` - Marketing landing page
- `LoginPage` / `SignupPage` - Authentication forms
- `DashboardPage` - User dashboard
- `QuizPage` - Interactive quiz interface
- `ResultPage` - Career recommendations display
- `AdminPage` - Admin statistics dashboard

## 🔧 Customization

### Adding Quiz Questions
Edit `server/data/questions.json` to modify or add quiz questions:

```json
{
  "id": 1,
  "text": "What type of work environment do you prefer?",
  "type": "single",
  "options": [
    { "id": "A", "text": "Option A" },
    { "id": "B", "text": "Option B" }
  ]
}
```

### Modifying Career Paths
Update the career recommendation logic in `server/index.js` in the `/quiz/submit` endpoint.

### Styling
The frontend uses Tailwind CSS. Modify `tailwind.config.js` for custom themes.

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start backend in production mode
cd ../server
npm start
```

### Environment Setup
- Set production JWT_SECRET
- Configure production database
- Set up HTTPS for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3000 and 5000 are available
2. **CORS errors**: Backend must be running on port 5000
3. **Authentication errors**: Check JWT_SECRET in .env file
4. **Database issues**: Ensure server has write permissions for db.json

### Development Tips
- Use browser dev tools to inspect API calls
- Check console for authentication errors
- Verify .env file is properly configured
- Ensure both servers are running concurrently

## 🔄 Future Enhancements

- [ ] Gemini AI integration for career analysis
- [ ] Email notifications
- [ ] User profile management
- [ ] Advanced analytics dashboard
- [ ] Social login integration
- [ ] Mobile app development
- [ ] Real-time collaboration features
- [ ] Advanced career path matching

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Create an issue on GitHub
4. Contact the development team

---

**Built with ❤️ for career discovery and professional growth**
