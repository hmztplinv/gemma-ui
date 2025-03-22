import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Inline styles
const styles = {
  page: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
  },
  header: {
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#333',
    margin: '0'
  },
  backButton: {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '30px',
    marginBottom: '30px'
  },
  profileContent: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px'
  },
  profileAvatar: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#2196f3',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  profileInfo: {
    flex: '1',
    minWidth: '300px'
  },
  profileName: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 5px 0',
    color: '#333'
  },
  profileEmail: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 20px 0'
  },
  profileMeta: {
    borderTop: '1px solid #eee',
    paddingTop: '20px',
    marginTop: '20px'
  },
  metaRow: {
    display: 'flex',
    margin: '10px 0',
    fontSize: '15px'
  },
  metaLabel: {
    width: '180px',
    color: '#666',
    fontWeight: '500'
  },
  metaValue: {
    color: '#333',
    fontWeight: '400'
  },
  buttonsContainer: {
    display: 'flex',
    gap: '15px',
    marginTop: '20px'
  },
  editButton: {
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 20px',
    fontSize: '15px',
    cursor: 'pointer',
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  statBox: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2196f3',
    margin: '0 0 5px 0',
    lineHeight: '1'
  },
  statLabel: {
    fontSize: '14px',
    color: '#666'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666'
  },
  error: {
    textAlign: 'center',
    padding: '30px',
    color: '#d32f2f',
    backgroundColor: '#ffebee',
    borderRadius: '8px'
  }
};

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Simulating API call to get profile data
    setTimeout(() => {
      try {
        // Creating mock profile data
        const mockProfile = {
          username: user?.username || 'Language Learner',
          email: user?.email || 'user@example.com',
          nativeLanguage: 'Turkish',
          learningLanguage: 'English',
          proficiencyLevel: 'Intermediate',
          joinDate: '2023-03-15',
          stats: {
            totalConversations: 12,
            totalMessages: 134,
            vocabularyWords: 248,
            daysActive: 28
          }
        };
        
        setProfile(mockProfile);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load profile data. Please try again.');
        setIsLoading(false);
      }
    }, 800); // Simulating loading delay
  }, [user]);

  const handleLogout = () => {
    // Token'ı localStorage'dan sil
    localStorage.removeItem('token');
    // JWT veya başka token tipleri için de temizlik yapabilirsiniz
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('userSession');
    
    // Auth context'teki logout fonksiyonunu çağır (varsa)
    if (logout) {
      logout();
    }
    
    // Login sayfasına yönlendir
    navigate('/login');
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading profile...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Your Profile</h1>
        <button
          onClick={() => navigate('/dashboard')}
          style={styles.backButton}
        >
          <span style={{ marginRight: '4px' }}>←</span>Back Dashboard
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.profileContent}>
          <div style={styles.profileAvatar}>
            {profile.username.charAt(0).toUpperCase()}
          </div>
          
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>{profile.username}</h2>
            <p style={styles.profileEmail}>{profile.email}</p>
            
            <div style={styles.profileMeta}>
              <div style={styles.metaRow}>
                <div style={styles.metaLabel}>Native Language:</div>
                <div style={styles.metaValue}>{profile.nativeLanguage}</div>
              </div>
              
              <div style={styles.metaRow}>
                <div style={styles.metaLabel}>Learning Language:</div>
                <div style={styles.metaValue}>{profile.learningLanguage}</div>
              </div>
              
              <div style={styles.metaRow}>
                <div style={styles.metaLabel}>Proficiency Level:</div>
                <div style={styles.metaValue}>{profile.proficiencyLevel}</div>
              </div>
              
              <div style={styles.metaRow}>
                <div style={styles.metaLabel}>Member Since:</div>
                <div style={styles.metaValue}>
                  {new Date(profile.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div style={styles.buttonsContainer}>
              <button style={styles.editButton}>Edit Profile</button>
              <button 
                style={styles.logoutButton}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={styles.container}>
        <h2 style={{ ...styles.headerTitle, fontSize: '22px', marginBottom: '20px' }}>
          Learning Statistics
        </h2>
        
        <div style={styles.statsContainer}>
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{profile.stats.totalConversations}</div>
            <div style={styles.statLabel}>Conversations</div>
          </div>
          
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{profile.stats.totalMessages}</div>
            <div style={styles.statLabel}>Messages</div>
          </div>
          
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{profile.stats.vocabularyWords}</div>
            <div style={styles.statLabel}>Vocabulary Words</div>
          </div>
          
          <div style={styles.statBox}>
            <div style={styles.statNumber}>{profile.stats.daysActive}</div>
            <div style={styles.statLabel}>Days Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;