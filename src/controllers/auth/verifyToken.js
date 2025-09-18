import jwt from 'jsonwebtoken';
import db from '../../models/index.js';

export const verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'Auth token not present',
        valid: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: 'User not fount',
        valid: false,
      });
    }

    return res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    // Token is invalid or expired
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Token not valid',
        valid: false,
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token is expired',
        valid: false,
      });
    }

    return res.status(500).json({
      message: error?.message,
      valid: false,
    });
  }
};
