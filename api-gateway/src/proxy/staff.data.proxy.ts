import { createProxyMiddleware } from 'http-proxy-middleware';

export const staffDataProxy = createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: (path, req: any) => {
    if (req.originalUrl.startsWith('/admin')) {
      return `/admin${path}`;
    }

    if (req.originalUrl.startsWith('/staff')) {
      return `/staff${path}`;
    }

    return path;
  },
});
