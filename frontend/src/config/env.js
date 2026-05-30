const trimTrailingSlash = (value) => value?.replace(/\/+$/, '');

export const env = {
  apiUrl: trimTrailingSlash(import.meta.env.VITE_API_URL || '/api'),
  appName: import.meta.env.VITE_APP_NAME || 'AECCENTRIC EMS',
  companyName: import.meta.env.VITE_COMPANY_NAME || 'AECCENTRIC',
};

export const isProduction = import.meta.env.PROD;
