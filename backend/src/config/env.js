import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];

const getEnv = (key, fallback) => {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
};

const requireEnv = (key) => {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const env = {
  port: Number(getEnv('PORT', 5000)),
  nodeEnv: getEnv('NODE_ENV', 'development'),
  clientUrl: getEnv('CLIENT_URL', 'http://localhost:5173,http://127.0.0.1:5173'),
  mongoUri: requireEnv('MONGODB_URI'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '15m'),
  refreshTokenSecret: requireEnv('REFRESH_TOKEN_SECRET'),
  refreshTokenExpiresIn: getEnv('REFRESH_TOKEN_EXPIRES_IN', '7d'),
  smtp: {
    host: getEnv('SMTP_HOST'),
    port: Number(getEnv('SMTP_PORT', 587)),
    user: getEnv('SMTP_USER'),
    pass: getEnv('SMTP_PASS'),
  },
};

export const validateEnv = () => {
  requiredEnv.forEach(requireEnv);
  if (env.nodeEnv === 'production') {
    requireEnv('CLIENT_URL');
  }
};

export const isProduction = env.nodeEnv === 'production';
