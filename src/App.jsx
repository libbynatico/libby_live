import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from './services/authService';
import LoginPage from './pages/LoginPage';
import IntakePage from './pages/IntakePage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState('login'); // login, intake, dashboard
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    getCurrentUser().then(user => {
      setUser(user);
      if (user) {
        setPage('dashboard');
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setPage('login');
    setUserProfile(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      {user && (
        <header className="app-header">
          <h1>Libby Live</h1>
          <div className="user-info">
            <span>{user.email}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </header>
      )}

      {page === 'login' && (
        <LoginPage onNavigate={setPage} />
      )}

      {page === 'intake' && user && (
        <IntakePage 
          user={user} 
          onNavigate={setPage}
          onProfileUpdate={setUserProfile}
        />
      )}

      {page === 'dashboard' && user && (
        <DashboardPage 
          user={user}
          profile={userProfile}
        />
      )}
    </div>
  );
}
