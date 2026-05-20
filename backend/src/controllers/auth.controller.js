import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js';
import { sendEmail } from '../config/email.js';

/* ── Helper: send refresh token as HttpOnly cookie ── */
const setRefreshCookie = (res, token) => {
  res.cookie('ems_refresh', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/signup
   Body: { fullName, email, password, role?, department?, designation? }
   Note: In production use invite tokens; role defaults to 'employee'
───────────────────────────────────────────────────────────── */
export const signup = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, department, designation } = req.body;

  if (!fullName || !email || !password) {
    res.status(400); throw new Error('fullName, email, and password are required');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) { res.status(409); throw new Error('Email already registered'); }

  // Create User (password hashed in pre-save hook)
  const user = await User.create({ email, password, role: role || 'employee' });

  // Create linked Employee profile
  await Employee.create({ userId: user._id, fullName, department, designation });

  // Tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    accessToken,
    user: { id: user._id, email: user.email, role: user.role, fullName },
  });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/login
   Body: { email, password }
───────────────────────────────────────────────────────────── */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400); throw new Error('Email and password are required'); }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
  if (!user || !user.isActive) { res.status(401); throw new Error('Invalid credentials'); }

  const match = await user.comparePassword(password);
  if (!match) { res.status(401); throw new Error('Invalid credentials'); }

  // Fetch employee profile for fullName
  const employee = await Employee.findOne({ userId: user._id }).select('fullName employeeId profilePhoto department designation');

  // Tokens
  const accessToken = generateAccessToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  res.json({
    success: true,
    message: 'Login successful',
    accessToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: employee?.fullName || '',
      employeeId: employee?.employeeId || '',
      profilePhoto: employee?.profilePhoto || '',
      department: employee?.department || '',
      designation: employee?.designation || '',
    },
  });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/logout
───────────────────────────────────────────────────────────── */
export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.ems_refresh;
  if (token) {
    // Clear stored refresh token in DB
    await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null });
  }
  res.clearCookie('ems_refresh');
  res.json({ success: true, message: 'Logged out successfully' });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/refresh
   Reads HttpOnly cookie 'ems_refresh'
───────────────────────────────────────────────────────────── */
export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.ems_refresh;
  if (!token) { res.status(401); throw new Error('No refresh token'); }

  const decoded = verifyRefreshToken(token); // throws if invalid
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) { res.status(401); throw new Error('Refresh token invalid or rotated'); }

  // Rotate refresh token (security best practice)
  const newAccess = generateAccessToken(user._id, user.role);
  const newRefresh = generateRefreshToken(user._id);
  user.refreshToken = newRefresh;
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, newRefresh);

  res.json({ success: true, accessToken: newAccess });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/forgot-password
   Body: { email }
───────────────────────────────────────────────────────────── */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  // Always respond 200 to prevent user enumeration
  if (!user) return res.json({ success: true, message: 'If that email exists, an OTP has been sent.' });

  const otp = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  user.passwordResetOTP = otp;
  user.passwordResetExpires = expiresAt;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: 'AECCENTRIC EMS — Password Reset OTP',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:auto">
        <h2 style="color:#0F172A">Password Reset Request</h2>
        <p style="color:#64748b">Use this OTP to reset your AECCENTRIC EMS password. It expires in <strong>15 minutes</strong>.</p>
        <div style="font-size:36px;font-weight:900;letter-spacing:8px;color:#2F5BFF;margin:32px 0">${otp}</div>
        <p style="color:#94a3b8;font-size:13px">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });

  res.json({ success: true, message: 'If that email exists, an OTP has been sent.' });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/auth/reset-password
   Body: { email, otp, newPassword }
───────────────────────────────────────────────────────────── */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() })
    .select('+passwordResetOTP +passwordResetExpires +password');

  if (!user || user.passwordResetOTP !== otp || user.passwordResetExpires < new Date()) {
    res.status(400); throw new Error('Invalid or expired OTP');
  }

  user.password = newPassword;
  user.passwordResetOTP = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
});

/* ─────────────────────────────────────────────────────────────
   GET /api/auth/me
   Returns current authenticated user + employee profile
───────────────────────────────────────────────────────────── */
export const getMe = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id })
    .populate('reportsTo', 'fullName employeeId');

  res.json({ success: true, user: req.user, employee });
});
