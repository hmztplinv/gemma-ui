import requests from './agent';

const UserApi = {
  getUserProfile: () => requests.get('/users/profile'),
  getUserVocabulary: () => requests.get('/users/vocabulary'),
  getUserProgress: () => requests.get('/users/progress'),
  updateUserProfile: (profile) => requests.put('/users/profile', profile),

  // Error analysis endpoints
  getUserErrorAnalysis: (timeRange = 'month') => 
    requests.get(`/users/errors?timeRange=${timeRange}`),
  
  // Goals and tasks endpoints
  getUserGoals: () => requests.get('/users/goals'),
  createUserGoal: (goal) => requests.post('/users/goals', goal),
  updateUserGoal: (goalId, goalData) => requests.put(`/users/goals/${goalId}`, goalData),
  deleteUserGoal: (goalId) => requests.delete(`/users/goals/${goalId}`),
  
  // Badges endpoints
  getUserBadges: () => requests.get('/users/badges'),
  
  updateVocabularyItem: (wordId, updateData) => 
    requests.put(`/vocabulary/${wordId}`, updateData),
  
  // Flashcards
  getFlashcards: (level = null, count = 10) => {
    let url = '/vocabulary/flashcards';
    if (level && level !== 'all') {
      url += `?level=${level}&count=${count}`;
    } else {
      url += `?count=${count}`;
    }
    return requests.get(url);
  }
};

export default UserApi;