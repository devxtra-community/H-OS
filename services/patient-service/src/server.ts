import 'dotenv/config';
import app from './app';
import logger from './logger';

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Patient Service running on PORT ${PORT}`);
});
