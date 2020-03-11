const Logger = require('./logger');
const ConsoleProvider = require('./log-output-providers/console.provider');

describe('Logger', () => {
  let logger;
  let consoleProvider;
  
  beforeEach(() => {
    consoleProvider = new ConsoleProvider();
    logger = new Logger(consoleProvider);    
  });
  
  test('should be created', () => {
    expect(logger).toBeTruthy();
  });
  
  test('should log message', () => {
    logger.log = jest.fn();
    
    logger.log('test log message');
    
    expect(logger.log).toBeCalledTimes(1);
  });

  test('should error message', () => {
    logger.error = jest.fn();
    
    logger.error('test error message');
    
    expect(logger.error).toBeCalledTimes(1);
  });
});
