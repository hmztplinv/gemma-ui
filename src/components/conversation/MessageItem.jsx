import React, { useState } from 'react';
import ErrorHighlight from './ErrorHighlight';
import '../../styles/MessageItem.css';

const MessageItem = ({ message }) => {
  const [showErrors, setShowErrors] = useState(true);
  
  const toggleErrors = () => {
    setShowErrors(!showErrors);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-item ${message.isFromUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-avatar">
        {message.isFromUser ? '👤' : '🤖'}
      </div>
      
      <div className="message-content">
        <div className="message-header">
          <span className="message-sender">
            {message.isFromUser ? 'You' : 'AI Tutor'}
          </span>
          <span className="message-time">
            {formatDate(message.createdAt)}
          </span>
        </div>
        
        <div className="message-text">
          {message.content}
        </div>
        
        {message.isFromUser && message.errorAnalysis && message.errorAnalysis.errors && message.errorAnalysis.errors.length > 0 && (
          <div className="message-errors">
            <button 
              onClick={toggleErrors} 
              className="toggle-errors-btn"
            >
              {showErrors ? 'Hide Corrections' : 'Show Corrections'} 
              ({message.errorAnalysis.errors.length})
            </button>
            
            {showErrors && (
              <div className="errors-container">
                {message.errorAnalysis.errors.map((error, index) => (
                  <ErrorHighlight 
                    key={index} 
                    error={error}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;