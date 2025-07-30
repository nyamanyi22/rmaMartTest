// src/admin/pages/EditCustomer.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminCustomerForm from './AdminCustomerForm'; // Import the reusable form
import MessageModal from '../../Components/MessageModal'; // Import the MessageModal component
import { fetchCustomerById, updateCustomer } from '../../api/CustomerService'; // Corrected import path and functions

const EditCustomer = () => {
    const { id } = useParams(); // Get customer ID from URL
    const navigate = useNavigate();

    // Initial form data structure, matching AdminCustomerForm's expectations
    const initialFormData = {
        accountNo: '',
        companyName: '',
        website: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '', // For new password input in edit mode
        password_confirmation: '', // Not directly sent for update, but used for frontend validation

        phone: '',
        fax: '',

        shippingCountry: '',
        shippingState: '',
        shippingAddress1: '',
        shippingAddress2: '',
        shippingCity: '',
        shippingZipcode: '',

        billingAddress1: '',
        billingAddress2: '',
        billingCity: '',
        billingState: '',
        billingZipcode: '',
        billingCountry: '',
        
        verificationKey: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isNotCompany, setIsNotCompany] = useState(false);
    const [isBillingAddressDifferent, setIsBillingAddressDifferent] = useState(false);
    const [errors, setErrors] = useState({});
    const [modal, setModal] = useState(null); // { message: '', type: '' }
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Data Fetching Effect ---
    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                // Using the service function
                const response = await fetchCustomerById(id);
                const fetchedCustomer = response.customer; // Access the 'customer' key if your API wraps it

                // Map backend snake_case to frontend camelCase formData
                setFormData({
                    accountNo: fetchedCustomer.account_no || '',
                    companyName: fetchedCustomer.company_name || '',
                    website: fetchedCustomer.website || '',
                    firstName: fetchedCustomer.first_name || '',
                    lastName: fetchedCustomer.last_name || '',
                    email: fetchedCustomer.email || '',
                    password: '', // Never pre-fill passwords for security
                    password_confirmation: '', // Never pre-fill passwords for security

                    phone: fetchedCustomer.phone || '',
                    fax: fetchedCustomer.fax || '',

                    shippingCountry: fetchedCustomer.shipping_country || '',
                    shippingState: fetchedCustomer.shipping_state || '',
                    shippingAddress1: fetchedCustomer.shipping_address1 || '',
                    shippingAddress2: fetchedCustomer.shipping_address2 || '',
                    shippingCity: fetchedCustomer.shipping_city || '',
                    shippingZipcode: fetchedCustomer.shipping_zipcode || '',

                    billingCountry: fetchedCustomer.is_billing_address_different ? (fetchedCustomer.billing_country || '') : '',
                    billingState: fetchedCustomer.is_billing_address_different ? (fetchedCustomer.billing_state || '') : '',
                    billingAddress1: fetchedCustomer.is_billing_address_different ? (fetchedCustomer.billing_address1 || '') : '',
                    billingAddress2: fetchedCustomer.is_billing_address_different ? (fetchedCustomer.billing_address2 || '') : '',
                    billingCity: fetchedCustomer.is_billing_address_different ? (fetchedCustomer.billing_city || '') : '',
                    billingZipcode: fetchedCustomer.is_billing_address_different ? (fetchedCustomer.billing_zipcode || '') : '',
                    
                    verificationKey: fetchedCustomer.verification_key || ''
                });

                // Set checkbox states based on fetched data
                setIsNotCompany(!fetchedCustomer.company_name); // If company_name is null/empty, it's not a company
                setIsBillingAddressDifferent(fetchedCustomer.is_billing_address_different);

            } catch (error) {
                console.error('Error fetching customer:', error);
                setModal({
                    message: error?.response?.data?.message || 'Failed to load customer data.',
                    type: 'error',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [id]); // Re-run effect if ID changes

    // --- Change Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value.trim() }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error on change
    };

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

    // --- Form Validation ---
    const validateForm = () => {
        const newErrors = {};
        const {
            companyName, website, firstName, lastName, email,
            shippingAddress1, shippingCity, shippingState, shippingZipcode, shippingCountry,
            phone, fax,
            password, password_confirmation, // These are for optional new password
            billingAddress1, billingCity, billingState, billingZipcode, billingCountry,
        } = formData;

        // -- Company Validation --
        if (!isNotCompany && !companyName?.trim()) {
            newErrors.companyName = 'Company name is required if not "Not a company".';
        }
        if (website) {
            try { new URL(website); } catch (e) { newErrors.website = 'Invalid website URL format.'; }
        }

        // -- Personal Info Validation --
        if (!firstName?.trim()) newErrors.firstName = 'First name is required.';
        if (!lastName?.trim()) newErrors.lastName = 'Last name is required.';
        if (!email?.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format.';
        }

        // Password Validation (optional for edit, but if provided, must meet criteria)
        if (password) { // Only validate if a new password is being set
            if (password.length < 8 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
                newErrors.password = 'Password needs 8+ chars with upper/lowercase and numbers.';
            }
            if (!password_confirmation) {
                newErrors.password_confirmation = 'Confirm new password.';
            } else if (password !== password_confirmation) {
                newErrors.password_confirmation = 'New passwords don\'t match.';
            }
        }

        // -- Shipping Address Validation --
        if (!shippingCountry || shippingCountry === "- Select country -") newErrors.shippingCountry = 'Shipping Country is required.';
        if (!shippingAddress1?.trim()) newErrors.shippingAddress1 = 'Shipping Address 1 is required.';
        if (!shippingCity?.trim()) newErrors.shippingCity = 'Shipping City is required.';
        if (!shippingState?.trim()) newErrors.shippingState = 'Shipping State is required.';
        if (!shippingZipcode?.trim()) newErrors.shippingZipcode = 'Shipping Zipcode is required.';
        if (!phone?.trim()) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d{7,}$/.test(phone)) {
            newErrors.phone = 'Invalid phone number (min 7 digits).';
        }
        if (fax && !/^\d{7,}$/.test(fax)) {
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

    // --- Form Submission Handler ---
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
            // Map frontend camelCase formData to backend snake_case apiData
            const apiData = {
                // account_no is not sent for update as it's disabled in the form
                company_name: isNotCompany ? null : formData.companyName,
                website: formData.website,
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                // Only send password if it's not empty (user is setting a new one)
                ...(formData.password && { password: formData.password }),

                phone: formData.phone,
                fax: formData.fax,

                shipping_country: formData.shippingCountry,
                shipping_state: formData.shippingState,
                shipping_address1: formData.shippingAddress1,
                shipping_address2: formData.shippingAddress2,
                shipping_city: formData.shippingCity,
                shipping_zipcode: formData.shippingZipcode,

                is_billing_address_different: isBillingAddressDifferent,

                // Billing Address fields (mapped from formData.billing...)
                billing_country: formData.billingCountry,
                billing_state: formData.billingState,
                billing_address1: formData.billingAddress1,
                billing_address2: formData.billingAddress2,
                billing_city: formData.billingCity,
                billing_zipcode: formData.billingZipcode,
                
                verification_key: formData.verificationKey
            };

            // Using the service function
            const response = await updateCustomer(id, apiData);

            setModal({ message: response.message || 'Customer updated successfully!', type: 'success' });
            setErrors({}); // Clear errors on success

            // Redirect to customer list after a short delay to show success message
            setTimeout(() => {
                navigate('/admin/customers/list'); // CORRECTED: Redirect to the customer list page
            }, 1500); // Wait 1.5 seconds before redirecting

        } catch (error) {
            console.error('Error updating customer:', error);
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

    if (loading) {
        return <div className="p-6 text-center text-lg font-semibold">Loading customer data...</div>;
    }

    return (
        <div className="p-6">
            {/* The title will be rendered by AdminCustomerForm based on isEditMode */}
            <AdminCustomerForm
                formData={formData}
                handleChange={handleChange}
                handleCheckboxChange={handleCheckboxChange}
                errors={errors}
                isEditMode={true} // This is the Edit Customer page, so it's always true
                isNotCompany={isNotCompany}
                isBillingAddressDifferent={isBillingAddressDifferent}
                handleSubmit={handleSubmit}
                modal={modal}
                closeModal={closeModal}
                isSubmitting={isSubmitting}
            />

            {/* MessageModal is now controlled by the modal state */}
            {modal && (
                <MessageModal
                    message={modal.message}
                    type={modal.type}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default EditCustomer;
