import React from 'react';
import PropTypes from 'prop-types';
import MessageModal from '../../Components/MessageModal'; // Import the MessageModal component
import { useEffect } from 'react';

// Static list of countries
const countries = [
    "- Select country -", "Afghanistan", "Aland", "Albania", "Algeria", "American Samoa",
    "Andorra", "Angola", "Anguilla", "Antigua and Barbuda", "Argentina", "Armenia",
    "Aruba", "Ascension", "Australia", "Austria", "Azerbaijan", "Bahamas",
    "Bahrain", "Baker Island", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegovina",
    "Botswana", "Bouvet Island", "Brazil", "British Virgin Islands", "Brunei",
    "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada",
    "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile",
    "China, People's Republic of", "China, Republic of (Taiwan)", "Christmas Island",
    "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo (Democratic Republic)",
    "Cook Islands", "Costa Rica", "Cote d'Ivoire (Ivory Coast)", "Croatia", "Cuba",
    "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
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

/**
 * Reusable form component for Admin Customer Create/Update.
 * It receives form data, change handlers, and error messages as props.
 * It does NOT manage its own state or perform API calls directly.
 */
const AdminCustomerForm = ({
    formData,
    handleChange,
    handleCheckboxChange, // Separate handler for checkboxes
    errors,
    isEditMode, // Prop to determine if it's create or edit
    isNotCompany,
    isBillingAddressDifferent,
    handleSubmit, // Pass handleSubmit from parent
    modal, // For displaying messages
    closeModal, // For closing messages
    isSubmitting // For submit button loading state
}) => {
    return (
        <div className="signup-page-container"> {/* Reusing signup styles */}
            <div className="signup-card">
                {/* Title is now conditional based on mode */}
                <h2 className="signup-title">{isEditMode ? 'Edit Customer' : 'Create New Customer'}</h2>
                {modal && <MessageModal message={modal.message} type={modal.type} onClose={closeModal} />}

                <form onSubmit={handleSubmit} className="signup-form">
                    {/* --- Customer Information --- */}
                    <div className="signup-section-card">
                        <h3 className="section-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2m7-12a4 4 0 11-4 4 4 4 0 014-4zm-4 4a4 4 0 100-8 4 4 0 000 8zm-8 12a4 4 0 01-4-4V7a4 4 0 014-4h8a4 4 0 014 4v12a4 4 0 01-4 4H7z" />
                            </svg>
                            Your Information
                        </h3>
                        {/* Account No. (Conditionally displayed/disabled in edit mode) */}
                        {isEditMode && (
                            <div className="mt-4">
                                <label htmlFor="accountNo" className="input-label">Account No.</label>
                                <input
                                    type="text"
                                    id="accountNo"
                                    name="accountNo"
                                    value={formData.accountNo}
                                    onChange={handleChange}
                                    className={`form-input ${errors.accountNo ? 'input-error' : ''}`}
                                    disabled={true} // Account No. typically not editable after creation
                                />
                                {errors.accountNo && <p className="error-message">{errors.accountNo}</p>}
                            </div>
                        )}

                        {/* Company Name */}
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
                        {/* Not a Company Checkbox */}
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                id="isNotCompany"
                                name="isNotCompany"
                                checked={isNotCompany}
                                onChange={handleCheckboxChange} // Use handleCheckboxChange for this
                                className="form-checkbox"
                            />
                            <label htmlFor="isNotCompany" className="checkbox-label">Not a Company</label>
                        </div>
                        {/* Website Field */}
                        <div className="mt-4">
                            <label htmlFor="website" className="input-label">Website</label>
                            <input
                                type="url"
                                id="website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                className={`form-input ${errors.website ? 'input-error' : ''}`}
                                disabled={isNotCompany}
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

                        {/* Password fields (only for create mode) */}
                        {!isEditMode && (
                            <>
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
                                    <label htmlFor="password_confirmation" className="input-label">Retype Password</label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        className={`form-input ${errors.password_confirmation ? 'input-error' : ''}`}
                                    />
                                    {errors.password_confirmation && (
                                        <p className="error-message">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </>
                        )}

                        {/* New Password field (only for edit mode, allowing optional password change) */}
                        {isEditMode && (
                            <div className="mt-4">
                                <label htmlFor="password">New Password (Leave blank to keep current)</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`form-input ${errors.password ? 'input-error' : ''}`}
                                />
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>
                        )}
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
                                    type="tel"
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
                                    type="tel"
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
                                onChange={handleCheckboxChange} // Use handleCheckboxChange for this
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
                                </div>
                                {/* Removed Billing Phone and Billing Fax fields */}
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

                    {/* Display all errors at the bottom if any */}
                    {Object.values(errors).length > 0 && (
                        <div className="text-red-600 mt-4">
                            {Object.entries(errors).map(([key, msg]) => (
                                <p key={key} className="text-sm">{msg}</p>
                            ))}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Customer' : 'Create Customer')}
                    </button>
                </form>
            </div>
        </div>
    );
};

// PropTypes for type checking (good practice)
AdminCustomerForm.propTypes = {
    formData: PropTypes.object.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleCheckboxChange: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    isEditMode: PropTypes.bool.isRequired,
    isNotCompany: PropTypes.bool.isRequired,
    isBillingAddressDifferent: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    modal: PropTypes.shape({
        message: PropTypes.string,
        type: PropTypes.string,
    }),
    closeModal: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};

export default AdminCustomerForm;
