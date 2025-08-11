import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import ReturnPolicyContent from '../components/ReturnPolicyContent';

const PreRequest = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuth();

  useEffect(() => {
    // Fetch the user on first load if not already fetched
    if (!isLoading && !user) {
      fetchUser();
    }
  }, [isLoading, user, fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  const handleSubmit = () => {
    if (agreed) {
      navigate('/RMARequest');
    } else {
      alert('You must agree to the terms before submitting.');
    }
  };

  if (isLoading || !user) {
    return <div className="p-6 text-center text-gray-600">Checking authentication...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-grow p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
          <ReturnPolicyContent />
          <div className="pt-4">
            <label htmlFor="agree" className="inline-flex items-center">
              <input
                id="agree"
                type="checkbox"
                className="form-checkbox mr-2"
                checked={agreed}
                onChange={() => setAgreed(!agreed)}
              />
              <span className="text-sm font-medium">
                I agree to Terms and Conditions and Returns Policy
              </span>
            </label>
          </div>
          <button
            onClick={handleSubmit}
            className={`mt-4 px-6 py-2 rounded text-white font-semibold ${
              agreed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!agreed}
          >
            Submit
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreRequest;
