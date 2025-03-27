import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css'; // We'll create this separately

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Welcome to your Dashboard</h2>
        <h1 className="greeting">Hello, {user?.username || 'User'}!</h1>
      </div>

      <div className="dashboard-content">
        <h2 className="section-title">Your Learning Activities</h2>

        <div className="activity-cards">
          

          <Link to="/conversation/new" className="activity-card">
            <div className="card-icon">✏️</div>
            <div className="card-content">
              <h3>New Conversation</h3>
              <p>Start practicing with our AI language tutor</p>
            </div>
          </Link>

          <Link to="/conversations" className="activity-card">
            <div className="card-icon">💬</div>
            <div className="card-content">
              <h3>Conversations</h3>
              <p>View your past conversations or start a new one</p>
            </div>
          </Link>

          <Link to="/quiz" className="activity-card">
            <div className="card-icon">🧠</div>
            <div className="card-content">
              <h3>Quiz</h3>
              <p>Test your knowledge with interactive quizzes</p>
            </div>
          </Link>

          <Link to="/quiz/history" className="activity-card">
          <div className="card-icon">📜</div>
            <div className="card-content">
              <h3>Quiz History</h3>
              <p>Check your history of quizzes</p>
            </div>
          </Link>

          <Link to="/vocabulary" className="activity-card">
            <div className="card-icon">📖</div>
            <div className="card-content">
              <h3>My Vocabulary</h3>
              <p>View and manage your vocabulary collection</p>
            </div>
          </Link>

          <Link to="/profile" className="activity-card">
            <div className="card-icon">👤</div>
            <div className="card-content">
              <h3>My Profile</h3>
              <p>View and manage your profile information</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;