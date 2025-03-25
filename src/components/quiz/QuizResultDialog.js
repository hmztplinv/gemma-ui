import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, LinearProgress, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const QuizResultDialog = ({ open, onClose, result }) => {
  if (!result) return null;
  
  const scorePercentage = result.score;
  const scoreText = getScoreText(scorePercentage);
  const scoreColor = getScoreColor(scorePercentage);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" component="div" align="center">
          Quiz Results
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="div" sx={{ color: scoreColor, fontWeight: 'bold', mb: 1 }}>
            {scorePercentage}%
          </Typography>
          
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {scoreText}
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={scorePercentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5, 
              mb: 2, 
              bgcolor: 'grey.300',
              '& .MuiLinearProgress-bar': {
                bgcolor: scoreColor,
              }
            }} 
          />
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Quiz: {result.quizTitle}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Level: {result.quizLevel}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Completed: {new Date(result.completedAt).toLocaleString()}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircleIcon color="success" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Correct Answers: {result.correctAnswers}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon color="error" sx={{ mr: 1 }} />
            <Typography variant="body1">
              Wrong Answers: {result.totalQuestions - result.correctAnswers}
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Tips for improvement:
        </Typography>
        
        <Typography variant="body2" paragraph>
          {getImprovementTips(scorePercentage)}
        </Typography>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Back to Dashboard
        </Button>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Take Another Quiz
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper functions
function getScoreText(score) {
  if (score >= 90) return "Excellent!";
  if (score >= 80) return "Great job!";
  if (score >= 70) return "Good work!";
  if (score >= 60) return "Not bad!";
  if (score >= 50) return "You passed!";
  return "Keep practicing!";
}

function getScoreColor(score) {
  if (score >= 80) return '#4caf50'; // Green
  if (score >= 60) return '#ff9800'; // Orange
  return '#f44336'; // Red
}

function getImprovementTips(score) {
  if (score >= 90) {
    return "Amazing work! You've mastered these words. Try challenging yourself with a more advanced level next time.";
  }
  if (score >= 70) {
    return "Good progress! Review the words you missed and try using them in sentences to reinforce your learning.";
  }
  if (score >= 50) {
    return "You're on the right track! Consider spending more time with flashcards to memorize the words you missed.";
  }
  return "Don't worry! Learning vocabulary takes time. Try focusing on fewer words at once and practice them in conversations.";
}

export default QuizResultDialog;