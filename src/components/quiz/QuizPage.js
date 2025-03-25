import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Card, CardContent, CardActions, Alert, CircularProgress, Grid, Paper } from '@mui/material';
import QuizResultDialog from './QuizResultDialog';
import { fetchQuiz, submitQuizAnswers } from '../../services/quizService';

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
        // Generate a vocabulary quiz at B1 level
        const quizData = await fetchQuiz({ level: 'B1', quizType: 'Vocabulary' });
        setQuiz(quizData);
        
        // Initialize selected answers with empty values
        const initialAnswers = {};
        quizData.questions.forEach(question => {
          initialAnswers[question.id] = '';
        });
        setSelectedAnswers(initialAnswers);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz. Please try again later.');
        setLoading(false);
      }
    };

    loadQuiz();
  }, []);

  const handleAnswerChange = (event) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [quiz.questions[currentQuestionIndex].id]: event.target.value
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
      // Format answers for submission
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
      setError('Failed to submit quiz. Please try again.');
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    navigate('/dashboard'); // Navigate back to dashboard or any appropriate page
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 4 }}>No quiz available. Try again later.</Alert>
        <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isAnswered = !!selectedAnswers[currentQuestion.id];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {quiz.title}
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </Typography>
        
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
              {currentQuestion.question}
            </Typography>
            
            <FormControl component="fieldset" sx={{ mt: 2, width: '100%' }}>
              <RadioGroup
                name="quiz-options"
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={handleAnswerChange}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel 
                    key={index} 
                    value={option} 
                    control={<Radio />} 
                    label={option} 
                    sx={{ mt: 1 }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
          
          <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            
            {isLastQuestion ? (
              <Button 
                variant="contained" 
                color="primary"
                onClick={quizCompleted ? handleSubmitQuiz : handleNextQuestion}
                disabled={!isAnswered}
              >
                {quizCompleted ? 'Submit Quiz' : 'Next'}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleNextQuestion}
                disabled={!isAnswered}
              >
                Next
              </Button>
            )}
          </CardActions>
        </Card>
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Quiz Level: {quiz.level}
          </Typography>
          
          <Box>
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Cancel Quiz
            </Button>
            
            <Button 
              variant="contained" 
              color="success"
              onClick={handleSubmitQuiz}
              disabled={Object.values(selectedAnswers).some(answer => !answer)}
            >
              Submit All Answers
            </Button>
          </Box>
        </Box>
      </Paper>
      
      {/* Question navigation */}
      <Grid container spacing={1} sx={{ mb: 4 }}>
        {quiz.questions.map((_, index) => (
          <Grid item key={index}>
            <Button
              variant={index === currentQuestionIndex ? "contained" : "outlined"}
              color={selectedAnswers[quiz.questions[index].id] ? "success" : "primary"}
              onClick={() => setCurrentQuestionIndex(index)}
              sx={{ minWidth: '40px' }}
            >
              {index + 1}
            </Button>
          </Grid>
        ))}
      </Grid>
      
      {/* Results dialog */}
      {quizResult && (
        <QuizResultDialog
          open={showResults}
          onClose={handleCloseResults}
          result={quizResult}
        />
      )}
    </Container>
  );
};

export default QuizPage;