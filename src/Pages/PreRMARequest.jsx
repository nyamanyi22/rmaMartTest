import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ReturnPolicyContent from '../components/ReturnPolicyContent';

const PreRequest = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (agreed) {
      navigate('/RMARequest'); // Navigate to the actual form
    } else {
      alert('You must agree to the terms before submitting.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-grow p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
          <ReturnPolicyContent />
          <div className="pt-4">
            <label className="inline-flex items-center">
              <input
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
