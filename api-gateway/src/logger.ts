import baseLogger from '../../services/shared/src/logger';

const logger = baseLogger.child({
  service: 'api-gateway',
});

export default logger;
