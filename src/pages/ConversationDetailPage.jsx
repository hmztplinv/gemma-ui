import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import conversationApi from '../api/conversationApi';
import MessageList from '../components/conversation/MessageList';
import MessageInput from '../components/conversation/MessageInput';
import '../styles/ConversationDetail.css';

const ConversationDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  const sendMessage = async (content) => {
    if (!content.trim()) return;
    
    try {
      if (id === 'new') {
        await startNewConversation(content);
        return;
      }
      
      const messageData = { content };
      await conversationApi.sendMessage(id, messageData);
      
      // Mesaj gönderildikten sonra konuşmayı yeniden yükle (yeni mesajları almak için)
      const updatedConversation = await conversationApi.getConversation(id);
      setConversation(updatedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading conversation...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="conversation-detail-page">
      <div className="conversation-header">
        <h1>{conversation?.title || 'New Conversation'}</h1>
      </div>
      
      <div className="conversation-container">
        {conversation && (
          <>
            <MessageList messages={conversation.messages || []} />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ConversationDetailPage;