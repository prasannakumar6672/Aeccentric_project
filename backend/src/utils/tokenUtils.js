import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

/**
 * Generate a short-lived access token (15m default)
 */
export const generateAccessToken = (userId, role) =>
  jwt.sign({ id: userId, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

/**
 * Generate a long-lived refresh token (7d default)
 */
export const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, env.refreshTokenSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });

/**
 * Verify access token
 */
export const verifyAccessToken = (token) =>
  jwt.verify(token, env.jwtSecret);

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token) =>
  jwt.verify(token, env.refreshTokenSecret);
