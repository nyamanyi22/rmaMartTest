import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TopBar = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="top-bar">
      <div className="container">
        <div className="auth-links">
          {isAuthenticated ? (
            <div className="user-info">
              <span className="user-email">{user?.email}</span>
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-link login">
                Login
              </Link>
              <Link to="/signup" className="auth-link signup">
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;s