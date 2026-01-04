import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/quiz/questions');
        setQuestions(response.data);
        // Initialize answers array
        setAnswers(new Array(response.data.length).fill(null));
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answerId) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      qId: questions[currentQuestion].id,
      answer: answerId
    };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = answers.filter(answer => answer === null).length;
    if (unansweredQuestions > 0) {
      alert(`Please answer all ${unansweredQuestions} remaining questions before submitting.`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/quiz/submit', { answers });
      // Store result data for the result page
      localStorage.setItem('quizResult', JSON.stringify(response.data));
      navigate('/result');
    } catch (error) {
      console.error('Failed to submit quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No quiz questions available.</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Prepper</h1>
              <span className="ml-2 text-sm text-gray-500">Career Assessment Quiz</span>
            </div>
            <div className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-center">
            {Math.round(progress)}% Complete
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {question.text}
            </h2>

            {/* Answer Options */}
            <div className="space-y-4">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  onClick={() => handleAnswer(option.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    answers[currentQuestion]?.answer === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      answers[currentQuestion]?.answer === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion]?.answer === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {/* Quick Navigation */}
              {Array.from({ length: Math.min(5, questions.length) }, (_, i) => {
                const questionNumber = Math.max(0, currentQuestion - 2) + i;
                if (questionNumber >= questions.length) return null;
                
                return (
                  <button
                    key={questionNumber}
                    onClick={() => setCurrentQuestion(questionNumber)}
                    className={`w-8 h-8 rounded-full text-sm ${
                      questionNumber === currentQuestion
                        ? 'bg-blue-600 text-white'
                        : answers[questionNumber]
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : 'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {questionNumber + 1}
                  </button>
                );
              })}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting || answers[currentQuestion] === null}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === null}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            )}
          </div>

          {/* Answered Questions Summary */}
          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Answered: {answers.filter(a => a !== null).length} / {questions.length}</span>
              <span>Remaining: {answers.filter(a => a === null).length}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizPage;
