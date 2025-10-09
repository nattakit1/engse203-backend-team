// pages/UserManagementPage.js
import React, { useState, useEffect } from 'react';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import { userAPI } from '../services/userAPI';
import { authAPI } from '../services/authAPI';
import '../styles/UserManagementPage.css';

const UserManagementPage = ({ onLogout }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const currentUser = authAPI.getCurrentUser();

    // Load users on component mount
    useEffect(() => {
        loadUsers();
    }, []);

    // 🆕 Auto-clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userAPI.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    /**
     * TODO: นักศึกษาเขียน handleDeleteUser function (10%)
     * 
     * 📝 INSTRUCTIONS:
     * 1. แสดง confirmation dialog
     *    - ใช้ window.confirm(`Are you sure you want to delete user "${user.username}"?`)
     * 2. ถ้า user confirm (true):
     *    - try { ... } catch { ... }
     *    - เรียก await userAPI.deleteUser(userId)
     *    - setSuccessMessage('User deleted successfully')
     *    - await loadUsers() เพื่อ refresh list
     * 3. ถ้า error:
     *    - setError(err.message)
     */
    const handleDeleteUser = async (userId) => {
        const user = users.find(u => u.id === userId);
        if (!user) return;

        const confirmed = window.confirm(`Are you sure you want to delete user "${user.username}"?`);
        if (!confirmed) return;

        try {
            await userAPI.deleteUser(userId);
            setSuccessMessage('User deleted successfully');
            await loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSaveUser = async (userData) => {
        try {
            if (selectedUser) {
                // Edit mode
                await userAPI.updateUser(selectedUser.id, userData);
                setSuccessMessage('User updated successfully');
            } else {
                // Create mode
                await userAPI.createUser(userData);
                setSuccessMessage('User created successfully');
            }

            setIsModalOpen(false);
            await loadUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    return React.createElement('div', { className: 'user-management-page' },
        // Header
        React.createElement('div', { className: 'page-header' },
            React.createElement('div', null,
                React.createElement('h1', null, '👥 User Management'),
                React.createElement('p', { className: 'page-subtitle' },
                    `Logged in as: ${currentUser?.fullName} (${currentUser?.username})`
                )
            ),
            React.createElement('div', { className: 'header-actions' },
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: handleCreateUser
                }, '+ Add New User'),
                React.createElement('button', {
                    className: 'btn btn-secondary',
                    onClick: onLogout
                }, '🚪 Logout')
            )
        ),

        // Success message
        successMessage && React.createElement('div', { className: 'alert alert-success' },
            successMessage
        ),

        // Error message
        error && React.createElement('div', { className: 'alert alert-error' }, error),

        // Loading state
        loading ?
            React.createElement('div', { className: 'loading' }, '⏳ Loading users...') :
            // User table
            React.createElement(UserTable, {
                users: users,
                onEdit: handleEditUser,
                onDelete: handleDeleteUser
            }),

        // User form modal
        isModalOpen && React.createElement(UserFormModal, {
            user: selectedUser,
            onClose: () => setIsModalOpen(false),
            onSave: handleSaveUser
        })
    );
};

export default UserManagementPage;