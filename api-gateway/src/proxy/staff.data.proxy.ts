import { createProxyMiddleware } from 'http-proxy-middleware';

export const staffDataProxy = createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,

  // /staff/* → /staff/*
  pathRewrite: (path) => `/staff${path}`,
});
