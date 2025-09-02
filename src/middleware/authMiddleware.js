import jwt from 'jsonwebtoken';
import { LOG_ERROR, logger } from '../utils/logger.js';

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger(error, 'Failed to load: authMiddleware', LOG_ERROR);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
