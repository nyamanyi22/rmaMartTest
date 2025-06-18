import React, { useState, useEffect } from 'react';
import '../styles/Signup.css'; // Ensure your CSS is correctly linked

// Mocking useNavigate and useAuth (as per your previous code)
const useNavigate = () => {
    console.log('useNavigate hook called (mock)');
    return (path) => {
        console.log(`Navigating to: ${path}`);
    };
};

const useAuth = () => {
    console.log('useAuth hook called (mock)');
    return {
        login: (credentials) => {
            console.log('Login function called (mock) with:', credentials);
            return Promise.resolve(true);
        },
    };
};

// MessageModal (as per your previous code)
const MessageModal = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
            <div className={`relative p-6 rounded-lg shadow-xl max-w-sm w-full ${bgColor} border ${type === 'success' ? 'border-green-400' : 'border-red-400'}`}>
                <p className={`text-center font-semibold ${textColor}`}>{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// Array of countries based on your provided list
const countries = [
    "Afghanistan", "Aland", "Albania", "Algeria", "American Samoa", "Andorra", "Angola",
    "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Ascension",
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Baker Island",
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda",
    "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Bouvet Island",
    "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso",
    "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands",
    "Central African Republic", "Chad", "Chile", "China, People's Republic of",
    "China, Republic of (Taiwan)", "Christmas Island", "Cocos (Keeling) Islands",
    "Colombia", "Comoros", "Congo (Democratic Republic)", "Cook Islands",
    "Costa Rica", "Cote d'Ivoire (Ivory Coast)", "Croatia", "Cuba", "Cyprus",
    "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia",
    "Ethiopia", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana",
    "French Polynesia", "Gabon", "Georgia", "Germany", "Ghana", "Gibraltar",
    "Greece", "Greenland", "Grenada", "Guam", "Guatemala", "Guernsey", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Isle of Man",
    "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan",
    "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein",
    "Lithuania", "Luxembourg", "Macau", "Macedonia", "Madagascar", "Malawi",
    "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique",
    "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia", "Moldova",
    "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique",
    "Myanmar (Burma)", "Namibia", "Nauru", "Nepal", "Netherlands",
    "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua",
    "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands",
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea",
    "Paraguay", "Peru", "Philippines", "Pitcairn Islands", "Poland", "Portugal",
    "Puerto Rico", "Qatar", "Reunion", "Romania", "Russia", "Rwanda",
    "Saint Barthelemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Pierre and Miquelon", "Samoa", "San Marino", "Sao Tome and Principe",
    "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
    "South Africa", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland",
    "Syria", "Tanzania", "Thailand", "Tokelau", "Tonga", "Trinidad and Tobago",
    "Tristan da Cunha", "Tunisia", "Turkey", "Turkmenistan",
    "Turks and Caicos Islands", "Tuvalu", "Ukraine", "United Arab Emirates",
    "United Kingdom", "United States", "Uruguay", "Vatican City", "Venezuela",
    "Vietnam", "Wallis and Futuna", "Yemen", "Zambia", "Zimbabwe"
];


const CustomerSignup = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        website: '', // NEW
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        // Shipping Address fields (replaces old shippingAddress)
        shippingAddress1: '',
        shippingAddress2: '',
        shippingCity: '',
        shippingState: '',
        shippingZipcode: '',
        shippingCountry: '', // Will be a select
        phone: '', // Main contact phone
        fax: '', // NEW
        // Billing Address fields (conditional, replaces old billingAddress)
        billingAddress1: '',
        billingAddress2: '',
        billingCity: '',
        billingState: '',
        billingZipcode: '',
        billingCountry: '', // Will be a select
        verificationKey: '',
    });

    const [isNotCompany, setIsNotCompany] = useState(false);
    // NEW STATE FOR BILLING ADDRESS DIFFERENT CHECKBOX
    const [isBillingAddressDifferent, setIsBillingAddressDifferent] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modal, setModal] = useState(null);

    // Modified handleChange to handle all new fields and checkboxes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'isNotCompany') {
            setIsNotCompany(checked);
            if (checked) {
                // If "Not a Company" is checked, clear companyName and website
                setFormData(prevData => ({ ...prevData, companyName: '', website: '' }));
                setErrors(prevErrors => ({ ...prevErrors, companyName: '', website: '' }));
            }
        } else if (name === 'isBillingAddressDifferent') {
            setIsBillingAddressDifferent(checked);
            if (!checked) {
                // If "My billing address is different" is UNchecked, clear billing address fields
                setFormData(prevData => ({
                    ...prevData,
                    billingAddress1: '',
                    billingAddress2: '',
                    billingCity: '',
                    billingState: '',
                    billingZipcode: '',
                    billingCountry: '',
                }));
                // Also clear any related errors
                setErrors(prevErrors => ({
                    ...prevErrors,
                    billingAddress1: '', billingAddress2: '', billingCity: '',
                    billingState: '', billingZipcode: '', billingCountry: '',
                }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error for the changed field
    };

    // --- Validate Form (Extensively Modified) ---
    const validateForm = () => {
        const newErrors = {};

        // Conditional validation for Company Name and Website
        if (!isNotCompany) {
            if (!formData.companyName.trim()) {
                newErrors.companyName = 'Company name is required';
            }
            // Website is optional based on your list, but we can make it required if company is selected
            // if (!formData.website.trim()) {
            //     newErrors.website = 'Website is required for companies';
            // }
        }

        // Required Personal Info fields
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email address is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

        // Shipping Address fields (all required)
        if (!formData.shippingAddress1.trim()) newErrors.shippingAddress1 = 'Shipping address 1 is required';
        if (!formData.shippingCity.trim()) newErrors.shippingCity = 'Shipping city is required';
        if (!formData.shippingState.trim()) newErrors.shippingState = 'Shipping state is required';
        if (!formData.shippingZipcode.trim()) newErrors.shippingZipcode = 'Shipping zip code is required';
        if (!formData.shippingCountry.trim()) newErrors.shippingCountry = 'Shipping country is required';


        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Confirm password is required';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        // Email format validation
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Phone format validation (simple numeric check, can be expanded)
        if (formData.phone && !/^\d{7,}$/.test(formData.phone)) { // min 7 digits for general phone
            newErrors.phone = 'Invalid phone number format (min 7 digits)';
        }

        // Conditional validation for Billing Address fields
        if (isBillingAddressDifferent) {
            if (!formData.billingAddress1.trim()) newErrors.billingAddress1 = 'Billing address 1 is required';
            if (!formData.billingCity.trim()) newErrors.billingCity = 'Billing city is required';
            if (!formData.billingState.trim()) newErrors.billingState = 'Billing state is required';
            if (!formData.billingZipcode.trim()) newErrors.billingZipcode = 'Billing zip code is required';
            if (!formData.billingCountry.trim()) newErrors.billingCountry = 'Billing country is required';
        }

        return newErrors;
    };


    // Handle form submission (no major changes here, as validateForm handles the logic)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setModal({ message: 'Please correct the errors in the form.', type: 'error' });
            return;
        }

        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call

            // Prepare data for submission, ensuring conditional fields are handled
            const dataToSend = { ...formData };
            if (isNotCompany) {
                dataToSend.companyName = '';
                dataToSend.website = '';
            }
            if (!isBillingAddressDifferent) {
                // If billing address is NOT different, clear all billing address fields
                dataToSend.billingAddress1 = dataToSend.shippingAddress1; // Can also copy shipping to billing if preferred
                dataToSend.billingAddress2 = dataToSend.shippingAddress2;
                dataToSend.billingCity = dataToSend.shippingCity;
                dataToSend.billingState = dataToSend.shippingState;
                dataToSend.billingZipcode = dataToSend.shippingZipcode;
                dataToSend.billingCountry = dataToSend.shippingCountry;
            }

            console.log("Submitting form data:", dataToSend); // For debugging
            await login({ email: formData.email }); // Assuming login only needs email for mock

            setModal({ message: 'Customer signed up successfully!', type: 'success' });
            // Reset form
            setFormData({
                companyName: '', website: '', firstName: '', lastName: '', email: '',
                phone: '', fax: '', shippingAddress1: '', shippingAddress2: '',
                shippingCity: '', shippingState: '', shippingZipcode: '', shippingCountry: '',
                billingAddress1: '', billingAddress2: '', billingCity: '',
                billingState: '', billingZipcode: '', billingCountry: '',
                verificationKey: '', password: '', confirmPassword: '',
            });
            setIsNotCompany(false);
            setIsBillingAddressDifferent(false);
            navigate('/');
        } catch (error) {
            console.error('Signup error:', error);
            setModal({ message: 'Signup failed. Please try again.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setModal(null);
    };

    return (
        <div className="signup-page-container">
            <div className="signup-card">
                <h2 className="signup-title">Customer Signup</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    {/* --- Company Information --- */}
                    <div className="signup-section-card">
                        <h3 className="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m7-12a4 4 0 11-4 4 4 4 0 014-4zm-4 4a4 4 0 100-8 4 4 0 000 8zm-8 12a4 4 0 01-4-4V7a4 4 0 014-4h8a4 4 0 014 4v12a4 4 0 01-4 4H7z" />
                            </svg>
                            Your Information
                        </h3>
                        <div>
                            <label htmlFor="companyName" className="input-label">Company Name</label>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className={`form-input ${errors.companyName ? 'input-error' : ''}`}
                                disabled={isNotCompany}
                            />
                            {errors.companyName && (
                                <p className="error-message">{errors.companyName}</p>
                            )}
                        </div>
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="isNotCompany"
                                name="isNotCompany"
                                checked={isNotCompany}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
                            <label htmlFor="isNotCompany" className="checkbox-label">Not a Company</label>
                        </div>
                        {/* NEW: Website Field */}
                        <div className="mt-4">
                            <label htmlFor="website" className="input-label">Website</label>
                            <input
                                type="url" // Use type="url" for website fields
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={`form-input ${errors.website ? 'input-error' : ''}`}
                                disabled={isNotCompany} // Disable if "Not a Company"
                                placeholder="e.g., https://www.example.com"
                            />
                            {errors.website && (
                                <p className="error-message">{errors.website}</p>
                            )}
                        </div>

                        {/* First Name */}
                        <div className="mt-4">
                            <label htmlFor="firstName" className="input-label">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                            />
                            {errors.firstName && (
                                <p className="error-message">{errors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="mt-4">
                            <label htmlFor="lastName" className="input-label">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                            />
                            {errors.lastName && (
                                <p className="error-message">{errors.lastName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mt-4">
                            <label htmlFor="email" className="input-label">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`form-input ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && (
                                <p className="error-message">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mt-4">
                            <label htmlFor="password" className="input-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`form-input ${errors.password ? 'input-error' : ''}`}
                            />
                            {errors.password && (
                                <p className="error-message">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirm Password (Retype Password) */}
                        <div className="mt-4">
                            <label htmlFor="confirmPassword" className="input-label">Retype Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                            />
                            {errors.confirmPassword && (
                                <p className="error-message">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>


                    {/* --- Shipping Address --- */}
                    <div className="signup-section-card">
                        <h3 className="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Shipping Address
                        </h3>
                        <div className="space-y-4">
                            {/* Shipping Address 1 */}
                            <div>
                                <label htmlFor="shippingAddress1" className="input-label">Address 1</label>
                                <input
                                    type="text"
                                    id="shippingAddress1"
                                    name="shippingAddress1"
                                    value={formData.shippingAddress1}
                                    onChange={handleChange}
                                    className={`form-input ${errors.shippingAddress1 ? 'input-error' : ''}`}
                                />
                                {errors.shippingAddress1 && (
                                    <p className="error-message">{errors.shippingAddress1}</p>
                                )}
                            </div>
                            {/* Shipping Address 2 */}
                            <div>
                                <label htmlFor="shippingAddress2" className="input-label">Address 2 (Optional)</label>
                                <input
                                    type="text"
                                    id="shippingAddress2"
                                    name="shippingAddress2"
                                    value={formData.shippingAddress2}
                                    onChange={handleChange}
                                    className={`form-input ${errors.shippingAddress2 ? 'input-error' : ''}`}
                                />
                                {errors.shippingAddress2 && (
                                    <p className="error-message">{errors.shippingAddress2}</p>
                                )}
                            </div>
                            <div className="form-grid-2-col">
                                {/* Shipping City */}
                                <div>
                                    <label htmlFor="shippingCity" className="input-label">City</label>
                                    <input
                                        type="text"
                                        id="shippingCity"
                                        name="shippingCity"
                                        value={formData.shippingCity}
                                        onChange={handleChange}
                                        className={`form-input ${errors.shippingCity ? 'input-error' : ''}`}
                                    />
                                    {errors.shippingCity && (
                                        <p className="error-message">{errors.shippingCity}</p>
                                    )}
                                </div>
                                {/* Shipping State */}
                                <div>
                                    <label htmlFor="shippingState" className="input-label">State</label>
                                    <input
                                        type="text"
                                        id="shippingState"
                                        name="shippingState"
                                        value={formData.shippingState}
                                        onChange={handleChange}
                                        className={`form-input ${errors.shippingState ? 'input-error' : ''}`}
                                    />
                                    {errors.shippingState && (
                                        <p className="error-message">{errors.shippingState}</p>
                                    )}
                                </div>
                            </div>
                            <div className="form-grid-2-col">
                                {/* Shipping Zipcode */}
                                <div>
                                    <label htmlFor="shippingZipcode" className="input-label">Zipcode</label>
                                    <input
                                        type="text"
                                        id="shippingZipcode"
                                        name="shippingZipcode"
                                        value={formData.shippingZipcode}
                                        onChange={handleChange}
                                        className={`form-input ${errors.shippingZipcode ? 'input-error' : ''}`}
                                    />
                                    {errors.shippingZipcode && (
                                        <p className="error-message">{errors.shippingZipcode}</p>
                                    )}
                                </div>
                                {/* Shipping Country */}
                                <div>
                                    <label htmlFor="shippingCountry" className="input-label">Country</label>
                                    <select
                                        id="shippingCountry"
                                        name="shippingCountry"
                                        value={formData.shippingCountry}
                                        onChange={handleChange}
                                        className={`form-input ${errors.shippingCountry ? 'input-error' : ''}`}
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map((country) => (
                                            <option key={country} value={country}>{country}</option>
                                        ))}
                                    </select>
                                    {errors.shippingCountry && (
                                        <p className="error-message">{errors.shippingCountry}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Contact Details (Phone & Fax) --- */}
                    <div className="signup-section-card">
                        <h3 className="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Contact Details
                        </h3>
                        <div className="form-grid-2-col">
                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="input-label">Phone</label>
                                <input
                                    type="tel" // Use type="tel" for phone numbers
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`form-input ${errors.phone ? 'input-error' : ''}`}
                                />
                                {errors.phone && (
                                    <p className="error-message">{errors.phone}</p>
                                )}
                            </div>
                            {/* Fax */}
                            <div>
                                <label htmlFor="fax" className="input-label">Fax (Optional)</label>
                                <input
                                    type="tel" // Fax numbers can also be tel type
                                    id="fax"
                                    name="fax"
                                    value={formData.fax}
                                    onChange={handleChange}
                                    className={`form-input ${errors.fax ? 'input-error' : ''}`}
                                />
                                {errors.fax && (
                                    <p className="error-message">{errors.fax}</p>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* --- Billing Address Checkbox --- */}
                    <div className="signup-section-card">
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="isBillingAddressDifferent"
                                name="isBillingAddressDifferent"
                                checked={isBillingAddressDifferent}
                                onChange={handleChange}
                                className="form-checkbox"
                            />
                            <label htmlFor="isBillingAddressDifferent" className="checkbox-label">My billing address is different from my shipping address</label>
                        </div>
                    </div>

                    {/* --- Billing Address (Conditionally Rendered) --- */}
                    {isBillingAddressDifferent && (
                        <div className="signup-section-card">
                            <h3 className="section-title">
                                <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Billing Address
                            </h3>
                            <div className="space-y-4">
                                {/* Billing Address 1 */}
                                <div>
                                    <label htmlFor="billingAddress1" className="input-label">Address 1</label>
                                    <input
                                        type="text"
                                        id="billingAddress1"
                                        name="billingAddress1"
                                        value={formData.billingAddress1}
                                        onChange={handleChange}
                                        className={`form-input ${errors.billingAddress1 ? 'input-error' : ''}`}
                                    />
                                    {errors.billingAddress1 && (
                                        <p className="error-message">{errors.billingAddress1}</p>
                                    )}
                                </div>
                                {/* Billing Address 2 */}
                                <div>
                                    <label htmlFor="billingAddress2" className="input-label">Address 2 (Optional)</label>
                                    <input
                                        type="text"
                                        id="billingAddress2"
                                        name="billingAddress2"
                                        value={formData.billingAddress2}
                                        onChange={handleChange}
                                        className={`form-input ${errors.billingAddress2 ? 'input-error' : ''}`}
                                    />
                                    {errors.billingAddress2 && (
                                        <p className="error-message">{errors.billingAddress2}</p>
                                    )}
                                </div>
                                <div className="form-grid-2-col">
                                    {/* Billing City */}
                                    <div>
                                        <label htmlFor="billingCity" className="input-label">City</label>
                                        <input
                                            type="text"
                                            id="billingCity"
                                            name="billingCity"
                                            value={formData.billingCity}
                                            onChange={handleChange}
                                            className={`form-input ${errors.billingCity ? 'input-error' : ''}`}
                                        />
                                        {errors.billingCity && (
                                            <p className="error-message">{errors.billingCity}</p>
                                        )}
                                    </div>
                                    {/* Billing State */}
                                    <div>
                                        <label htmlFor="billingState" className="input-label">State</label>
                                        <input
                                            type="text"
                                            id="billingState"
                                            name="billingState"
                                            value={formData.billingState}
                                            onChange={handleChange}
                                            className={`form-input ${errors.billingState ? 'input-error' : ''}`}
                                        />
                                        {errors.billingState && (
                                            <p className="error-message">{errors.billingState}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="form-grid-2-col">
                                    {/* Billing Zipcode */}
                                    <div>
                                        <label htmlFor="billingZipcode" className="input-label">Zipcode</label>
                                        <input
                                            type="text"
                                            id="billingZipcode"
                                            name="billingZipcode"
                                            value={formData.billingZipcode}
                                            onChange={handleChange}
                                            className={`form-input ${errors.billingZipcode ? 'input-error' : ''}`}
                                        />
                                        {errors.billingZipcode && (
                                            <p className="error-message">{errors.billingZipcode}</p>
                                        )}
                                    </div>
                                    {/* Billing Country */}
                                    <div>
                                        <label htmlFor="billingCountry" className="input-label">Country</label>
                                        <select
                                            id="billingCountry"
                                            name="billingCountry"
                                            value={formData.billingCountry}
                                            onChange={handleChange}
                                            className={`form-input ${errors.billingCountry ? 'input-error' : ''}`}
                                        >
                                            <option value="">Select a country</option>
                                            {countries.map((country) => (
                                                <option key={country} value={country}>{country}</option>
                                            ))}
                                        </select>
                                        {errors.billingCountry && (
                                            <p className="error-message">{errors.billingCountry}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* --- Optional Fields --- */}
                    <div className="signup-section-card">
                        <h3 className="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Optional Information
                        </h3>
                        <div>
                            <label htmlFor="verificationKey" className="input-label">Verification Key (Optional)</label>
                            <input
                                type="text"
                                id="verificationKey"
                                name="verificationKey"
                                value={formData.verificationKey}
                                onChange={handleChange}
                                className={`form-input ${errors.verificationKey ? 'input-error' : ''}`}
                            />
                            {errors.verificationKey && (
                                <p className="error-message">{errors.verificationKey}</p>
                            )}
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
            </div>

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

export default CustomerSignup;