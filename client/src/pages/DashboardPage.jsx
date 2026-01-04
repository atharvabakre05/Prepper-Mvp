import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizStatus, setQuizStatus] = useState('not_attempted');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
        
        // TODO: Check if user has completed quiz
        // For now, we'll assume they haven't taken it yet
        setQuizStatus('not_attempted');
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Redirect to login if token is invalid
        navigate('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Prepper</h1>
              <span className="ml-2 text-sm text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button 
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-lg text-gray-600">
            Track your career discovery journey and access your personalized recommendations.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Quiz</h3>
            <p className="text-gray-600 mb-4">Take or retake the career assessment</p>
            <Link to="/quiz">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Start Quiz →
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Your Results</h3>
            <p className="text-gray-600 mb-4">View your career recommendations</p>
            {quizStatus === 'completed' ? (
              <Link to="/result">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  View Results →
                </button>
              </Link>
            ) : (
              <button className="text-gray-400 font-medium cursor-not-allowed">
                Complete Quiz First
              </button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Progress</h3>
            <p className="text-gray-600 mb-4">Track your assessment progress</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              View Progress →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Manage your account preferences</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              Settings →
            </button>
          </div>
        </div>

        {/* Quiz Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Quiz Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">
                {quizStatus === 'completed' 
                  ? 'You have completed the career assessment quiz!'
                  : 'You haven\'t taken the career assessment quiz yet.'
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {quizStatus === 'completed' 
                  ? 'View your results below or retake the quiz for updated recommendations.'
                  : 'Take the quiz to discover your ideal career path.'
                }
              </p>
            </div>
            <Link to="/quiz">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {quizStatus === 'completed' ? 'Retake Quiz' : 'Start Quiz'}
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">Welcome to Prepper!</p>
              </div>
              <span className="text-sm text-gray-500">Today</span>
            </div>
            {quizStatus === 'completed' && (
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Career Assessment Completed</p>
                  <p className="text-sm text-gray-600">You completed the full career quiz</p>
                </div>
                <span className="text-sm text-gray-500">Recently</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
