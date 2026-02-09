import { createProxyMiddleware } from 'http-proxy-middleware';

export const patientAuthProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,

  // /patients/public/auth/login → /auth/login
  pathRewrite: {
    '^/patients/public': '',
  },
});
