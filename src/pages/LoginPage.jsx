import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import '../styles/Auth.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Language Learning App</h1>
        <p className="subtitle">Improve your language skills with AI-powered conversations</p>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;