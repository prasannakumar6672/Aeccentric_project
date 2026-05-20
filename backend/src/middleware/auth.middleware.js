import asyncHandler from 'express-async-handler';
import { verifyAccessToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';

/**
 * Protect route — verifies Bearer JWT access token
 */
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorised — no token');
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyAccessToken(token); // throws if invalid/expired
  const user = await User.findById(decoded.id).select('-password -refreshToken');

  if (!user || !user.isActive) {
    res.status(401);
    throw new Error('Not authorised — user not found or inactive');
  }

  req.user = user;
  next();
});
