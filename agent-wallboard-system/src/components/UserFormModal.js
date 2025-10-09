// components/UserFormModal.js
import React, { useState, useEffect } from 'react';
import '../styles/UserFormModal.css';

const UserFormModal = ({ user, onClose, onSave }) => {
    // Initialize form data
    const [formData, setFormData] = useState({
        username: '',
        fullName: '',
        role: 'Agent',
        teamId: '',
        status: 'Active'
    });

    const [errors, setErrors] = useState({});

    // Load user data if editing
    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                fullName: user.fullName,
                role: user.role,
                teamId: user.teamId || '',
                status: user.status
            });
        }
    }, [user]);

    /**
     * TODO: นักศึกษาเขียน handleChange function (10%)
     * 
     * 📝 INSTRUCTIONS:
     * 1. ดึง name และ value จาก e.target
     * 2. อัพเดท formData state:
     *    setFormData(prev => ({ ...prev, [name]: value }))
     * 3. เคลียร์ error ของ field นั้น:
     *    if (errors[name]) {
     *      setErrors(prev => ({ ...prev, [name]: null }))
     *    }
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        // อัพเดทค่าใน formData
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));

        // เคลียร์ error ของ field นั้น (ถ้ามี)
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null
            }));
        }
    };

    /**
     * TODO: นักศึกษาเขียน validateForm function (15%)
     * 
     * 📝 INSTRUCTIONS:
     * 1. สร้าง object newErrors = {}
     * 2. ตรวจสอบ username:
     *    - ถ้าว่าง: newErrors.username = 'Username is required'
     *    - ถ้า format ผิด: newErrors.username = 'Invalid username format'
     * 3. ตรวจสอบ fullName:
     *    - ถ้าว่างหรือสั้นกว่า 2 ตัวอักษร: newErrors.fullName = 'Full name must be at least 2 characters'
     * 4. ตรวจสอบ teamId (ถ้า role เป็น Agent หรือ Supervisor):
     *    - if ((formData.role === 'Agent' || formData.role === 'Supervisor') && !formData.teamId)
     *    - newErrors.teamId = 'Team is required for Agent and Supervisor'
     * 5. setErrors(newErrors)
     * 6. return Object.keys(newErrors).length === 0
     */
    const validateForm = () => {
        const newErrors = {};

        // Validate username
        if (!formData.username) {
            newErrors.username = 'Username is required';
        } else {
            const usernameRegex = /^(AG|SP|AD)(00[1-9]|0[1-9]\d|[1-9]\d{2})$/;
            if (!usernameRegex.test(formData.username)) {
                newErrors.username = 'Invalid username format';
            }
        }

        // Validate full name
        if (!formData.fullName || formData.fullName.trim().length < 2) {
            newErrors.fullName = 'Full name must be at least 2 characters';
        }

        // Validate teamId for Agent or Supervisor
        if ((formData.role === 'Agent' || formData.role === 'Supervisor') && !formData.teamId) {
            newErrors.teamId = 'Team is required for Agent and Supervisor';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    /**
     * TODO: นักศึกษาเขียน handleSubmit function (15%)
     * 
     * 📝 INSTRUCTIONS:
     * 1. e.preventDefault()
     * 2. ถ้า validateForm() === true:
     *    - เรียก onSave(formData)
     * 3. ถ้า validateForm() === false:
     *    - error messages จะแสดงอัตโนมัติจาก errors state
     */
    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const submitData = { ...formData };
            if (user) delete submitData.username; // ลบ username ตอนแก้ไข
            onSave(submitData);
        }
    };

    return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
        React.createElement('div', {
            className: 'modal-content',
            onClick: (e) => e.stopPropagation()
        },
            // Modal Header
            React.createElement('div', { className: 'modal-header' },
                React.createElement('h2', null, user ? 'Edit User' : 'Add New User'),
                React.createElement('button', {
                    className: 'btn-close',
                    onClick: onClose
                }, '×')
            ),

            // Modal Body (Form)
            React.createElement('form', { onSubmit: handleSubmit, className: 'user-form' },
                // Username field
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { htmlFor: 'username' },
                        'Username ',
                        React.createElement('span', { className: 'required' }, '*')
                    ),
                    React.createElement('input', {
                        type: 'text',
                        id: 'username',
                        name: 'username',
                        value: formData.username,
                        onChange: handleChange,
                        placeholder: 'e.g., AG001, SP001, AD001',
                        disabled: !!user, // disabled เมื่อแก้ไข
                        className: errors.username ? 'error' : ''
                    }),
                    React.createElement('small', { className: 'hint' },
                        'Format: AG001-AG999 (Agent), SP001-SP999 (Supervisor), AD001-AD999 (Admin)'
                    ),
                    errors.username && React.createElement('span', { className: 'error-message' },
                        errors.username
                    )
                ),

                // Full Name field
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { htmlFor: 'fullName' },
                        'Full Name ',
                        React.createElement('span', { className: 'required' }, '*')
                    ),
                    React.createElement('input', {
                        type: 'text',
                        id: 'fullName',
                        name: 'fullName',
                        value: formData.fullName,
                        onChange: handleChange,
                        placeholder: 'Enter full name',
                        className: errors.fullName ? 'error' : ''
                    }),
                    errors.fullName && React.createElement('span', { className: 'error-message' },
                        errors.fullName
                    )
                ),

                // Role field
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { htmlFor: 'role' },
                        'Role ',
                        React.createElement('span', { className: 'required' }, '*')
                    ),
                    React.createElement('select', {
                        id: 'role',
                        name: 'role',
                        value: formData.role,
                        onChange: handleChange,
                        className: errors.role ? 'error' : ''
                    },
                        React.createElement('option', { value: 'Agent' }, 'Agent'),
                        React.createElement('option', { value: 'Supervisor' }, 'Supervisor'),
                        React.createElement('option', { value: 'Admin' }, 'Admin')
                    )
                ),

                // Team field (optional for Agent/Supervisor)
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { htmlFor: 'teamId' }, 'Team'),
                    React.createElement('select', {
                        id: 'teamId',
                        name: 'teamId',
                        value: formData.teamId,
                        onChange: handleChange,
                        className: errors.teamId ? 'error' : ''
                    },
                        React.createElement('option', { value: '' }, '-- Select Team --'),
                        React.createElement('option', { value: '1' }, 'Team Alpha'),
                        React.createElement('option', { value: '2' }, 'Team Beta'),
                        React.createElement('option', { value: '3' }, 'Team Gamma')
                    ),
                    React.createElement('small', { className: 'hint' },
                        'Required for Agent and Supervisor roles'
                    ),
                    errors.teamId && React.createElement('span', { className: 'error-message' },
                        errors.teamId
                    )
                ),

                // Status field
                React.createElement('div', { className: 'form-group' },
                    React.createElement('label', { htmlFor: 'status' },
                        'Status ',
                        React.createElement('span', { className: 'required' }, '*')
                    ),
                    React.createElement('select', {
                        id: 'status',
                        name: 'status',
                        value: formData.status,
                        onChange: handleChange
                    },
                        React.createElement('option', { value: 'Active' }, 'Active'),
                        React.createElement('option', { value: 'Inactive' }, 'Inactive')
                    )
                ),

                // Form Actions
                React.createElement('div', { className: 'form-actions' },
                    React.createElement('button', {
                        type: 'button',
                        className: 'btn btn-secondary',
                        onClick: onClose
                    }, 'Cancel'),
                    React.createElement('button', {
                        type: 'submit',
                        className: 'btn btn-primary'
                    }, user ? 'Update User' : 'Create User')
                )
            )
        )
    );
};

export default UserFormModal;