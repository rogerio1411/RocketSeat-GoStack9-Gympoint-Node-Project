import jwt from 'jsonwebtoken';
// convert a callback function to "async/await" function
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token não encontrado.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    // the second function is the first function return
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);
    req.userName = decoded.name;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};
