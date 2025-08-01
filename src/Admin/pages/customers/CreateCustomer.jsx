// src/pages/customers/CreateCustomer.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminCustomerForm from './AdminCustomerForm'; // Import the reusable form
import { createCustomer } from '../../api/CustomerService'; // Import API service
import './styles/CustomerList.css'; // Import the CSS for styling

const CreateCustomer = () => {
    const navigate = useNavigate();

    const initialFormData = {
        accountNo: '', // This will be displayed but disabled in AdminCustomerForm for create mode
        companyName: '',
        website: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password_confirmation: '',

        // Primary contact fields
        phone: '',
        fax: '',

        // Shipping Address fields
        shippingCountry: '',
        shippingState: '',
        shippingAddress1: '',
        shippingAddress2: '',
        shippingCity: '',
        shippingZipcode: '',

        // Billing Address fields (conditional, without billingPhone and billingFax)
        billingAddress1: '',
        billingAddress2: '',
        billingCity: '',
        billingState: '',
        billingZipcode: '',
        billingCountry: '',
        
        verificationKey: '' // Optional field
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isNotCompany, setIsNotCompany] = useState(false);
    const [isBillingAddressDifferent, setIsBillingAddressDifferent] = useState(false);
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handles changes for regular text inputs and select fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value.trim() }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error on change
    };

    // Handles changes specifically for checkbox inputs
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        if (name === 'isNotCompany') {
            setIsNotCompany(checked);
            if (checked) {
                // Clear company related fields if "Not a Company" is checked
                setFormData(prevData => ({ ...prevData, companyName: '', website: '' }));
                setErrors(prevErrors => ({ ...prevErrors, companyName: '', website: '' }));
            }
        } else if (name === 'isBillingAddressDifferent') {
            setIsBillingAddressDifferent(checked);
            if (!checked) {
                // Clear billing address fields if billing address is no longer different
                setFormData(prevData => ({
                    ...prevData,
                    billingAddress1: '', billingAddress2: '', billingCity: '',
                    billingState: '', billingZipcode: '', billingCountry: '',
                }));
                setErrors(prevErrors => ({
                    ...prevErrors,
                    billingAddress1: '', billingAddress2: '', billingCity: '',
                    billingState: '', billingZipcode: '', billingCountry: '',
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const {
            companyName, website, firstName, lastName, email,
            shippingAddress1, shippingCity, shippingState, shippingZipcode, shippingCountry,
            phone, fax, // Primary contact fields
            password, password_confirmation,
            billingAddress1, billingCity, billingState, billingZipcode, billingCountry,
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

        // Password validation (for create mode, as this is CreateCustomer.jsx)
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
        // Primary Phone validation
        if (!phone?.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d{7,}$/.test(phone)) {
            newErrors.phone = 'Invalid phone number (min 7 digits).';
        }
        // Fax validation (optional)
        if (fax && !/^\d{7,}$/.test(fax)) { // Validate fax if provided
            newErrors.fax = 'Invalid fax number (min 7 digits).';
        }

        // -- Conditional Billing Address Validation --
        if (isBillingAddressDifferent) {
            if (!billingCountry || billingCountry === "- Select country -") newErrors.billingCountry = 'Billing Country is required.';
            if (!billingAddress1?.trim()) newErrors.billingAddress1 = 'Billing Address 1 is required.';
            if (!billingCity?.trim()) newErrors.billingCity = 'Billing City is required.';
            if (!billingState?.trim()) newErrors.billingState = 'Billing State is required.';
            if (!billingZipcode?.trim()) newErrors.billingZipcode = 'Billing Zipcode is required.';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModal(null); // Clear previous messages
        setErrors({}); // Clear previous errors

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setModal({ message: 'Please correct the highlighted errors.', type: 'error' });
            return;
        }

        setIsSubmitting(true);

        try {
            const apiData = {
                // account_no is not sent for creation from the frontend
                company_name: isNotCompany ? null : formData.companyName,
                website: formData.website,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.password_confirmation,

                phone: formData.phone,
                fax: formData.fax,

                shipping_country: formData.shippingCountry,
                shipping_state: formData.shippingState,
                shipping_address1: formData.shippingAddress1,
                shipping_address2: formData.shippingAddress2,
                shipping_city: formData.shippingCity,
                shipping_zipcode: formData.shippingZipcode,

                is_billing_address_different: isBillingAddressDifferent, // Boolean flag

                // Billing Address fields (mapped from formData.billing...)
                // If not different, these will be handled by backend logic (e.g., null or copied from shipping)
                billing_country: formData.billingCountry,
                billing_state: formData.billingState,
                billing_address1: formData.billingAddress1,
                billing_address2: formData.billingAddress2,
                billing_city: formData.billingCity,
                billing_zipcode: formData.billingZipcode,
                
                verification_key: formData.verificationKey // Optional field
            };

            const response = await createCustomer(apiData); // Assuming createCustomer handles API call

            setModal({ message: response.message || 'Customer created successfully!', type: 'success' });
            setFormData(initialFormData); // Reset form
            setIsNotCompany(false);
            setIsBillingAddressDifferent(false);
            setErrors({});

            // Redirect after a short delay for user to see success message
            setTimeout(() => navigate('/admin/customers/list'), 1500);

        } catch (error) {
            console.error("Error creating customer:", error);
            let errorMessage = 'An unexpected error occurred.';
            const backendErrors = {};

            if (error.response) {
                if (error.response.status === 422 && error.response.data.errors) {
                    // Map backend snake_case errors to frontend camelCase
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
            } else {
                errorMessage = error.message || errorMessage;
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
            setFormData={setFormData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange} // Pass the new checkbox handler
            errors={errors}
            isEditMode={false} // This is the Create Customer page, so it's always false
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
