import 'dotenv/config';
import app from './app.js';
import logger from './logger.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 API Gateway running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});
