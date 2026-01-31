import 'dotenv/config';
import app from './app.js';
import logger from './logger.js';

const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`API Gateway running on PORT ${PORT}`);
});
