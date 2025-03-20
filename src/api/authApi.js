import requests from './agent';

const AuthApi = {
  login: (credentials) => requests.post('/auth/login', credentials),
  register: (user) => requests.post('/auth/register', user),
  getCurrentUser: () => requests.get('/users/current')
};

export default AuthApi;