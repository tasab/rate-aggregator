import db from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from './login.js';

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
      JWT_SECRET, // Make sure to set this in your environment variables
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return res.status(201).json({
      id: user.id,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
};
