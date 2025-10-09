// services/authService.js
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

/**
 * Authentication Service
 * เพิ่ม loginWithoutPassword method
 */
const authService = {
  /**
   * 🆕 Login without password (using username only)
   * @param {string} username - User username/code
   * @returns {Promise<Object>} Auth result with token
   */
  loginWithoutPassword: async (username) => {
    try {
      // 1. Find user by username
      const user = await userRepository.findByUsername(username);

      if (!user) {
        throw new Error('Invalid username');
      }

      // 2. Check if user is active
      if (user.status !== 'Active') {
        throw new Error('User account is inactive');
      }

      // 3. Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // 4. Update last login timestamp
      await userRepository.updateLastLogin(user.id);

      // Get team name (if any)
      let teamName = null;
      if (user.teamId) {
        const team = await userRepository.findTeamById(user.teamId);
        teamName = team?.teamName || null;
      }

      // 5. Return user data และ token
      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          teamId: user.teamId,
          teamName: teamName
        },
        token: token,
        expiresIn: JWT_EXPIRES_IN
      };
    } catch (error) {
      console.error('Error in loginWithoutPassword:', error);
      throw error;
    }
  },

  /**
   * Verify JWT token
   */
  verifyToken: (token) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
};

module.exports = authService;