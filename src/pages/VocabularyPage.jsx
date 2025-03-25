// src/pages/VocabularyPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserApi from '../api/userApi';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import '../styles/vocabulary.css';

import VocabularyItem from '../components/vocabulary/VocabularyItem';

const VocabularyPage = () => {
  const [vocabulary, setVocabulary] = useState([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeLevel, setActiveLevel] = useState('all');
  const [viewMode, setViewMode] = useState('list');

  const levels = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVocabulary.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVocabulary.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleUpdateWord = async (wordId, updateData) => {
    try {
      await UserApi.updateVocabularyItem(wordId, updateData);
      // Güncellenmiş verileri yükle
      const updatedData = await UserApi.getUserVocabulary();
      setVocabulary(updatedData);
      setFilteredVocabulary(updatedData);
    } catch (err) {
      setError('Failed to update vocabulary item');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        const data = await UserApi.getUserVocabulary();
        setVocabulary(data);
        setFilteredVocabulary(data);
      } catch (err) {
        setError('Error loading vocabulary list');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, []);

  useEffect(() => {
    let result = [...vocabulary];

    if (activeLevel !== 'all') {
      result = result.filter(item => item.level === activeLevel);
    }

    if (searchTerm) {
      result = result.filter(item =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.translation && item.translation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredVocabulary(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [vocabulary, activeLevel, searchTerm]);

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="vocabulary-container">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
        <h1>My Vocabulary</h1>
      </div>

      <div className="vocabulary-stats">
        <div className="stats-cards">
          <div className="stat-card">
            <h3>Total Words</h3>
            <div className="stat-value">{vocabulary.length}</div>
          </div>

          <div className="stat-card">
            <h3>Learned</h3>
            <div className="stat-value">
              {vocabulary.filter(item => item.isMastered).length}
            </div>
          </div>
        </div>
      </div>

      <div className="vocabulary-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search words..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'flashcards' ? 'active' : ''}`}
            onClick={() => setViewMode('flashcards')}
          >
            Flashcards
          </button>
        </div>
      </div>

      <div className="level-filters">
        {levels.map(level => (
          <button
            key={level}
            className={`level-btn ${activeLevel === level ? 'active' : ''}`}
            onClick={() => setActiveLevel(level)}
          >
            {level === 'all' ? 'All' : level}
          </button>
        ))}
      </div>

      {viewMode === 'list' ? (
        filteredVocabulary.length > 0 ? (
          <>
            <div className="vocabulary-list">
              <table>
                <thead>
                  <tr>
                    <th>Word</th>
                    <th>Translation</th>
                    <th>Level</th>
                    <th>Encounters</th>
                    <th>Correct Usage</th>
                    <th>Last Seen</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map(item => (
                    <VocabularyItem
                      key={item.id}
                      word={item}
                      onUpdate={handleUpdateWord}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="page-btn"
              >
                Previous
              </button>
              
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              
              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="no-results">
            <p>No words matching these criteria were found.</p>
          </div>
        )
      ) : (
        <div className="flashcards-container">
          {filteredVocabulary.length > 0 ? (
            <p>Flashcard view will be implemented here</p>
          ) : (
            <p>No words available for flashcards.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularyPage;