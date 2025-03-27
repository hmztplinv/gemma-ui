import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import userApi from '../api/userApi';
import '../styles/ErrorAnalysis.css';

const ErrorAnalysisPage = () => {
  const { user } = useAuth();
  const [errorData, setErrorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'all'

  // Define colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  useEffect(() => {
    const fetchErrorAnalysis = async () => {
      try {
        setIsLoading(true);
        // Call the API to get error analysis data
        const data = await userApi.getUserErrorAnalysis(timeRange);
        setErrorData(data);
      } catch (err) {
        console.error('Error fetching error analysis:', err);
        setError('Failed to load error analysis data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrorAnalysis();
  }, [timeRange]);

  // Mock data for development purposes
  const mockErrorData = {
    totalErrors: 157,
    errorCategories: [
      { name: 'Grammar', count: 68 },
      { name: 'Vocabulary', count: 42 },
      { name: 'Spelling', count: 27 },
      { name: 'Punctuation', count: 13 },
      { name: 'Word Order', count: 7 }
    ],
    topErrorTypes: [
      { name: 'Subject-Verb Agreement', count: 24, category: 'Grammar' },
      { name: 'Article Usage', count: 19, category: 'Grammar' },
      { name: 'Word Choice', count: 17, category: 'Vocabulary' },
      { name: 'Verb Tense', count: 15, category: 'Grammar' },
      { name: 'Preposition Usage', count: 12, category: 'Grammar' }
    ],
    monthlyTrends: [
      { month: 'Jan', errors: 42, corrections: 38 },
      { month: 'Feb', errors: 38, corrections: 35 },
      { month: 'Mar', errors: 31, corrections: 30 },
      { month: 'Apr', errors: 28, corrections: 27 },
      { month: 'May', errors: 18, corrections: 18 }
    ],
    errorImprovement: {
      previousPeriod: 87,
      currentPeriod: 70,
      percentageChange: -19.5
    }
  };

  // Use mock data for now until the API is implemented
  const displayData = errorData || mockErrorData;

  // Calculate percentages for pie chart
  const totalErrors = displayData.errorCategories.reduce((sum, item) => sum + item.count, 0);
  
  const formatPercentage = (value) => {
    return `${Math.round(value)}%`;
  };

  if (isLoading) {
    return <div className="loading">Loading error analysis...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="error-analysis-container">
      <div className="page-header">
        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
        <h1>Error Analysis</h1>
      </div>

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
            className={`filter-option ${timeRange === 'all' ? 'active' : ''}`}
            onClick={() => setTimeRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-title">Total Errors</div>
          <div className="card-value">{displayData.totalErrors}</div>
        </div>
        <div className="summary-card">
          <div className="card-title">Improvement</div>
          <div className={`card-value ${displayData.errorImprovement.percentageChange < 0 ? 'positive' : 'negative'}`}>
            {Math.abs(displayData.errorImprovement.percentageChange)}%
            {displayData.errorImprovement.percentageChange < 0 ? ' fewer errors' : ' more errors'}
          </div>
        </div>
      </div>

      <div className="error-charts">
        <div className="chart-container">
          <h2>Error Categories</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={displayData.errorCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${formatPercentage(percent * 100)}`}
                >
                  {displayData.errorCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} errors`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <h2>Top Error Types</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={displayData.topErrorTypes}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} errors`, 'Count']} />
                <Legend />
                <Bar dataKey="count" name="Number of Errors" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container full-width">
          <h2>Monthly Error Trends</h2>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={displayData.monthlyTrends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}`, 'Count']} />
                <Legend />
                <Bar dataKey="errors" name="Errors Made" fill="#FF8042" />
                <Bar dataKey="corrections" name="Corrections Applied" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="error-details">
        <h2>Detailed Error Breakdown</h2>
        <div className="error-table-container">
          <table className="error-table">
            <thead>
              <tr>
                <th>Error Type</th>
                <th>Category</th>
                <th>Frequency</th>
                <th>Example</th>
                <th>Correction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Subject-Verb Agreement</td>
                <td>Grammar</td>
                <td className="frequency-cell high">High</td>
                <td>"He work at the office"</td>
                <td>"He works at the office"</td>
              </tr>
              <tr>
                <td>Article Usage</td>
                <td>Grammar</td>
                <td className="frequency-cell high">High</td>
                <td>"I went to hospital"</td>
                <td>"I went to the hospital"</td>
              </tr>
              <tr>
                <td>Word Choice</td>
                <td>Vocabulary</td>
                <td className="frequency-cell medium">Medium</td>
                <td>"I am very preoccupied with work"</td>
                <td>"I am very busy with work"</td>
              </tr>
              <tr>
                <td>Verb Tense</td>
                <td>Grammar</td>
                <td className="frequency-cell medium">Medium</td>
                <td>"I live here since 2010"</td>
                <td>"I have lived here since 2010"</td>
              </tr>
              <tr>
                <td>Preposition Usage</td>
                <td>Grammar</td>
                <td className="frequency-cell medium">Medium</td>
                <td>"I arrived to the station"</td>
                <td>"I arrived at the station"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="improvement-suggestions">
        <h2>Suggested Focus Areas</h2>
        <ul className="suggestion-list">
          <li>
            <div className="suggestion-header">Subject-Verb Agreement</div>
            <div className="suggestion-content">
              Practice with exercises focusing on matching subjects with correct verb forms, especially with third-person singular subjects.
            </div>
          </li>
          <li>
            <div className="suggestion-header">Article Usage</div>
            <div className="suggestion-content">
              Review rules for when to use 'a', 'an', 'the', or no article. Consider taking a focused quiz on articles.
            </div>
          </li>
          <li>
            <div className="suggestion-header">Present Perfect vs Simple Past</div>
            <div className="suggestion-content">
              The verb tense errors suggest you might benefit from reviewing the distinction between these two tenses.
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorAnalysisPage;