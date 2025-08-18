export const Configuration = {
  backend_url: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
} as const;
