export const Configuration = {
  backend_url: import.meta.env.VITE_BACKEND_URL || 'localhost:3000',
} as const;
