// components/UserTable.js
import React from 'react';
import UserActionButtons from './UserActionButtons';
import '../styles/UserTable.css';

const UserTable = ({ users, onEdit, onDelete }) => {
  return React.createElement('div', { className: 'user-table-container' },
    React.createElement('table', { className: 'user-table' },
      // Table Header
      React.createElement('thead', null,
        React.createElement('tr', null,
          React.createElement('th', null, 'Username'),
          React.createElement('th', null, 'Full Name'),
          React.createElement('th', null, 'Role'),
          React.createElement('th', null, 'Team'),
          React.createElement('th', null, 'Status'),
          React.createElement('th', null, 'Created Date'),
          React.createElement('th', null, 'Actions')
        )
      ),
      // Table Body
      React.createElement('tbody', null,
        users.length === 0 ?
          React.createElement('tr', null,
            React.createElement('td', { colSpan: 7, className: 'no-data' },
              'No users found. Click "Add New User" to create one.'
            )
          ) :
          users.map(user =>
            React.createElement('tr', { key: user.id },
              React.createElement('td', null,
                React.createElement('span', { className: 'username' }, user.username)
              ),
              React.createElement('td', null, user.fullName),
              React.createElement('td', null,
                React.createElement('span', { 
                  className: `role-badge role-${user.role.toLowerCase()}` 
                }, user.role)
              ),
              React.createElement('td', null, user.teamName || '-'),
              React.createElement('td', null,
                React.createElement('span', {
                  className: `status-badge status-${user.status.toLowerCase()}`
                }, user.status)
              ),
              React.createElement('td', null,
                new Date(user.createdAt).toLocaleDateString('th-TH')
              ),
              React.createElement('td', null,
                React.createElement(UserActionButtons, {
                  user: user,
                  onEdit: () => onEdit(user),
                  onDelete: () => onDelete(user.id)
                })
              )
            )
          )
      )
    )
  );
};

export default UserTable;