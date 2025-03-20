import requests from './agent';

const ConversationApi = {
  getConversations: () => requests.get('/conversation'),
  getConversation: (id) => requests.get(`/conversation/${id}`),
  createConversation: (conversation) => requests.post('/conversation', conversation),
  sendMessage: (conversationId, message) => requests.post(`/conversation/${conversationId}/messages`, message)
};

export default ConversationApi;