import baseLogger from '../../shared/src/logger';

const logger = baseLogger.child({
  service: 'patient-service',
});

export default logger;
