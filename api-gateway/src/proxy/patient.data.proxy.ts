import { createProxyMiddleware } from 'http-proxy-middleware';

export const patientDataProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,

  // /patients/:id → /patients/:id (re-add prefix)
  pathRewrite: (path) => `/patients${path}`,
});
