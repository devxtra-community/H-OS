import { createProxyMiddleware } from 'http-proxy-middleware';

export const patientProxy = createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,

  // ✅ add back /patients prefix
  pathRewrite: (path) => `/patients${path}`,

  on: {
    proxyReq: (proxyReq, req) => {
      console.log(' GATEWAY PROXY:', req.method, req.url, '->', proxyReq.path);
    },
  },
});
