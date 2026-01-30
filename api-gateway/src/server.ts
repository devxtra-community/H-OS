import app from './app.js';
import logger from './logger.js';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on PORT ${PORT}`);
});
