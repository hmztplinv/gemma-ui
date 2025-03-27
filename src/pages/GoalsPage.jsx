import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';
import '../styles/Goals.css';

const GoalsPage = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'daily', 'weekly', 'completed'

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetType: 'words', // 'words', 'conversations', 'minutes', 'quizzes'
    targetValue: 10,
    frequency: 'daily', // 'daily', 'weekly'
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  });

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setIsLoading(true);
        // Call API to get goals
        const data = await userApi.getUserGoals();
        setGoals(data);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to load goals. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  // Mock data for development
  const mockGoals = [
    {
      id: 1,
      title: 'Learn New Vocabulary',
      targetType: 'words',
      targetValue: 10,
      currentProgress: 7,
      frequency: 'daily',
      isCompleted: false,
      startDate: '2023-02-15',
      endDate: '2023-02-22'
    },
    {
      id: 2,
      title: 'Practice Conversations',
      targetType: 'conversations',
      targetValue: 5,
      currentProgress: 3,
      frequency: 'weekly',
      isCompleted: false,
      startDate: '2023-02-10',
      endDate: '2023-02-17'
    },
    {
      id: 3,
      title: 'Complete Grammar Quizzes',
      targetType: 'quizzes',
      targetValue: 3,
      currentProgress: 3,
      frequency: 'weekly',
      isCompleted: true,
      startDate: '2023-02-05',
      endDate: '2023-02-12'
    },
    {
      id: 4,
      title: 'Study Time',
      targetType: 'minutes',
      targetValue: 30,
      currentProgress: 15,
      frequency: 'daily',
      isCompleted: false,
      startDate: '2023-02-14',
      endDate: '2023-02-21'
    }
  ];

  // Use mock data for now
  const displayGoals = goals.length > 0 ? goals : mockGoals;

  // Filter goals based on activeFilter
  const filteredGoals = displayGoals.filter(goal => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'daily') return goal.frequency === 'daily';
    if (activeFilter === 'weekly') return goal.frequency === 'weekly';
    if (activeFilter === 'completed') return goal.isCompleted;
    return true;
  });

  const handleCreateGoal = async () => {
    try {
      // Validate form
      if (!newGoal.title.trim()) {
        alert('Please enter a goal title');
        return;
      }

      // Call API to create goal
      // const createdGoal = await userApi.createUserGoal(newGoal);
      
      // For now, just mock the API call
      const createdGoal = {
        ...newGoal,
        id: displayGoals.length + 1,
        currentProgress: 0,
        isCompleted: false,
        startDate: new Date().toISOString().split('T')[0]
      };

      // Add the new goal to the list
      setGoals([...displayGoals, createdGoal]);
      
      // Close modal and reset form
      setShowCreateModal(false);
      setNewGoal({
        title: '',
        targetType: 'words',
        targetValue: 10,
        frequency: 'daily',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Error creating goal:', err);
      alert('Failed to create goal. Please try again.');
    }
  };

  const handleUpdateGoal = async (goalId, updates) => {
    try {
      // Call API to update goal
      // await userApi.updateUserGoal(goalId, updates);
      
      // For now, just update the local state
      const updatedGoals = displayGoals.map(goal => 
        goal.id === goalId ? { ...goal, ...updates } : goal
      );
      
      setGoals(updatedGoals);
    } catch (err) {
      console.error('Error updating goal:', err);
      alert('Failed to update goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        // Call API to delete goal
        // await userApi.deleteUserGoal(goalId);
        
        // For now, just update the local state
        const updatedGoals = displayGoals.filter(goal => goal.id !== goalId);
        setGoals(updatedGoals);
      } catch (err) {
        console.error('Error deleting goal:', err);
        alert('Failed to delete goal. Please try again.');
      }
    }
  };

  // Helper function to format target type
  const formatTargetType = (type, value) => {
    switch (type) {
      case 'words':
        return `${value} new words`;
      case 'conversations':
        return `${value} conversation${value > 1 ? 's' : ''}`;
      case 'minutes':
        return `${value} minute${value > 1 ? 's' : ''} of study`;
      case 'quizzes':
        return `${value} quiz${value > 1 ? 'zes' : ''}`;
      default:
        return `${value} ${type}`;
    }
  };

  // Calculate days remaining for a goal
  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get appropriate icon for a goal type
  const getGoalIcon = (targetType) => {
    switch (targetType) {
      case 'words':
        return '📚';
      case 'conversations':
        return '💬';
      case 'minutes':
        return '⏱️';
      case 'quizzes':
        return '✅';
      default:
        return '🎯';
    }
  };

  if (isLoading) {
    return <div className="loading">Loading goals...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="goals-container">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1>Goals & Tasks</h1>
      </div>

      <div className="goals-controls">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All Goals
          </button>
          <button
            className={`filter-tab ${activeFilter === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveFilter('daily')}
          >
            Daily
          </button>
          <button
            className={`filter-tab ${activeFilter === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveFilter('weekly')}
          >
            Weekly
          </button>
          <button
            className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveFilter('completed')}
          >
            Completed
          </button>
        </div>

        <button
          className="create-goal-btn"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Goal
        </button>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="no-goals">
          <p>No goals found. Click the "Create New Goal" button to get started!</p>
        </div>
      ) : (
        <div className="goals-list">
          {filteredGoals.map(goal => {
            const progressPercentage = Math.min(
              Math.round((goal.currentProgress / goal.targetValue) * 100),
              100
            );
            const daysRemaining = getDaysRemaining(goal.endDate);
            
            return (
              <div 
                key={goal.id} 
                className={`goal-card ${goal.isCompleted ? 'completed' : ''}`}
              >
                <div className="goal-header">
                  <div className="goal-icon">{getGoalIcon(goal.targetType)}</div>
                  <div className="goal-title">{goal.title}</div>
                  <div className="goal-actions">
                    <button
                      className="edit-goal-btn"
                      onClick={() => {
                        // Add edit functionality
                        alert('Edit feature coming soon!');
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-goal-btn"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="goal-details">
                  <div className="goal-target">
                    Target: {formatTargetType(goal.targetType, goal.targetValue)}
                  </div>
                  <div className="goal-frequency">
                    Frequency: {goal.frequency.charAt(0).toUpperCase() + goal.frequency.slice(1)}
                  </div>
                  {!goal.isCompleted && (
                    <div className="goal-deadline">
                      {daysRemaining > 0 
                        ? `${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining` 
                        : 'Deadline passed'}
                    </div>
                  )}
                </div>

                <div className="goal-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    {goal.currentProgress} / {goal.targetValue} (
                    {progressPercentage}%)
                  </div>
                </div>

                {!goal.isCompleted && (
                  <div className="goal-actions-footer">
                    <button
                      className="update-progress-btn"
                      onClick={() => {
                        const newProgress = Math.min(goal.currentProgress + 1, goal.targetValue);
                        const isNowCompleted = newProgress >= goal.targetValue;
                        handleUpdateGoal(goal.id, { 
                          currentProgress: newProgress,
                          isCompleted: isNowCompleted
                        });
                      }}
                    >
                      + Progress
                    </button>
                    <button
                      className="mark-complete-btn"
                      onClick={() => handleUpdateGoal(goal.id, { 
                        currentProgress: goal.targetValue,
                        isCompleted: true 
                      })}
                    >
                      Mark Complete
                    </button>
                  </div>
                )}

                {goal.isCompleted && (
                  <div className="goal-completed-badge">
                    Completed! 🎉
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Goal</h2>
              <button 
                className="modal-close" 
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="title">Goal Title:</label>
                <input
                  type="text"
                  id="title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="E.g., Learn new vocabulary"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="targetType">Target Type:</label>
                <select
                  id="targetType"
                  value={newGoal.targetType}
                  onChange={(e) => setNewGoal({ ...newGoal, targetType: e.target.value })}
                >
                  <option value="words">Vocabulary Words</option>
                  <option value="conversations">Conversations</option>
                  <option value="minutes">Study Minutes</option>
                  <option value="quizzes">Quizzes</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="targetValue">Target Value:</label>
                <input
                  type="number"
                  id="targetValue"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: parseInt(e.target.value) || 1 })}
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="frequency">Frequency:</label>
                <select
                  id="frequency"
                  value={newGoal.frequency}
                  onChange={(e) => setNewGoal({ ...newGoal, frequency: e.target.value })}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  value={newGoal.endDate}
                  onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button
                className="create-btn"
                onClick={handleCreateGoal}
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;