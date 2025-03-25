import requests from './agent';

const UserApi = {
  getUserProfile: () => requests.get('/users/profile'),
  getUserVocabulary: () => requests.get('/users/vocabulary'),
  getUserProgress: () => requests.get('/users/progress'),
  updateUserProfile: (profile) => requests.put('/users/profile', profile),

  updateVocabularyItem: (wordId, updateData) => 
    requests.put(`/vocabulary/${wordId}`, updateData),
  
  // Flashcards için
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