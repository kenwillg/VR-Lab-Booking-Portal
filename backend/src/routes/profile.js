import express from 'express';
import { getUserById, users } from '../data/mockData.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

// Get current user profile
router.get('/', (req, res) => {
  const userId = req.user.userId;
  const user = getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
    });
  }

  // Return user without password
  const { password, ...userWithoutPassword } = user;
  res.json({
    success: true,
    data: userWithoutPassword,
  });
});

// Update user profile
router.put('/', (req, res) => {
  try {
    const userId = req.user.userId;
    const user = getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const { name, nim, nidn, programStudi, fakultas } = req.body;

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (nim !== undefined) user.nim = nim;
    if (nidn !== undefined) user.nidn = nidn;
    if (programStudi !== undefined) user.programStudi = programStudi;
    if (fakultas !== undefined) user.fakultas = fakultas;
    user.updatedAt = new Date().toISOString();

    // Return updated user without password
    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;

