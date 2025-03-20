import React from 'react';
import '../../styles/ErrorHighlight.css';

const ErrorHighlight = ({ error }) => {
  return (
    <div className="error-highlight">
      <div className="error-original">
        <span className="error-label">Original:</span>
        <span className="error-text">{error.errorText}</span>
      </div>
      
      <div className="error-correction">
        <span className="correction-label">Correction:</span>
        <span className="correction-text">{error.correction}</span>
      </div>
      
      <div className="error-explanation">
        <span className="explanation-label">Explanation:</span>
        <span className="explanation-text">{error.explanation}</span>
      </div>
    </div>
  );
};

export default ErrorHighlight;