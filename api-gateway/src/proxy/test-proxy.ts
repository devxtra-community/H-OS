import { createProxyMiddleware } from 'http-proxy-middleware';

// SUPER SIMPLE - no options that could interfere
const testProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
});

export { testProxy };
