import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';
import '../styles/Badges.css';

const BadgesPage = () => {
  const { user } = useAuth();
  const [badges, setBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'earned', 'locked'

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setIsLoading(true);
        // Call API to get badges
        const data = await userApi.getUserBadges();
        setBadges(data);
      } catch (err) {
        console.error('Error fetching badges:', err);
        setError('Failed to load badges. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBadges();
  }, []);

  // Mock data for development
  const mockBadges = [
    {
      id: 1,
      name: 'First Conversation',
      description: 'Complete your first conversation with the AI tutor.',
      imageUrl: '🗣️',
      earnedAt: '2023-02-10T15:30:00',
      isEarned: true,
      category: 'Conversations',
      progress: 100
    },
    {
      id: 2,
      name: 'Vocabulary Builder',
      description: 'Learn 50 new words.',
      imageUrl: '📚',
      earnedAt: '2023-02-15T12:45:00',
      isEarned: true,
      category: 'Vocabulary',
      progress: 100
    },
    {
      id: 3,
      name: 'Quiz Master',
      description: 'Score 90% or higher on 5 quizzes.',
      imageUrl: '🏆',
      earnedAt: null,
      isEarned: false,
      category: 'Quizzes',
      progress: 60
    },
    {
      id: 4,
      name: 'Perfect Streak',
      description: 'Maintain a 7-day learning streak.',
      imageUrl: '🔥',
      earnedAt: '2023-02-18T09:20:00',
      isEarned: true,
      category: 'Engagement',
      progress: 100
    },
    {
      id: 5,
      name: 'Grammar Guru',
      description: 'Make fewer than 5 grammar mistakes in 10 consecutive conversations.',
      imageUrl: '📝',
      earnedAt: null,
      isEarned: false,
      category: 'Grammar',
      progress: 40
    },
    {
      id: 6,
      name: 'Vocabulary Virtuoso',
      description: 'Learn 100 new words.',
      imageUrl: '🎓',
      earnedAt: null,
      isEarned: false,
      category: 'Vocabulary',
      progress: 78
    },
    {
      id: 7,
      name: 'Conversation Connoisseur',
      description: 'Complete 20 conversations.',
      imageUrl: '💬',
      earnedAt: null,
      isEarned: false,
      category: 'Conversations',
      progress: 55
    },
    {
      id: 8,
      name: 'Daily Dedication',
      description: 'Complete all daily goals for 5 consecutive days.',
      imageUrl: '📅',
      earnedAt: null,
      isEarned: false,
      category: 'Goals',
      progress: 20
    },
    {
      id: 9,
      name: 'Early Bird',
      description: 'Study English before 8 AM for 3 days in a row.',
      imageUrl: '🌅',
      earnedAt: '2023-02-12T07:15:00',
      isEarned: true,
      category: 'Habits',
      progress: 100
    }
  ];

  // Use mock data for now
  const displayBadges = badges.length > 0 ? badges : mockBadges;

  // Filter badges based on status
  const filteredBadges = displayBadges.filter(badge => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'earned') return badge.isEarned;
    if (filterStatus === 'locked') return !badge.isEarned;
    return true;
  });

  // Group badges by category
  const groupedBadges = filteredBadges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {});

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSelectBadge = (badge) => {
    setSelectedBadge(badge);
  };

  const handleCloseDetail = () => {
    setSelectedBadge(null);
  };

  if (isLoading) {
    return <div className="loading">Loading badges...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="badges-container">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1>Badges & Rewards</h1>
      </div>

      <div className="badges-summary">
        <div className="summary-card">
          <div className="summary-title">Total Badges</div>
          <div className="summary-value">{displayBadges.length}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Earned Badges</div>
          <div className="summary-value">
            {displayBadges.filter(badge => badge.isEarned).length}
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Progress</div>
          <div className="summary-value">
            {Math.round(
              (displayBadges.filter(badge => badge.isEarned).length / displayBadges.length) * 100
            )}%
          </div>
        </div>
      </div>

      <div className="badges-filter">
        <div className="filter-label">Show:</div>
        <div className="filter-options">
          <button
            className={`filter-option ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Badges
          </button>
          <button
            className={`filter-option ${filterStatus === 'earned' ? 'active' : ''}`}
            onClick={() => setFilterStatus('earned')}
          >
            Earned
          </button>
          <button
            className={`filter-option ${filterStatus === 'locked' ? 'active' : ''}`}
            onClick={() => setFilterStatus('locked')}
          >
            Locked
          </button>
        </div>
      </div>

      {Object.keys(groupedBadges).length === 0 ? (
        <div className="no-badges">
          <p>No badges found with the current filter settings.</p>
        </div>
      ) : (
        Object.entries(groupedBadges).map(([category, categoryBadges]) => (
          <div key={category} className="badge-category">
            <h2 className="category-title">{category}</h2>
            <div className="badges-grid">
              {categoryBadges.map(badge => (
                <div
                  key={badge.id}
                  className={`badge-card ${badge.isEarned ? 'earned' : 'locked'}`}
                  onClick={() => handleSelectBadge(badge)}
                >
                  <div className="badge-icon">{badge.imageUrl}</div>
                  <div className="badge-info">
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-description">{badge.description}</div>
                  </div>
                  {!badge.isEarned && (
                    <div className="badge-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${badge.progress}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">{badge.progress}%</div>
                    </div>
                  )}
                  {badge.isEarned && (
                    <div className="badge-earned-date">
                      Earned on {formatDate(badge.earnedAt)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div className="badge-detail-modal">
          <div className="modal-overlay" onClick={handleCloseDetail}></div>
          <div className="modal-content">
            <button className="modal-close" onClick={handleCloseDetail}>
              ×
            </button>
            <div className="badge-detail">
              <div className="badge-icon large">{selectedBadge.imageUrl}</div>
              <h2 className="badge-title">{selectedBadge.name}</h2>
              <div className="badge-description">{selectedBadge.description}</div>
              <div className="badge-status">
                {selectedBadge.isEarned ? (
                  <div className="earned-status">
                    Earned on {formatDate(selectedBadge.earnedAt)}
                  </div>
                ) : (
                  <div className="locked-status">
                    <div className="progress-label">Progress:</div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${selectedBadge.progress}%` }}
                      ></div>
                    </div>
                    <div className="progress-text">{selectedBadge.progress}%</div>
                  </div>
                )}
              </div>
              <div className="badge-category-tag">{selectedBadge.category}</div>
              {selectedBadge.isEarned && (
                <div className="share-badge">
                  <button className="share-button">Share Badge</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgesPage;