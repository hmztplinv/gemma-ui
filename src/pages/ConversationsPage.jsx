import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import conversationApi from '../api/conversationApi';
import '../styles/ConversationsPage.css';

const ConversationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await conversationApi.getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setError('Failed to load conversations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversations();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleNewConversation = () => {
    navigate('/conversation/new');
  };

  if (isLoading) {
    return <div className="loading">Loading conversations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="conversations-page">
      <div className="conversations-header">
        <h1>Your Conversations</h1>
        <button className="new-conversation-btn" onClick={handleNewConversation}>
          New Conversation
        </button>
      </div>
      
      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="empty-conversations">
            <p>You haven't started any conversations yet.</p>
            <button onClick={handleNewConversation}>Start a New Conversation</button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <Link 
              to={`/conversation/${conversation.id}`} 
              key={conversation.id}
              className="conversation-item"
            >
              <div className="conversation-title">{conversation.title}</div>
              <div className="conversation-date">{formatDate(conversation.lastMessageAt)}</div>
              {conversation.messages && conversation.messages.length > 0 && (
                <div className="conversation-preview">
                  {conversation.messages[conversation.messages.length - 1].content.substring(0, 60)}
                  {conversation.messages[conversation.messages.length - 1].content.length > 60 ? '...' : ''}
                </div>
              )}
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsPage;