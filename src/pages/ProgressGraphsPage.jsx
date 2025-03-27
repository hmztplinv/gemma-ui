import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';
import userApi from '../api/userApi';
import '../styles/ProgressGraphs.css';

const ProgressGraphsPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [graphType, setGraphType] = useState('activity'); // 'activity', 'vocabulary', 'quiz', 'errors'

  // Define chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        setIsLoading(true);
        // Call API to get progress data
        const data = await userApi.getUserProgressStats(timeRange);
        setProgressData(data);
      } catch (err) {
        console.error('Error fetching progress data:', err);
        setError('Failed to load progress data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
  }, [timeRange]);

  // Mock data for development
  const mockProgressData = {
    activityData: [
      { day: 'Mon', messages: 12, minutes: 15 },
      { day: 'Tue', messages: 19, minutes: 22 },
      { day: 'Wed', messages: 5, minutes: 8 },
      { day: 'Thu', messages: 22, minutes: 30 },
      { day: 'Fri', messages: 18, minutes: 25 },
      { day: 'Sat', messages: 15, minutes: 20 },
      { day: 'Sun', messages: 10, minutes: 14 }
    ],
    weeklyActivity: [
      { week: 'Week 1', messages: 58, minutes: 75 },
      { week: 'Week 2', messages: 82, minutes: 105 },
      { week: 'Week 3', messages: 94, minutes: 125 },
      { week: 'Week 4', messages: 68, minutes: 90 }
    ],
    vocabularyProgress: [
      { date: '01/01', newWords: 5, mastered: 0, total: 5 },
      { date: '01/08', newWords: 8, mastered: 3, total: 13 },
      { date: '01/15', newWords: 10, mastered: 6, total: 23 },
      { date: '01/22', newWords: 7, mastered: 9, total: 30 },
      { date: '01/29', newWords: 12, mastered: 11, total: 42 },
      { date: '02/05', newWords: 9, mastered: 15, total: 51 },
      { date: '02/12', newWords: 14, mastered: 12, total: 65 },
      { date: '02/19', newWords: 6, mastered: 18, total: 71 },
      { date: '02/26', newWords: 11, mastered: 20, total: 82 }
    ],
    quizResults: [
      { date: '01/05', score: 65 },
      { date: '01/12', score: 72 },
      { date: '01/19', score: 68 },
      { date: '01/26', score: 75 },
      { date: '02/02', score: 70 },
      { date: '02/09', score: 78 },
      { date: '02/16', score: 84 },
      { date: '02/23', score: 82 }
    ],
    errorReduction: [
      { date: '01/01', errorRate: 18 },
      { date: '01/08', errorRate: 16 },
      { date: '01/15', errorRate: 17 },
      { date: '01/22', errorRate: 14 },
      { date: '01/29', errorRate: 12 },
      { date: '02/05', errorRate: 13 },
      { date: '02/12', errorRate: 10 },
      { date: '02/19', errorRate: 9 },
      { date: '02/26', errorRate: 8 }
    ],
    vocabularyByLevel: [
      { name: 'A1', value: 38 },
      { name: 'A2', value: 24 },
      { name: 'B1', value: 15 },
      { name: 'B2', value: 5 },
      { name: 'C1', value: 0 },
      { name: 'C2', value: 0 }
    ],
    masteryProgress: {
      total: 82,
      mastered: 38,
      inProgress: 44
    }
  };

  // Use mock data for now
  const displayData = progressData || mockProgressData;

  const renderActivityGraph = () => (
    <div className="chart-container full-width">
      <h2>Daily Activity</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={displayData.activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="messages" name="Messages Sent" fill="#8884d8" />
            <Bar yAxisId="right" dataKey="minutes" name="Minutes Active" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderVocabularyGraph = () => (
    <>
      <div className="chart-container">
        <h2>Vocabulary Growth</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={displayData.vocabularyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="total" name="Total Words" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="mastered" name="Mastered Words" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <h2>Vocabulary by Level</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={displayData.vocabularyByLevel}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {displayData.vocabularyByLevel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} words`, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );

  const renderQuizGraph = () => (
    <div className="chart-container full-width">
      <h2>Quiz Performance</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayData.quizResults}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
            <Legend />
            <Line type="monotone" dataKey="score" name="Quiz Score" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderErrorGraph = () => (
    <div className="chart-container full-width">
      <h2>Error Rate Trend</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={displayData.errorReduction}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, 'Error Rate']} />
            <Legend />
            <Line type="monotone" dataKey="errorRate" name="Error Rate %" stroke="#FF8042" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderProgressSummary = () => {
    const { masteryProgress } = displayData;
    const masteryPercentage = (masteryProgress.mastered / masteryProgress.total * 100).toFixed(0);
    
    return (
      <div className="progress-summary">
        <div className="mastery-card">
          <div className="mastery-title">Vocabulary Mastery</div>
          <div className="mastery-chart">
            <div className="mastery-progress-bar">
              <div 
                className="mastery-progress-fill" 
                style={{ width: `${masteryPercentage}%` }}
              ></div>
            </div>
            <div className="mastery-stats">
              <div>
                <span className="mastery-percent">{masteryPercentage}%</span> mastered
              </div>
              <div className="mastery-counts">
                ({masteryProgress.mastered} / {masteryProgress.total} words)
              </div>
            </div>
          </div>
        </div>
        
        <div className="streak-card">
          <div className="streak-title">Current Streak</div>
          <div className="streak-value">14 days</div>
          <div className="streak-flame">🔥</div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div className="loading">Loading progress data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="progress-graphs-container">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1>Progress Graphs</h1>
      </div>

      {renderProgressSummary()}

      <div className="filter-controls">
        <div className="time-range-filter">
          <div className="filter-label">Time Range:</div>
          <div className="filter-options">
            <button 
              className={`filter-option ${timeRange === 'week' ? 'active' : ''}`}
              onClick={() => setTimeRange('week')}
            >
              Last Week
            </button>
            <button 
              className={`filter-option ${timeRange === 'month' ? 'active' : ''}`}
              onClick={() => setTimeRange('month')}
            >
              Last Month
            </button>
            <button 
              className={`filter-option ${timeRange === 'year' ? 'active' : ''}`}
              onClick={() => setTimeRange('year')}
            >
              Last Year
            </button>
          </div>
        </div>

        <div className="graph-type-filter">
          <div className="filter-label">Graph Type:</div>
          <div className="filter-options">
            <button 
              className={`filter-option ${graphType === 'activity' ? 'active' : ''}`}
              onClick={() => setGraphType('activity')}
            >
              Activity
            </button>
            <button 
              className={`filter-option ${graphType === 'vocabulary' ? 'active' : ''}`}
              onClick={() => setGraphType('vocabulary')}
            >
              Vocabulary
            </button>
            <button 
              className={`filter-option ${graphType === 'quiz' ? 'active' : ''}`}
              onClick={() => setGraphType('quiz')}
            >
              Quiz Performance
            </button>
            <button 
              className={`filter-option ${graphType === 'errors' ? 'active' : ''}`}
              onClick={() => setGraphType('errors')}
            >
              Error Reduction
            </button>
          </div>
        </div>
      </div>

      <div className="graphs-container">
        {graphType === 'activity' && renderActivityGraph()}
        {graphType === 'vocabulary' && renderVocabularyGraph()}
        {graphType === 'quiz' && renderQuizGraph()}
        {graphType === 'errors' && renderErrorGraph()}
      </div>

      <div className="progress-insights">
        <h2>Weekly Insights</h2>
        <div className="insight-card positive">
          <div className="insight-icon">📈</div>
          <div className="insight-content">
            <div className="insight-title">Vocabulary Growth</div>
            <div className="insight-description">
              You've added 20 new words this week, which is 40% more than your weekly average.
            </div>
          </div>
        </div>
        
        <div className="insight-card neutral">
          <div className="insight-icon">⏱️</div>
          <div className="insight-content">
            <div className="insight-title">Study Time</div>
            <div className="insight-description">
              You spent 105 minutes learning this week, which is consistent with your recent activity.
            </div>
          </div>
        </div>
        
        <div className="insight-card positive">
          <div className="insight-icon">🎯</div>
          <div className="insight-content">
            <div className="insight-title">Quiz Performance</div>
            <div className="insight-description">
              Your average quiz score improved by 8% this month.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressGraphsPage;