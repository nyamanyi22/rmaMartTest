// src/pages/customers/CreateCustomer.jsx
import AdminCustomerForm from './AdminCustomerForm'; // Import the reusable form
import { createCustomer } from '../../api/CustomerService'; // Import API service
import React, { useState } from 'react';
import MessageModal from '../../Components/MessageModal';
import { useNavigate } from 'react-router-dom';
import './styles/CustomerList.css'; // Import styles for the customer list
// Path to your reusable form


const CreateCustomer = () => {
  const navigate = useNavigate();

  const initialFormData = {
    accountNo: '',
    companyName: '',
    website: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
  

    shippingCountry: '',
    shippingState: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingZipcode: '',
    shippingPhone: '',
    shippingFax: '',

    billingDifferentFromShipping: false,
    billingCountry: '',
    billingState: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingZipcode: '',
    billingPhone: '',
    billingFax: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isNotCompany, setIsNotCompany] = useState(false);
  const [isBillingAddressDifferent, setIsBillingAddressDifferent] = useState(false);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value.trim() }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === 'isNotCompany') {
      setIsNotCompany(checked);
      if (checked) {
        setFormData(prevData => ({ ...prevData, companyName: '', website: '' }));
        setErrors(prevErrors => ({ ...prevErrors, companyName: '', website: '' }));
      }
    } else if (name === 'isBillingAddressDifferent') {
      setIsBillingAddressDifferent(checked);
      if (!checked) {
        setFormData(prevData => ({
          ...prevData,
          billingAddress1: '', billingAddress2: '', billingCity: '',
          billingState: '', billingZipcode: '', billingCountry: '',
          billingPhone: '', billingFax: '',
        }));
        setErrors(prevErrors => ({
          ...prevErrors,
          billingAddress1: '', billingAddress2: '', billingCity: '',
          billingState: '', billingZipcode: '', billingCountry: '',
          billingPhone: '', billingFax: '',
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const {
      companyName, website, firstName, lastName, email,
      shippingAddress1, shippingCity, shippingState, shippingZipcode, shippingCountry, shippingPhone,
      password, password_confirmation,
      billingAddress1, billingCity, billingState, billingZipcode, billingCountry, billingPhone
    } = formData;

    // -- Company Validation --
    if (!isNotCompany && !companyName?.trim()) {
      newErrors.companyName = 'Company name is required if not "Not a company".';
    }
    // Website validation using URL constructor
    if (website) {
      try {
        new URL(website);
      } catch (e) {
        newErrors.website = 'Invalid website URL format.';
      }
    }

    // -- Personal Info Validation --
    if (!firstName?.trim()) newErrors.firstName = 'First name is required.';
    if (!lastName?.trim()) newErrors.lastName = 'Last name is required.';

    if (!email?.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format.';
    }

    // Password validation (for create mode)
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = 'Password needs 8+ chars with upper/lowercase and numbers.';
    }
    if (!password_confirmation) {
      newErrors.password_confirmation = 'Confirm password.';
    } else if (password !== password_confirmation) {
      newErrors.password_confirmation = 'Passwords don\'t match.';
    }

    // -- Shipping Address Validation --
    if (!shippingCountry || shippingCountry === "- Select country -") newErrors.shippingCountry = 'Shipping Country is required.';
    if (!shippingAddress1?.trim()) newErrors.shippingAddress1 = 'Shipping Address 1 is required.';
    if (!shippingCity?.trim()) newErrors.shippingCity = 'Shipping City is required.';
    if (!shippingState?.trim()) newErrors.shippingState = 'Shipping State is required.';
    if (!shippingZipcode?.trim()) newErrors.shippingZipcode = 'Shipping Zipcode is required.';
    if (!shippingPhone?.trim()) {
      newErrors.shippingPhone = 'Shipping Phone number is required.';
    } else if (!/^\d{7,}$/.test(shippingPhone)) {
      newErrors.shippingPhone = 'Invalid shipping phone number (min 7 digits).';
    }

    // -- Conditional Billing Address Validation --
    if (isBillingAddressDifferent) {
      if (!billingCountry || billingCountry === "- Select country -") newErrors.billingCountry = 'Billing Country is required.';
      if (!billingAddress1?.trim()) newErrors.billingAddress1 = 'Billing Address 1 is required.';
      if (!billingCity?.trim()) newErrors.billingCity = 'Billing City is required.';
      if (!billingState?.trim()) newErrors.billingState = 'Billing State is required.';
      if (!billingZipcode?.trim()) newErrors.billingZipcode = 'Billing Zipcode is required.';
      if (!billingPhone?.trim()) {
        newErrors.billingPhone = 'Billing Phone number is required.';
      } else if (!/^\d{7,}$/.test(billingPhone)) {
        newErrors.billingPhone = 'Invalid billing phone number (min 7 digits).';
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModal(null);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setModal({ message: 'Please correct the highlighted errors.', type: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const apiData = {
        account_no: formData.accountNo,
        company_name: isNotCompany ? null : formData.companyName,
        website: formData.website,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
       

        shipping_country: formData.shippingCountry,
        shipping_state: formData.shippingState,
        shipping_address1: formData.shippingAddress1,
        shipping_address2: formData.shippingAddress2,
        shipping_city: formData.shippingCity,
        shipping_zipcode: formData.shippingZipcode,
        shipping_phone: formData.shippingPhone,
        shipping_fax: formData.shippingFax,

        billing_address1: isBillingAddressDifferent ? formData.billingAddress1 : formData.shippingAddress1,
        billing_address2: isBillingAddressDifferent ? formData.billingAddress2 : formData.shippingAddress2,
        billing_city: isBillingAddressDifferent ? formData.billingCity : formData.shippingCity,
        billing_state: isBillingAddressDifferent ? formData.billingState : formData.shippingState,
        billing_zipcode: isBillingAddressDifferent ? formData.billingZipcode : formData.shippingZipcode,
        billing_country: isBillingAddressDifferent ? formData.billingCountry : formData.shippingCountry,
        billing_phone: isBillingAddressDifferent ? formData.billingPhone : formData.shippingPhone,
        billing_fax: isBillingAddressDifferent ? formData.billingFax : formData.shippingFax,
      };

      const response = await createCustomer(apiData);

      setModal({ message: response.message || 'Customer created successfully!', type: 'success' });
      setFormData(initialFormData);
      setIsNotCompany(false);
      setIsBillingAddressDifferent(false);
      setErrors({});

      setTimeout(() => navigate('admin/create'), 1500);

    } catch (error) {
      console.error("Error creating customer:", error);
      let errorMessage = 'An unexpected error occurred.';
      const backendErrors = {};

      if (error.response) {
        if (error.response.status === 422 && error.response.data.errors) {
          Object.entries(error.response.data.errors).forEach(([key, value]) => {
            const frontendKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
            backendErrors[frontendKey] = Array.isArray(value) ? value[0] : value;
          });
          errorMessage = 'Please correct the highlighted errors.';
        } else {
          errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error: No response from server. Check your connection.';
      }

      setErrors(backendErrors);
      setModal({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => setModal(null);

  return (
    <AdminCustomerForm
      formData={formData}
      handleChange={handleChange}
      handleCheckboxChange={handleCheckboxChange}
      errors={errors}
      isEditMode={false}
      isNotCompany={isNotCompany}
      isBillingAddressDifferent={isBillingAddressDifferent}
      handleSubmit={handleSubmit}
      modal={modal}
      closeModal={closeModal}
      isSubmitting={isSubmitting}
    />
  );
};

export default CreateCustomer;
