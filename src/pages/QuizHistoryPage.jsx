import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizResults } from '../api/quizApi';
import { BarChart2, Calendar, Award, Search, Filter, ChevronRight } from 'lucide-react';
import '../styles/QuizHistoryPage.css';

const QuizHistoryPage = () => {
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizHistory = async () => {
      try {
        setLoading(true);
        const results = await fetchQuizResults();
        setQuizHistory(results);
        setLoading(false);
      } catch (err) {
        setError('Quiz geçmişi yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    loadQuizHistory();
  }, []);

  // Filtreleme işlemleri
  const filteredHistory = quizHistory.filter(quiz => {
    const matchesSearch = quiz.quizTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || quiz.quizLevel === selectedLevel;
    return matchesSearch && matchesLevel;
  });
  
  const getScoreBadgeColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };
  
  // Quiz başına ortalama skor hesaplama
  const calculateAverageScore = () => {
    if (quizHistory.length === 0) return 0;
    const totalScore = quizHistory.reduce((sum, quiz) => sum + quiz.score, 0);
    return Math.round(totalScore / quizHistory.length);
  };
  
  // Seviye bazında quiz sayıları
  const getLevelCounts = () => {
    const counts = quizHistory.reduce((acc, quiz) => {
      acc[quiz.quizLevel] = (acc[quiz.quizLevel] || 0) + 1;
      return acc;
    }, {});
    return counts;
  };
  
  const levelCounts = getLevelCounts();

  const handleViewDetails = (quizId) => {
    // Quiz detaylarını görüntüleme için ilgili rotaya yönlendir
    navigate(`/quiz/results/${quizId}`);
  };

  if (loading) {
    return <div className="loading">Quiz geçmişi yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          Panele Dön
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Quiz Geçmişim</h1>
      
      {/* Özet istatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Award className="text-blue-500 mr-2" size={20} />
            <h3 className="font-medium">Toplam Quiz</h3>
          </div>
          <p className="text-2xl font-bold">{quizHistory.length}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <BarChart2 className="text-green-500 mr-2" size={20} />
            <h3 className="font-medium">Ortalama Skor</h3>
          </div>
          <p className="text-2xl font-bold">{calculateAverageScore()}%</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Calendar className="text-purple-500 mr-2" size={20} />
            <h3 className="font-medium">Son Quiz</h3>
          </div>
          <p className="text-2xl font-bold">{quizHistory.length > 0 ? formatDate(quizHistory[0].completedAt) : '-'}</p>
        </div>
      </div>
      
      {/* Filtreleme araçları */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Quiz ara..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">Tüm Seviyeler</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Seviye bazlı istatistikler */}
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(levelCounts).map(([level, count]) => (
            <span 
              key={level}
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                ${selectedLevel === level ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
              onClick={() => setSelectedLevel(level === selectedLevel ? 'all' : level)}
              style={{cursor: 'pointer'}}
            >
              {level}: {count} quiz
            </span>
          ))}
        </div>
      </div>
      
      {/* Quiz listesi */}
      {filteredHistory.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredHistory.map((quiz, index) => (
            <div 
              key={quiz.id} 
              className={`p-4 flex flex-col md:flex-row md:items-center justify-between ${
                index !== filteredHistory.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <div className="flex-1 mb-2 md:mb-0">
                <h3 className="font-medium text-lg">{quiz.quizTitle}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <span className="mr-3">{formatDate(quiz.completedAt)}</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium">
                    {quiz.quizLevel}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`flex items-center mr-4 px-2.5 py-1 rounded-full text-sm font-medium border ${getScoreBadgeColor(quiz.score)}`}>
                  <span className="mx-1">{quiz.score}%</span>
                </div>
                
                <button 
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => handleViewDetails(quiz.id)}
                >
                  Detaylar <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">Arama kriterlerinize uygun quiz bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default QuizHistoryPage;