import jwt from 'jsonwebtoken';

const JWT_SECRET = '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmasdjann823n4nu889fn24f92894';

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = header.split(' ')[1];
  console.log('here1');
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error, 'Failed - authMiddleware');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authMiddleware;
