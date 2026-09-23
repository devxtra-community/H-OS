import { createProxyMiddleware } from 'http-proxy-middleware';

export const patientDataProxy = createProxyMiddleware({
  target: process.env.PATIENT_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/patients': '',
  },
  on: {
    error: (err, req, res) => {
      console.error('[Gateway] patientDataProxy error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy Error', details: err.message }));
    },
  },
});
