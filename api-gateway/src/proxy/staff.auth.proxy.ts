import { createProxyMiddleware } from 'http-proxy-middleware';

export const staffAuthProxy = createProxyMiddleware({
  target: process.env.STAFF_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,

  // /staff/public/auth/login → /auth/login
  pathRewrite: {
    '^/staff/public': '',
  },
});
