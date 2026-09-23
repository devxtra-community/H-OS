import 'dotenv/config';
import app from './app';
import logger from './logger';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  logger.info(`Staff Service running on PORT ${PORT}`);
});
