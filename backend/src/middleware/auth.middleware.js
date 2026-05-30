import asyncHandler from 'express-async-handler';
import { verifyAccessToken } from '../utils/tokenUtils.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';

/**
 * Protect route — verifies Bearer JWT access token
 */
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Not authorised — no token');
    error.statusCode = 401;
    res.status(401);
    throw error;
  }

  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    const error = new Error('Not authorised — token is invalid or malformed');
    error.statusCode = 401;
    res.status(401);
    throw error;
  }

  const user = await User.findById(decoded.id).select('-password -refreshToken');

  if (!user || !user.isActive) {
    const error = new Error('Not authorised — user not found or inactive');
    error.statusCode = 401;
    res.status(401);
    throw error;
  }

  const employee = await Employee.findOne({ userId: user._id }).select('_id employeeId');
  req.user = user;
  req.user.employeeProfileId = employee?._id;
  req.user.employeeId = employee?.employeeId || '';
  req.auth = {
    id: user._id.toString(),
    role: user.role,
    employeeId: employee?.employeeId || '',
    employeeProfileId: employee?._id?.toString() || '',
  };
  next();
});
