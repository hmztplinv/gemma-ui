import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuiz, submitQuizAnswers } from '../api/quizApi';
import '../styles/QuizPage.css';

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setLoading(true);
        // B1 seviyesinde bir kelime quizi oluştur
        const quizData = await fetchQuiz({ level: 'B1', quizType: 'Vocabulary' });
        setQuiz(quizData);
        
        // Seçilen cevaplar için başlangıç ​​değerlerini ayarla
        const initialAnswers = {};
        quizData.questions.forEach(question => {
          initialAnswers[question.id] = '';
        });
        setSelectedAnswers(initialAnswers);
        
        setLoading(false);
      } catch (err) {
        setError('Quiz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
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
      // Cevapları gönderme formatına dönüştür
      const answers = Object.keys(selectedAnswers).map(questionId => ({
        questionId: parseInt(questionId, 10),
        answer: selectedAnswers[questionId]
      }));

      const result = await submitQuizAnswers({
        quizId: quiz.id,
        answers: answers
      });

      setQuizResult(result);
      setShowResults(true);
    } catch (err) {
      setError('Quiz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return <div className="loading">Quiz Prepare ...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Panele Dön
        </button>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="error-container">
        <div className="info-message">Şu anda quiz hazır değil. Lütfen daha sonra tekrar deneyin.</div>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Panele Dön
        </button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  // Quiz sonuç ekranı
  if (showResults && quizResult) {
    const scorePercentage = quizResult.score;
    
    let resultMessage = "İyi denemeydin!";
    let resultClass = "neutral";
    
    if (scorePercentage >= 80) {
      resultMessage = "Mükemmel!";
      resultClass = "excellent";
    } else if (scorePercentage >= 60) {
      resultMessage = "İyi iş!";
      resultClass = "good";
    } else if (scorePercentage < 40) {
      resultMessage = "Daha fazla pratik yapmalısın.";
      resultClass = "poor";
    }

    return (
      <div className="quiz-result-container">
        <h1>Quiz Sonuçları</h1>
        
        <div className={`result-score ${resultClass}`}>
          <div className="score-value">{scorePercentage}%</div>
          <div className="score-message">{resultMessage}</div>
        </div>
        
        <div className="result-details">
          <div className="detail-item">
            <span className="detail-label">Quiz:</span>
            <span className="detail-value">{quizResult.quizTitle}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Seviye:</span>
            <span className="detail-value">{quizResult.quizLevel}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Doğru Cevaplar:</span>
            <span className="detail-value">{quizResult.correctAnswers} / {quizResult.totalQuestions}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Tamamlanma:</span>
            <span className="detail-value">{new Date(quizResult.completedAt).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="result-actions">
          <button 
            className="action-button primary" 
            onClick={() => navigate('/dashboard')}
          >
            Panele Dön
          </button>
          <button 
            className="action-button secondary" 
            onClick={() => window.location.reload()}
          >
            Yeni Quiz Başlat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <h1>{quiz.title || 'Kelime Bilgisi Testi'}</h1>
        <div className="quiz-subtitle">Seviye: {quiz.level} | Soru {currentQuestionIndex + 1} / {quiz.questions.length}</div>
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
          Önceki
        </button>
        
        {isLastQuestion && quizCompleted ? (
          <button 
            className="action-button primary" 
            onClick={handleSubmitQuiz}
            disabled={Object.values(selectedAnswers).some(answer => !answer)}
          >
            Quiz'i Tamamla
          </button>
        ) : (
          <button 
            className="action-button primary" 
            onClick={handleNextQuestion}
            disabled={!isAnswered}
          >
            {isLastQuestion ? 'Son Soruya Geldin' : 'Sonraki'}
          </button>
        )}
      </div>
      
      <div className="quiz-footer">
        <button 
          className="cancel-button" 
          onClick={() => navigate('/dashboard')}
        >
          İptal Et
        </button>
        
        {Object.keys(selectedAnswers).length === quiz.questions.length && 
         !Object.values(selectedAnswers).some(answer => !answer) && (
          <button 
            className="submit-button" 
            onClick={handleSubmitQuiz}
          >
            Tüm Cevapları Gönder
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;