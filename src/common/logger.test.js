const Logger = require('./logger');

const LOGLEVEL = require('./log-level.constant'); 

describe('Logger', () => {
  let logger;
  let testProvider;
  
  beforeEach(() => {
    testProvider = {};
    testProvider.debug = jest.fn();
    testProvider.info = jest.fn();
    testProvider.warn = jest.fn();
    testProvider.error = jest.fn();
    testProvider.fatal = jest.fn();
    
    logger = new Logger(testProvider);    
  });
  
  test('should be created', () => {
    expect(logger).toBeTruthy();
    expect(logger.logLevel).toBe(LOGLEVEL.ERROR); // it's default log level
  });
  
  test('should log all messages', () => {
    logger.logLevel = LOGLEVEL.ALL;
    
    logger.debug('debug log message');
    logger.info('info log message');
    logger.warn('warn log message');
    logger.error('error log message');
    logger.fatal('fatal log message');
        
    expect(testProvider.debug).toBeCalledTimes(1);
    expect(testProvider.info).toBeCalledTimes(1);
    expect(testProvider.warn).toBeCalledTimes(1);
    expect(testProvider.error).toBeCalledTimes(1);
    expect(testProvider.fatal).toBeCalledTimes(1);
  });

  test('should log messages on DEBUG log level', () => {
    logger.logLevel = LOGLEVEL.DEBUG;

    logger.debug('debug log message');
    logger.info('info log message');
    logger.warn('warn log message');
    logger.error('error log message');
    logger.fatal('fatal log message');

    expect(testProvider.debug).toBeCalledTimes(1);
    expect(testProvider.info).toBeCalledTimes(1);
    expect(testProvider.warn).toBeCalledTimes(1);
    expect(testProvider.error).toBeCalledTimes(1);
    expect(testProvider.fatal).toBeCalledTimes(1);
  });

  test('should log messages on INFO log level', () => {
    logger.logLevel = LOGLEVEL.INFO;

    logger.debug('debug log message');
    logger.info('info log message');
    logger.warn('warn log message');
    logger.error('error log message');
    logger.fatal('fatal log message');

    expect(testProvider.debug).toBeCalledTimes(0);
    expect(testProvider.info).toBeCalledTimes(1);
    expect(testProvider.warn).toBeCalledTimes(1);
    expect(testProvider.error).toBeCalledTimes(1);
    expect(testProvider.fatal).toBeCalledTimes(1);
  });

  test('should log messages on WARN log level', () => {
    logger.logLevel = LOGLEVEL.WARN;

    logger.debug('debug log message');
    logger.info('info log message');
    logger.warn('warn log message');
    logger.error('error log message');
    logger.fatal('fatal log message');

    expect(testProvider.debug).toBeCalledTimes(0);
    expect(testProvider.info).toBeCalledTimes(0);
    expect(testProvider.warn).toBeCalledTimes(1);
    expect(testProvider.error).toBeCalledTimes(1);
    expect(testProvider.fatal).toBeCalledTimes(1);
  });

  test('should log messages on ERROR log level', () => {
    logger.logLevel = LOGLEVEL.ERROR;

    logger.debug('debug log message');
    logger.info('info log message');
    logger.warn('warn log message');
    logger.error('error log message');
    logger.fatal('fatal log message');

    expect(testProvider.debug).toBeCalledTimes(0);
    expect(testProvider.info).toBeCalledTimes(0);
    expect(testProvider.warn).toBeCalledTimes(0);
    expect(testProvider.error).toBeCalledTimes(1);
    expect(testProvider.fatal).toBeCalledTimes(1);
  });

  test('should log messages on FATAL log level', () => {
    logger.logLevel = LOGLEVEL.FATAL;

    logger.debug('debug log message');
    logger.info('info log message');
    logger.warn('warn log message');
    logger.error('error log message');
    logger.fatal('fatal log message');

    expect(testProvider.debug).toBeCalledTimes(0);
    expect(testProvider.info).toBeCalledTimes(0);
    expect(testProvider.warn).toBeCalledTimes(0);
    expect(testProvider.error).toBeCalledTimes(0);
    expect(testProvider.fatal).toBeCalledTimes(1);
  });

  test('should not log messages on OFF log level', () => {
    logger.logLevel = LOGLEVEL.OFF;

    logger.debug('debug log message');
    logger.info('info log message');
    logger.warn('warn log message');
    logger.error('error log message');
    logger.fatal('fatal log message');

    expect(testProvider.debug).toBeCalledTimes(0);
    expect(testProvider.info).toBeCalledTimes(0);
    expect(testProvider.warn).toBeCalledTimes(0);
    expect(testProvider.error).toBeCalledTimes(0);
    expect(testProvider.fatal).toBeCalledTimes(0);
  });
});
