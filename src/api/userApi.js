import requests from './agent';

const UserApi = {
  getUserProfile: () => requests.get('/users/profile'),
  getUserVocabulary: () => requests.get('/users/vocabulary'),
  getUserProgress: () => requests.get('/users/progress'),
  updateUserProfile: (profile) => requests.put('/users/profile', profile)
};

export default UserApi;