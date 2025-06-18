import React from 'react';

import Footer from '../components/Footer';
import ReturnPolicyContent from '../components/ReturnPolicyContent'; // ✅ reused content
const ReturnPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
     
     <main className="flex-grow p-4 sm:p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
          <ReturnPolicyContent /> 
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnPolicy;
