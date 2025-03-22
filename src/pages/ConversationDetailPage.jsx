import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import conversationApi from '../api/conversationApi';
import MessageList from '../components/conversation/MessageList';

// Inline styles for the page
const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f9f9f9'
  },
  header: {
    padding: '20px 0',
    borderBottom: '1px solid #e0e0e0',
    marginBottom: '20px'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    margin: '0'
  },
  conversationContainer: {
    flex: 1,
    padding: '20px 0',
    overflowY: 'auto'
  },
  messageContainer: {
    position: 'sticky',
    bottom: '0',
    background: '#f9f9f9',
    padding: '20px 0',
    borderTop: '1px solid #e0e0e0'
  },
  messageForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  textarea: {
    width: '100%',
    height: '100px',
    padding: '15px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    resize: 'none',
    fontFamily: 'inherit',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  sendButton: {
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  },
  loadingButton: {
    backgroundColor: '#90caf9'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    margin: '50px 0'
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    padding: '40px 0'
  },
  errorText: {
    textAlign: 'center',
    color: '#d32f2f',
    padding: '20px',
    background: '#ffebee',
    borderRadius: '8px',
    margin: '20px 0'
  }
};

const ConversationDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Konuşma detaylarını yükle
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        if (id === 'new') {
          setConversation({
            id: 'new',
            title: 'New Conversation',
            messages: []
          });
          setIsLoading(false);
          return;
        }
        
        const data = await conversationApi.getConversation(id);
        setConversation(data);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setError('Failed to load conversation. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConversation();
  }, [id]);

  // Mesajları görüntüye kaydır
  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Yeni konuşma başlat
  const startNewConversation = async (initialMessage) => {
    try {
      setIsLoading(true);
      const newConversation = await conversationApi.createConversation({
        title: 'Conversation ' + new Date().toLocaleString(),
        initialMessage
      });
      
      navigate(`/conversation/${newConversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to start new conversation. Please try again.');
      setIsLoading(false);
    }
  };

  // Mesaj gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;
    
    try {
      setIsSending(true);
      
      if (id === 'new') {
        await startNewConversation(message);
        return;
      }
      
      const messageData = { content: message };
      await conversationApi.sendMessage(id, messageData);
      
      // Mesaj gönderildikten sonra konuşmayı yeniden yükle (yeni mesajları almak için)
      const updatedConversation = await conversationApi.getConversation(id);
      setConversation(updatedConversation);
      setMessage(' ');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading && !conversation) {
    return <div style={styles.loadingText}>Loading conversation...</div>;
  }

  if (error) {
    return <div style={styles.errorText}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <h1 style={styles.headerTitle}>{conversation?.title || 'New Conversation'}</h1>
    <button 
      onClick={() => navigate('/dashboard')} 
      style={{
        backgroundColor: id === 'new' ? '#f44336' : '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {id === 'new' ? 'Cancel' : <><span style={{marginRight: '4px'}}>←</span> Dashboard'a Dön</>}
    </button>
  </div>
</div>
      
      <div style={styles.conversationContainer}>
        {conversation?.messages?.length > 0 ? (
          <MessageList messages={conversation.messages} />
        ) : (
          <p style={styles.emptyMessage}>Start your conversation by typing a message below.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.messageContainer}>
        <form onSubmit={handleSubmit} style={styles.messageForm}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message here..."
            style={styles.textarea}
            disabled={isSending}
          />
          
          <button 
            type="submit" 
            style={{
              ...styles.sendButton,
              ...(isSending ? styles.loadingButton : {}),
              opacity: (!message.trim() || isSending) ? 0.7 : 1,
              cursor: (!message.trim() || isSending) ? 'not-allowed' : 'pointer'
            }}
            disabled={!message.trim() || isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationDetailPage;