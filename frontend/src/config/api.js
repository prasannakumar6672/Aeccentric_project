import { env } from './env';

export const API_BASE_URL = env.apiUrl;

export const apiEndpoint = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
