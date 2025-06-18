// src/components/ReturnPolicyContent.jsx
import React from 'react';
import Header from './Top';
import '../styles/ReturnPolicy.css';

const ReturnPolicyContent = () => (
  <div className="return-policy">
    <Header />
    <h1>Product Return Policy</h1>

    <p>
      You may return an item within 30 days from ship date for a refund or replacement.
      Items must be in original packaging with all tags and stickers attached.
      All returns require a Return Material Authorization (RMA) number. 
      Returns without RMA will not be processed.
    </p>

    <section>
      <h2>Return Process</h2>
      <ol>
        <li><strong>Create an RMA Request:</strong> Log in to our RMA portal.</li>
        <li><strong>Describe Your Reason:</strong> Clearly state the reason for returning the item.</li>
        <li><strong>Wait for Approval:</strong> Do not ship the item until you receive your RMA number.</li>
        <li><strong>Ship Your Item:</strong> Include the RMA form and packaging slip in your package.</li>
        <li><strong>Track Your Return:</strong> Monitor return status by logging in.</li>
      </ol>
    </section>

    <section>
      <h2>Important Notes</h2>
      <ul>
        <li>Electronics must be factory-sealed. Broken seals void eligibility.</li>
        <li>Items must be returned in original manufacturer packaging.</li>
        <li>Keep packaging for at least 90 days post-purchase.</li>
      </ul>
    </section>

    <div className="help-box">
      <h3>Need Help?</h3>
      <p>
        Contact our support team at{' '}
        <a href="mailto:support@martnetworks.com">
          support@martnetworks.com
        </a>
      </p>
    </div>
  </div>
);

export default ReturnPolicyContent;