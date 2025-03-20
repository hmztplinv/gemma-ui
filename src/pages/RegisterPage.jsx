import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import '../styles/Auth.css';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Join Language Learning App</h1>
        <p className="subtitle">Create an account to start your language journey</p>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;