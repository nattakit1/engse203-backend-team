// services/userAPI.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * 🆕 Helper function for error handling
 */
const handleAPIError = (error) => {
    if (error.message === 'Failed to fetch') {
        throw new Error('Network error. Please check your internet connection.');
    }
    throw error;
};

/**
 * User API Service
 * ให้ 75% - นักศึกษาเพิ่ม updateUser และ deleteUser (25%)
 */
export const userAPI = {
    /**
     * Get all users
     */
    getAllUsers: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            // 🆕 Handle authentication errors
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/';
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data; // Return the users array
        } catch (error) {
            console.error('Error fetching users:', error);
            handleAPIError(error);
        }
    },

    /**
     * Get user by ID
     */
    getUserById: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            handleAPIError(error);
        }
    },

    /**
     * Create new user
     */
    createUser: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create user');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error creating user:', error);
            handleAPIError(error);
        }
    },

    /**
     * Update user
     * TODO: นักศึกษาเขียน implementation (15%)
     * 
     * 📝 INSTRUCTIONS:
     * 1. ส่ง PUT request ไปที่ `${API_BASE_URL}/users/${userId}`
     * 2. Headers ต้องมี:
     *    - 'Content-Type': 'application/json'
     *    - 'Authorization': Bearer token
     * 3. Body: JSON.stringify(userData)
     * 4. Handle errors เหมือน createUser
     * 5. Return data.data
     * 
     * 💡 HINT: Copy จาก createUser แล้วเปลี่ยน method และ URL
     */
    updateUser: async (userId, userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error('Error updating user:', error);
            handleAPIError(error);
        }
    },

    /**
     * Delete user
     * TODO: นักศึกษาเขียน implementation (10%)
     * 
     * 📝 INSTRUCTIONS:
     * 1. ส่ง DELETE request ไปที่ `${API_BASE_URL}/users/${userId}`
     * 2. Headers ต้องมี Authorization
     * 3. ไม่ต้องมี body
     * 4. Handle errors
     * 5. Return success: true
     */
    deleteUser: async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            return { success: true };
        } catch (error) {
            console.error('Error deleting user:', error);
            handleAPIError(error);
        }
    }
};