import { createProxyMiddleware } from 'http-proxy-middleware';

export const staffDataProxy = createProxyMiddleware({
  target: process.env.STAFF_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: (path, req: any) => {
    return req.originalUrl || path;
  },
  on: {
    error: (err, req, res) => {
      console.error('[Gateway] staffDataProxy error:', err.message);
      if ('writeHead' in res) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            error: 'Staff service unavailable',
            details: err.message,
          })
        );
      }
    },
  },
});
