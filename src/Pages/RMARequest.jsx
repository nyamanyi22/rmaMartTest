import '../styles/RMA.css';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const RMAPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [confirmationData, setConfirmationData] = useState(null);

  const [formData, setFormData] = useState({
    productCode: '',
    description: '',
    serialNumber: '',
    quantity: 1,
    invoiceDate: '',
    salesDocumentNo: '',
    returnReason: '',
    problemDescription: '',
    photo: null
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email,
      }));
    }
  }, [isAuthenticated, user]);

  if (confirmationData) {
    return (
      <div className="rma-confirmation">
        <div className="rma-card">
          <div className="rma-success-icon">✓</div>
          <h2 className="rma-title">RMA Request Submitted Successfully!</h2>
          <p className="rma-subtitle">Your RMA number: <strong>{confirmationData.rmaNumber}</strong></p>

          <div className="rma-details">
            <h3>Request Details:</h3>
            <p><strong>Product:</strong> {confirmationData.productCode}</p>
            <p><strong>Serial Number:</strong> {confirmationData.serialNumber}</p>
            <p><strong>Reason:</strong> {confirmationData.returnReason}</p>
            {confirmationData.estimatedResolution && (
              <p><strong>Estimated Resolution:</strong> {confirmationData.estimatedResolution}</p>
            )}
          </div>

          <button onClick={() => navigate('/')} className="rma-button">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="rma-warning">
        <p className="rma-error">You must be logged in to submit an RMA request.</p>
        <button
          onClick={() => navigate('/login', { state: { from: '/rma' } })}
          className="rma-button"
        >
          Login here
        </button>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    if (!formData.productCode) errors.productCode = 'Product code is required';
    if (!formData.serialNumber) errors.serialNumber = 'Serial number is required';
    if (!formData.invoiceDate) errors.invoiceDate = 'Invoice date is required';
    if (!formData.salesDocumentNo) errors.salesDocumentNo = 'Sales document number is required';
    if (!formData.returnReason) errors.returnReason = 'Please select a return reason';
    if (!formData.problemDescription) errors.problemDescription = 'Problem description is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, photo: null });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formPayload.append(key, value);
        }
      });

      formPayload.append('userId', user.id);
      formPayload.append('userEmail', user.email);
      formPayload.append('userName', `${user.first_name} ${user.last_name}`);

      const response = await axios.post('http://127.0.0.1:8000/api/rma', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.data.success) {
        setConfirmationData({
          ...response.data,
          ...formData
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rma-form-container">
      <div className="rma-form-card">
        <h2 className="rma-form-title">RMA Request Form</h2>
        {error && <div className="rma-error-box">{error}</div>}
        <form onSubmit={handleSubmit} className="rma-form">
          <div className="rma-grid">
            <div>
              <label>Your Email</label>
              <input type="email" value={user.email} readOnly />
            </div>
            <div>
              <label>Your Name</label>
              <input type="text" value={`${user.first_name || ''} ${user.last_name || ''}`.trim()} readOnly />
            </div>
          </div>
          <div className="rma-grid">
            <div>
              <label>Product Code*</label>
              <input name="productCode" value={formData.productCode} onChange={handleChange} />
              {formErrors.productCode && <span className="rma-error-text">{formErrors.productCode}</span>}
            </div>
            <div>
              <label>Description</label>
              <input name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div>
              <label>Serial Number*</label>
              <input name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
              {formErrors.serialNumber && <span className="rma-error-text">{formErrors.serialNumber}</span>}
            </div>
            <div>
              <label>Quantity*</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
            </div>
            <div>
              <label>Invoice Date*</label>
              <input type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleChange} />
              {formErrors.invoiceDate && <span className="rma-error-text">{formErrors.invoiceDate}</span>}
            </div>
            <div>
              <label>Sales Document No.*</label>
              <input name="salesDocumentNo" value={formData.salesDocumentNo} onChange={handleChange} />
              {formErrors.salesDocumentNo && <span className="rma-error-text">{formErrors.salesDocumentNo}</span>}
            </div>
          </div>
          <div>
            <label>Reason for Returning*</label>
            <select name="returnReason" value={formData.returnReason} onChange={handleChange}>
              <option value="">Select a reason</option>
              <option value="defective">Defective Item</option>
              <option value="wrong-item">Wrong Item Shipped</option>
              <option value="damaged">Damaged on Arrival</option>
              <option value="other">Other</option>
            </select>
            {formErrors.returnReason && <span className="rma-error-text">{formErrors.returnReason}</span>}
          </div>
          <div>
            <label>Detailed Problem Description*</label>
            <textarea name="problemDescription" value={formData.problemDescription} onChange={handleChange}></textarea>
            {formErrors.problemDescription && <span className="rma-error-text">{formErrors.problemDescription}</span>}
          </div>
          <div>
            <label>Upload Photo (optional)</label>
            {imagePreview ? (
              <div>
                <img src={imagePreview} alt="Preview" className="rma-image-preview" />
                <button type="button" onClick={removeImage} className="rma-remove-button">Remove Image</button>
              </div>
            ) : (
              <input ref={fileInputRef} type="file" name="photo" onChange={handleImageChange} accept="image/*" />
            )}
          </div>
          <button type="submit" disabled={isSubmitting} className="rma-button">
            {isSubmitting ? 'Submitting...' : 'Submit RMA Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RMAPage;
