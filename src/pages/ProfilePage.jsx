import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';
import EditProfileModal from '../components/profile/EditProfileModal';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const profileData = await userApi.getUserProfile();
        setProfile(profileData);
        
        // Fetch user progress/stats
        const progressData = await userApi.getUserProgress();
        setStats(progressData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  const handleSaveProfile = async (updatedProfile) => {
    try {
      await userApi.updateUserProfile(updatedProfile);
      setProfile({
        ...profile,
        ...updatedProfile
      });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  // Use mock data if profile data is not available yet (for development)
  const mockProfile = {
    username: user?.username || 'User',
    email: user?.email || 'user@example.com',
    nativeLanguage: 'Turkish',
    learningLanguage: 'English',
    proficiencyLevel: user?.languageLevel || 'Beginner',
    memberSince: new Date().toLocaleDateString()
  };

  const mockStats = {
    conversationsCount: 12,
    messagesCount: 134,
    vocabularyCount: 248,
    streakDays: 28
  };

  const displayProfile = profile || mockProfile;
  const displayStats = stats || mockStats;

  const getInitial = (name) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <Link to="/conversations" className="back-button">
          ← Back Dashboard
        </Link>
      </div>
      
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {getInitial(displayProfile.username)}
          </div>
        </div>
        
        <div className="profile-info">
          <h2>{displayProfile.username}</h2>
          <p className="profile-email">{displayProfile.email}</p>
          
          <hr className="profile-divider" />
          
          <div className="profile-details">
            <div className="profile-detail">
              <span className="detail-label">Native Language:</span>
              <span className="detail-value">{displayProfile.nativeLanguage}</span>
            </div>
            
            <div className="profile-detail">
              <span className="detail-label">Learning Language:</span>
              <span className="detail-value">{displayProfile.learningLanguage}</span>
            </div>
            
            <div className="profile-detail">
              <span className="detail-label">Proficiency Level:</span>
              <span className="detail-value">{displayProfile.proficiencyLevel}</span>
            </div>
            
            <div className="profile-detail">
              <span className="detail-label">Member Since:</span>
              <span className="detail-value">{displayProfile.memberSince}</span>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profile
            </button>
            
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <div className="stats-card">
        <h2>Learning Statistics</h2>
        
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-value">{displayStats.conversationsCount}</div>
            <div className="stat-label">Conversations</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">{displayStats.messagesCount}</div>
            <div className="stat-label">Messages</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">{displayStats.vocabularyCount}</div>
            <div className="stat-label">Vocabulary Words</div>
          </div>
          
          <div className="stat-box">
            <div className="stat-value">{displayStats.streakDays}</div>
            <div className="stat-label">Days Active</div>
          </div>
        </div>
        
        <div className="view-more-section">
          <Link to="/vocabulary" className="view-more-btn">
            View Vocabulary Details →
          </Link>
        </div>
      </div>
      
      {showEditModal && (
        <EditProfileModal
          profile={displayProfile}
          onSave={handleSaveProfile}
          onCancel={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;