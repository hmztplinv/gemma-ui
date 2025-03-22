import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      textAlign: 'center',
      padding: '0 20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '36px',
          color: '#333',
          marginBottom: '20px'
        }}>404 - Page Not Found</h1>
        
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '30px'
        }}>The page you are looking for does not exist.</p>
        
        <Link to="/" style={{
          display: 'inline-block',
          backgroundColor: '#4a90e2',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}>Return to Home</Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

