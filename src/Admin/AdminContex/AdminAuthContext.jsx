import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosAdmin from '../api/axiosAdmin'; // Adjust the import path as necessary

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '');
    const [loading, setLoading] = useState(true);

    // This effect runs once on component mount or when the token changes.
    useEffect(() => {
        const fetchAdmin = async () => {
            if (!token) {
                // If there's no token, we're not authenticated.
                setLoading(false);
                return;
            }

            try {
                // Attempt to fetch the admin user with the stored token.
                const res = await axiosAdmin.get('/me');
                setAdmin(res.data.admin ?? res.data);
            } catch (error) {
                // --- CRITICAL FIX: REFINED ERROR HANDLING ---
                // We should only log the user out if the error is specifically
                // an authentication failure (e.g., 401 Unauthorized).
                // Other errors (like 404 Not Found) should not clear the token.
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.error('❌ Admin token expired or unauthorized. Logging out.', error);
                    localStorage.removeItem('adminToken');
                    setToken('');
                    setAdmin(null);
                } else {
                    console.error('❌ Failed to fetch admin profile due to a non-auth error:', error);
                    // Do not clear the token for other errors, as they may be
                    // unrelated to authentication (e.g., a 404 on a different route).
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, [token]);

    // 🔐 Login method
    const login = async (email, password) => {
        try {
            const res = await axiosAdmin.post('/login', { email, password });

            const receivedToken = res.data.token;
            const adminInfo = res.data.admin;

            // Save token and update state
            localStorage.setItem('adminToken', receivedToken);
            setToken(receivedToken);
            setAdmin(adminInfo);
        } catch (error) {
            console.error('❌ Login failed:', error);
            throw error;
        }
    };

    // 🚪 Logout method
    const logout = async () => {
        try {
            await axiosAdmin.post('/logout');
        } catch (error) {
            console.warn('⚠️ Logout failed, clearing token anyway.', error);
        }

        // Always clear token and state on explicit logout
        localStorage.removeItem('adminToken');
        setToken('');
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                token,
                login,
                logout,
                isAuthenticated: !!admin,
                loading,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
