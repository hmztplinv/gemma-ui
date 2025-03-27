import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchQuizResultById } from '../api/quizApi';
import { Award, CheckCircle, XCircle, BarChart2, ChevronLeft, Bookmark, RefreshCw } from 'lucide-react';
import '../styles/QuizResultPage.css';

const QuizResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const loadQuizResult = async () => {
      try {
        setLoading(true);
        const data = await fetchQuizResultById(id);
        setResult(data);
        setLoading(false);
      } catch (err) {
        setError('Error loading quiz result. Please try again later.');
        setLoading(false);
      }
    };

    loadQuizResult();
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good job!';
    if (score >= 40) return 'Not bad!';
    return 'Keep practicing!';
  };
  
  const getProgressTips = (score) => {
    if (score >= 80) return 'You are ready to move to the next level!';
    if (score >= 60) return 'You can practice more to reinforce your correct answers.';
    return 'We recommend studying the words you answered incorrectly.';
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTakeNewQuiz = () => {
    navigate('/quiz');
  };

  const handleStudyMistakes = () => {
    // To be implemented in the future
    alert("This feature is still in development.");
  };

  const handleViewHistory = () => {
    navigate('/quiz/history');
  };

  if (loading) {
    return <div className="loading">Loading result...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={handleGoToDashboard}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="error-container">
        <div className="info-message">Quiz result not found. It may have been deleted or is unavailable.</div>
        <button className="back-button" onClick={handleGoToDashboard}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Quiz Results</h1>
      
      {/* Score indicator */}
      <div className={`p-8 rounded-lg text-center mb-6 ${getScoreColor(result.score)}`}>
        <div className="relative">
          <div className="flex justify-center mb-4">
            <Award size={48} />
          </div>
          <div className="text-6xl font-bold mb-2">{result.score}%</div>
          <div className="text-xl">{getScoreText(result.score)}</div>
        </div>
      </div>
      
      {/* Quiz information */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-gray-600">Quiz:</div>
          <div className="font-medium text-right">{result.quizTitle}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-gray-600">Level:</div>
          <div className="font-medium text-right">{result.quizLevel}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="text-gray-600">Correct Answers:</div>
          <div className="font-medium text-right">{result.correctAnswers} / {result.totalQuestions}</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-gray-600">Completed:</div>
          <div className="font-medium text-right">{new Date(result.completedAt).toLocaleString()}</div>
        </div>
      </div>
      
      {/* Progress tips */}
      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <BarChart2 size={20} />
          </div>
          <div className="ml-3">
            <h3 className="font-medium">Progress Tip</h3>
            <p className="mt-1 text-sm">{getProgressTips(result.score)}</p>
          </div>
        </div>
      </div>
      
      {/* Detailed results dropdown */}
      <div className="mb-6">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
        >
          <span className="font-medium">Detailed Results</span>
          <span>{showDetails ? '▲' : '▼'}</span>
        </button>
        
        {showDetails && result.answers && result.answers.length > 0 && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            {result.answers.map((answer, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-start">
                  {answer.isCorrect ? 
                    <CheckCircle className="flex-shrink-0 text-green-500 mr-2" size={20} /> : 
                    <XCircle className="flex-shrink-0 text-red-500 mr-2" size={20} />
                  }
                  <div>
                    <p className="font-medium">{answer.question}</p>
                    <p className={`text-sm mt-1 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      Your answer: {answer.userAnswer}
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-sm mt-1 text-gray-600">
                        Correct answer: {answer.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetails && (!result.answers || result.answers.length === 0) && (
          <div className="mt-4 bg-gray-50 rounded-lg p-4 text-center text-gray-500">
            Detailed answer information is not available for this quiz.
          </div>
        )}
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
        <button 
          onClick={handleGoToDashboard}
          className="flex items-center justify-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <ChevronLeft size={18} className="mr-1" />
          Back to Dashboard
        </button>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleViewHistory}
            className="flex items-center justify-center py-2 px-4 bg-purple-500 text-white hover:bg-purple-600 rounded-lg"
          >
            <BarChart2 size={18} className="mr-1" />
            Quiz History
          </button>
          
          <button 
            onClick={handleStudyMistakes}
            className="flex items-center justify-center py-2 px-4 bg-amber-500 text-white hover:bg-amber-600 rounded-lg"
          >
            <Bookmark size={18} className="mr-1" />
            Study Mistakes
          </button>
          
          <button 
            onClick={handleTakeNewQuiz}
            className="flex items-center justify-center py-2 px-4 bg-blue-500 text-white hover:bg-blue-600 rounded-lg"
          >
            <RefreshCw size={18} className="mr-1" />
            Take New Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResultPage;