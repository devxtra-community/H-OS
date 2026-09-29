export const env = {
  API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL &&
    !process.env.NEXT_PUBLIC_API_BASE_URL.includes('railway')
      ? process.env.NEXT_PUBLIC_API_BASE_URL
      : '/api',
};
