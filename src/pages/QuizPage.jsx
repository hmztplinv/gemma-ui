import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuiz, submitQuizAnswers } from '../api/quizApi';
import '../styles/QuizPage.css';
import { Award, CheckCircle, XCircle, BarChart2, ChevronLeft, Bookmark, RefreshCw } from 'lucide-react';

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showResultDetails, setShowResultDetails] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        const quizData = await fetchQuiz({ level: 'B1', quizType: 'Vocabulary' });
        setQuiz(quizData);
        const initialAnswers = {};
        quizData.questions.forEach(question => {
          initialAnswers[question.id] = '';
        });
        setSelectedAnswers(initialAnswers);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while loading the quiz. Please try again later.');
        setLoading(false);
      }
    };

    loadQuiz();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    try {
      const answers = Object.keys(selectedAnswers).map(questionId => ({
        questionId: parseInt(questionId, 10),
        answer: selectedAnswers[questionId]
      }));

      const result = await submitQuizAnswers({
        quizId: quiz.id,
        answers: answers
      });

      const enhancedResult = {
        ...result,
        answers: quiz.questions.map(question => {
          const userAnswer = selectedAnswers[question.id];
          return {
            questionId: question.id,
            question: question.question,
            userAnswer: userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect: userAnswer === question.correctAnswer
          };
        })
      };

      setQuizResult(enhancedResult);
      setShowResults(true);
    } catch (err) {
      setError('An error occurred while submitting the quiz. Please try again.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good job!';
    if (score >= 40) return 'Not bad!';
    return 'You need more practice!';
  };
  
  const getProgressTips = (score) => {
    if (score >= 80) return 'You are ready to move to the next level!';
    if (score >= 60) return 'You can repeat to reinforce your correct answers.';
    return 'We recommend studying the words you answered incorrectly.';
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleTakeNewQuiz = () => {
    window.location.reload();
  };

  const handleStudyMistakes = () => {
    console.log("Study mistakes", quizResult.answers.filter(a => !a.isCorrect));
    alert("This feature is under development.");
  };

  if (loading) {
    return <div className="loading">Preparing Quiz ...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="error-container">
        <div className="info-message">No quiz available right now. Please try again later.</div>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  if (showResults && quizResult) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Quiz Results</h1>
        
        <div className={`p-8 rounded-lg text-center mb-6 ${getScoreColor(quizResult.score)}`}>
          <div className="relative">
            <div className="flex justify-center mb-4">
              <Award size={48} />
            </div>
            <div className="text-6xl font-bold mb-2">{quizResult.score}%</div>
            <div className="text-xl">{getScoreText(quizResult.score)}</div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="text-gray-600">Quiz:</div>
            <div className="font-medium text-right">{quizResult.quizTitle}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="text-gray-600">Level:</div>
            <div className="font-medium text-right">{quizResult.quizLevel}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="text-gray-600">Correct Answers:</div>
            <div className="font-medium text-right">{quizResult.correctAnswers} / {quizResult.totalQuestions}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">Completed:</div>
            <div className="font-medium text-right">{new Date(quizResult.completedAt).toLocaleString('en-US')}</div>
          </div>
        </div>
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <BarChart2 size={20} />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">Progress Tip</h3>
              <p className="mt-1 text-sm">{getProgressTips(quizResult.score)}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <button 
            onClick={() => setShowResultDetails(!showResultDetails)}
            className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg focus:outline-none"
          >
            <span className="font-medium">Detailed Results</span>
            <span>{showResultDetails ? '▲' : '▼'}</span>
          </button>
          
          {showResultDetails && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              {quizResult.answers?.map((answer, index) => (
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
        </div>
        
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
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>{quiz.title || 'Vocabulary Test'}</h1>
        <div className="quiz-subtitle">Level: {quiz.level} | Question {currentQuestionIndex + 1} / {quiz.questions.length}</div>
      </div>
      
      <div className="question-container">
        <div className="question-text">
          {currentQuestion.question}
        </div>
        
        <div className="answer-options">
          {currentQuestion.options.map((option, index) => (
            <div 
              key={index} 
              className={`answer-option ${selectedAnswers[currentQuestion.id] === option ? 'selected' : ''}`}
              onClick={() => handleAnswerChange(currentQuestion.id, option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
      
      <div className="question-progress">
        {quiz.questions.map((_, index) => (
          <div 
            key={index}
            className={`progress-dot ${index === currentQuestionIndex ? 'current' : ''} ${selectedAnswers[quiz.questions[index].id] ? 'answered' : ''}`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </div>
        ))}
      </div>
      
      <div className="quiz-actions">
        <button 
          className="action-button secondary" 
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        
        {isLastQuestion && quizCompleted ? (
          <button 
            className="action-button primary" 
            onClick={handleSubmitQuiz}
            disabled={Object.values(selectedAnswers).some(answer => !answer)}
          >
            Submit Quiz
          </button>
        ) : (
          <button 
            className="action-button primary" 
            onClick={handleNextQuestion}
            disabled={!isAnswered}
          >
            {isLastQuestion ? 'Last Question' : 'Next'}
          </button>
        )}
      </div>
      
      <div className="quiz-footer">
        <button 
          className="cancel-button" 
          onClick={() => navigate('/dashboard')}
        >
          Cancel
        </button>
        
        {Object.keys(selectedAnswers).length === quiz.questions.length && 
         !Object.values(selectedAnswers).some(answer => !answer) && (
          <button 
            className="submit-button" 
            onClick={handleSubmitQuiz}
          >
            Submit All Answers
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
