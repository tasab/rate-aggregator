import db from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LOG_ERROR, logger } from '../../utils/logger.js';

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await db.User.findOne({ where: { email } });
    if (existing) {
      return res
        .status(400)
        .json({ message: 'Користувач з таким логіном вже існує' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await db.User.create({ email, password: hashed });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(201).json({
      id: user.id,
      email: user.email,
      token,
    });
  } catch (error) {
    logger(error, 'Failed to load: register', LOG_ERROR);
    return res.status(500).json({ message: error?.message });
  }
};
