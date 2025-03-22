import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userApi from '../api/userApi';
import '../styles/VocabularyPage.css';

const VocabularyPage = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy] = useState('lastEncountered');
  const [sortDirection, setSortDirection] = useState('desc');

  // Mock data in case the API isn't ready
  const mockVocabulary = [
    { id: 1, word: 'hello', translation: 'merhaba', level: 'A1', timesEncountered: 15, timesCorrectlyUsed: 12, lastEncounteredAt: '2023-03-20T12:34:56', isMastered: true },
    { id: 2, word: 'goodbye', translation: 'hoşça kal', level: 'A1', timesEncountered: 12, timesCorrectlyUsed: 10, lastEncounteredAt: '2023-03-19T10:30:00', isMastered: true },
    { id: 3, word: 'please', translation: 'lütfen', level: 'A1', timesEncountered: 10, timesCorrectlyUsed: 8, lastEncounteredAt: '2023-03-18T14:22:33', isMastered: false },
    { id: 4, word: 'thank you', translation: 'teşekkür ederim', level: 'A1', timesEncountered: 18, timesCorrectlyUsed: 15, lastEncounteredAt: '2023-03-21T09:12:45', isMastered: true },
    { id: 5, word: 'excuse me', translation: 'affedersiniz', level: 'A1', timesEncountered: 8, timesCorrectlyUsed: 5, lastEncounteredAt: '2023-03-17T16:45:20', isMastered: false },
    { id: 6, word: 'congratulations', translation: 'tebrikler', level: 'A2', timesEncountered: 5, timesCorrectlyUsed: 3, lastEncounteredAt: '2023-03-16T11:30:15', isMastered: false },
    { id: 7, word: 'experience', translation: 'deneyim', level: 'B1', timesEncountered: 7, timesCorrectlyUsed: 4, lastEncounteredAt: '2023-03-15T13:40:25', isMastered: false },
    { id: 8, word: 'opportunity', translation: 'fırsat', level: 'B1', timesEncountered: 6, timesCorrectlyUsed: 3, lastEncounteredAt: '2023-03-14T10:20:30', isMastered: false },
    { id: 9, word: 'development', translation: 'gelişim', level: 'B2', timesEncountered: 4, timesCorrectlyUsed: 2, lastEncounteredAt: '2023-03-13T09:15:40', isMastered: false },
    { id: 10, word: 'sophisticated', translation: 'sofistike', level: 'C1', timesEncountered: 2, timesCorrectlyUsed: 1, lastEncounteredAt: '2023-03-12T16:25:10', isMastered: false },
  ];

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        setIsLoading(true);
        // Try to fetch from API
        let data;
        try {
          data = await userApi.getUserVocabulary();
        } catch (apiError) {
          console.warn('API Error, using mock data:', apiError);
          // Fall back to mock data if API fails
          data = mockVocabulary;
        }
        setVocabulary(data);
        setFilteredVocabulary(data);
      } catch (error) {
        console.error('Error fetching vocabulary:', error);
        setError('Failed to load vocabulary. Please try again.');
        // Still use mock data as fallback
        setVocabulary(mockVocabulary);
        setFilteredVocabulary(mockVocabulary);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVocabulary();
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let result = [...vocabulary];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(item => 
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.translation && item.translation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by level
    if (filterLevel !== 'all') {
      result = result.filter(item => item.level === filterLevel);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'word':
          comparison = a.word.localeCompare(b.word);
          break;
        case 'level':
          comparison = a.level.localeCompare(b.level);
          break;
        case 'timesEncountered':
          comparison = a.timesEncountered - b.timesEncountered;
          break;
        case 'mastery':
          comparison = (a.timesCorrectlyUsed / a.timesEncountered) - (b.timesCorrectlyUsed / b.timesEncountered);
          break;
        case 'lastEncountered':
        default:
          comparison = new Date(a.lastEncounteredAt) - new Date(b.lastEncounteredAt);
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredVocabulary(result);
  }, [vocabulary, searchTerm, filterLevel, sortBy, sortDirection]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterLevel(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const calculateMasteryPercentage = (item) => {
    if (item.timesEncountered === 0) return 0;
    return Math.round((item.timesCorrectlyUsed / item.timesEncountered) * 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLevelClass = (level) => {
    switch (level) {
      case 'A1': return 'level-a1';
      case 'A2': return 'level-a2';
      case 'B1': return 'level-b1';
      case 'B2': return 'level-b2';
      case 'C1': return 'level-c1';
      case 'C2': return 'level-c2';
      default: return '';
    }
  };

  if (isLoading) {
    return <div className="loading">Loading vocabulary...</div>;
  }

  if (error && vocabulary.length === 0) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="vocabulary-page">
      <div className="vocabulary-header">
        <h1>Your Vocabulary</h1>
        <Link to="/profile" className="back-button">
          ← Back to Profile
        </Link>
      </div>
      
      <div className="vocabulary-card">
        <div className="vocabulary-summary">
          <div className="summary-stat">
            <div className="summary-value">{vocabulary.length}</div>
            <div className="summary-label">Total Words</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-value">
              {vocabulary.filter(item => item.isMastered).length}
            </div>
            <div className="summary-label">Mastered</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-value">
              {vocabulary.filter(item => item.level === 'A1' || item.level === 'A2').length}
            </div>
            <div className="summary-label">Beginner</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-value">
              {vocabulary.filter(item => item.level === 'B1' || item.level === 'B2').length}
            </div>
            <div className="summary-label">Intermediate</div>
          </div>
          
          <div className="summary-stat">
            <div className="summary-value">
              {vocabulary.filter(item => item.level === 'C1' || item.level === 'C2').length}
            </div>
            <div className="summary-label">Advanced</div>
          </div>
        </div>
        
        <div className="vocabulary-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="filter-controls">
            <select value={filterLevel} onChange={handleFilterChange}>
              <option value="all">All Levels</option>
              <option value="A1">A1 - Beginner</option>
              <option value="A2">A2 - Elementary</option>
              <option value="B1">B1 - Intermediate</option>
              <option value="B2">B2 - Upper Intermediate</option>
              <option value="C1">C1 - Advanced</option>
              <option value="C2">C2 - Proficient</option>
            </select>
            
            <select value={sortBy} onChange={handleSortChange}>
              <option value="lastEncountered">Sort by Last Used</option>
              <option value="word">Sort by Word</option>
              <option value="level">Sort by Level</option>
              <option value="timesEncountered">Sort by Frequency</option>
              <option value="mastery">Sort by Mastery</option>
            </select>
            
            <button className="sort-direction-btn" onClick={toggleSortDirection}>
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
        
        <div className="vocabulary-table-container">
          <table className="vocabulary-table">
            <thead>
              <tr>
                <th>Word</th>
                <th>Translation</th>
                <th>Level</th>
                <th>Times Used</th>
                <th>Mastery</th>
                <th>Last Used</th>
              </tr>
            </thead>
            <tbody>
              {filteredVocabulary.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">
                    No vocabulary words found with these filters.
                  </td>
                </tr>
              ) : (
                filteredVocabulary.map(item => (
                  <tr key={item.id} className={item.isMastered ? 'mastered-word' : ''}>
                    <td>{item.word}</td>
                    <td>{item.translation}</td>
                    <td>
                      <span className={`level-badge ${getLevelClass(item.level)}`}>
                        {item.level}
                      </span>
                    </td>
                    <td>{item.timesEncountered}</td>
                    <td>
                      <div className="mastery-bar">
                        <div 
                          className="mastery-progress"
                          style={{ width: `${calculateMasteryPercentage(item)}%` }}
                        ></div>
                        <span className="mastery-percentage">
                          {calculateMasteryPercentage(item)}%
                        </span>
                      </div>
                    </td>
                    <td>{formatDate(item.lastEncounteredAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;