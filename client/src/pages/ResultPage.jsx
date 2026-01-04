import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get result from localStorage (stored during quiz submission)
    const storedResult = localStorage.getItem('quizResult');
    
    if (!storedResult) {
      // If no result, redirect to dashboard
      navigate('/dashboard');
      return;
    }

    try {
      const parsedResult = JSON.parse(storedResult);
      setResult(parsedResult);
    } catch (error) {
      console.error('Failed to parse result:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getConfidenceColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (score) => {
    if (score >= 80) return 'High Confidence';
    if (score >= 60) return 'Medium Confidence';
    return 'Low Confidence';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Prepper</h1>
              <span className="ml-2 text-sm text-gray-500">Your Career Results</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/dashboard">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                  Back to Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Career Path is Ready!
          </h2>
          <p className="text-lg text-gray-600">
            Based on your quiz responses, we've identified the perfect career match for you
          </p>
        </div>

        {/* Main Result Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl text-blue-600 mb-2">
              {result.result.careerPath}
            </h3>
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-lg font-medium ${getConfidenceColor(result.result.confidenceScore)}`}>
                {getConfidenceLabel(result.result.confidenceScore)}
              </span>
              <span className="text-gray-400">•</span>
              <span className={`text-lg font-bold ${getConfidenceColor(result.result.confidenceScore)}`}>
                {result.result.confidenceScore}%
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Why This Career Matches You</h4>
            <p className="text-gray-600 leading-relaxed">
              {result.result.explanation}
            </p>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Your Key Strengths</h4>
            <ul className="space-y-2">
              {result.result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs mr-3 mt-0.5">
                    ✓
                  </span>
                  <span className="text-gray-600">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Match Confidence</span>
              <span className="text-sm font-bold text-gray-900">{result.result.confidenceScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  result.result.confidenceScore >= 80 ? 'bg-green-500' : 
                  result.result.confidenceScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.result.confidenceScore}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Education Roadmap */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Education Roadmap</h3>
          <div className="space-y-4">
            {result.result.roadmap.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <div>
                  <p className="text-gray-700">{step}</p>
                </div>
              </div>
            ))}
          </div>
          {/* TODO: Display enriched career details from Gemini when available */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This is a basic recommendation. Future versions will include 
              detailed career insights powered by AI analysis.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/quiz">
            <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
              Retake Quiz
            </button>
          </Link>
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Download Results
          </button>
          <Link to="/dashboard">
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Remember, this is a personalized recommendation based on your current preferences and skills.
            Career paths can evolve, and it's always good to keep an open mind to new opportunities.
          </p>
          <p className="text-xs text-gray-500">
            Results generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      </main>
    </div>
  );
};

export default ResultPage;
