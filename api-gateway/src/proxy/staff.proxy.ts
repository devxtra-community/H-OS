import { createProxyMiddleware } from 'http-proxy-middleware';

export const staffProxy = createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/staff': '',
  },
});
