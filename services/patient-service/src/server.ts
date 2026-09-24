import 'dotenv/config';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import app from './app';
import logger from './logger';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  logger.info(`Patient Service running on PORT ${PORT}`);
});
