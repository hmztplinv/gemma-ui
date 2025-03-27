import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Page components import
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ConversationsPage from './pages/ConversationsPage';
import ConversationDetailPage from './pages/ConversationDetailPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import VocabularyPage from './pages/VocabularyPage';
import QuizPage from './pages/QuizPage';
import QuizHistoryPage from './pages/QuizHistoryPage';
import QuizResultPage from './pages/QuizResultPage';
import ErrorAnalysisPage from './pages/ErrorAnalysisPage';
import ProgressGraphsPage from './pages/ProgressGraphsPage';
import GoalsPage from './pages/GoalsPage';
import BadgesPage from './pages/BadgesPage';

// Style file
import './styles/App.css';

// Auth control custom route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard route */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } />

            {/* Protected routes */}
            <Route path="/conversations" element={
              <PrivateRoute>
                <ConversationsPage />
              </PrivateRoute>
            } />

            <Route path="/conversation/:id" element={
              <PrivateRoute>
                <ConversationDetailPage />
              </PrivateRoute>
            } />

            <Route path="/vocabulary" element={
              <PrivateRoute>
                <VocabularyPage />
              </PrivateRoute>
            } />

            <Route path="/quiz" element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            } />

            {/* Quiz history route */}
            <Route path="/quiz/history" element={
              <PrivateRoute>
                <QuizHistoryPage />
              </PrivateRoute>
            } />

            {/* Add quiz result detail route */}
            <Route path="/quiz/results/:id" element={
              <PrivateRoute>
                <QuizResultPage />
              </PrivateRoute>
            } />

            {/* New feature routes */}
            <Route path="/error-analysis" element={
              <PrivateRoute>
                <ErrorAnalysisPage />
              </PrivateRoute>
            } />

            <Route path="/progress" element={
              <PrivateRoute>
                <ProgressGraphsPage />
              </PrivateRoute>
            } />

            <Route path="/goals" element={
              <PrivateRoute>
                <GoalsPage />
              </PrivateRoute>
            } />

            <Route path="/badges" element={
              <PrivateRoute>
                <BadgesPage />
              </PrivateRoute>
            } />

            <Route path="/profile" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } />

            {/* Redirect from home to conversation if logged in, otherwise to login */}
            <Route path="/" element={
              localStorage.getItem('token')
                ? <Navigate to="/dashboard" />
                : <Navigate to="/login" />
            } />

            {/* Catch all route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;