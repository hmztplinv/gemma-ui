import axios from 'axios';
const API_URL = 'http://localhost:5130/api';
const API_ENDPOINT = `${API_URL}/quiz`;

/**
 * Fetch a list of quizzes by level
 * @param {string} level - The CEFR level (A1, A2, B1, B2, C1, C2)
 * @returns {Promise<Array>} - Promise that resolves to an array of quiz objects
 */
export const fetchQuizzesByLevel = async (level) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/levels/${level}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};

/**
 * Fetch a specific quiz by ID
 * @param {number} quizId - The ID of the quiz to fetch
 * @returns {Promise<Object>} - Promise that resolves to a quiz object
 */
export const fetchQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/${quizId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

/**
 * Generate a new quiz based on user preferences
 * @param {Object} quizOptions - Options for generating the quiz
 * @param {string} quizOptions.level - CEFR level (default: B1)
 * @param {string} quizOptions.quizType - Type of quiz (default: Vocabulary)
 * @param {number} quizOptions.quizId - Optional specific quiz ID to take
 * @returns {Promise<Object>} - Promise that resolves to a quiz object
 */
export const fetchQuiz = async (quizOptions = {}) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/generate`, quizOptions, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

/**
 * Submit quiz answers and get results
 * @param {Object} submission - The submission data
 * @param {number} submission.quizId - ID of the quiz
 * @param {Array} submission.answers - Array of answer objects
 * @returns {Promise<Object>} - Promise that resolves to a quiz result object
 */
export const submitQuizAnswers = async (submission) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}/submit`, submission, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz answers:', error);
    throw error;
  }
};

/**
 * Fetch quiz results for the current user
 * @returns {Promise<Array>} - Promise that resolves to an array of quiz result objects
 */
export const fetchQuizResults = async () => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/results`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    throw error;
  }
};

/**
 * Fetch detailed quiz result by ID
 * @param {number} resultId - ID of the quiz result
 * @returns {Promise<Object>} - Promise that resolves to a detailed quiz result object
 */
export const fetchQuizResultById = async (resultId) => {
  try {
    const response = await axios.get(`${API_ENDPOINT}/results/${resultId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    throw error;
  }
};