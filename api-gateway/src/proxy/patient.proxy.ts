import { createProxyMiddleware } from 'http-proxy-middleware';

export const patientProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/patients': '',
  },
});
