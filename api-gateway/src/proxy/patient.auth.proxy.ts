import { createProxyMiddleware } from 'http-proxy-middleware';

export const patientAuthProxy = createProxyMiddleware({
  target: process.env.PATIENT_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/patients/public': '',
  },
  on: {
    error: (err, req, res) => {
      console.error('[Gateway] patientAuthProxy error:', err.message);
      if ('writeHead' in res) {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Proxy Error', details: err.message }));
      }
    },
  },
});
