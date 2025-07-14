import db from '../../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const JWT_SECRET =
  '8Zz5tw0Ionm3XPZZfN0NOml3z9FMfmasdjann823n4nu889fn24f92894';
export const JWT_EXPIRES_IN = '1w';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Користувач з даним логіном не існує' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Пароль введено не вірно' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: error?.message });
  }
};
