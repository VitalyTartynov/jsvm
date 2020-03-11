const Logger = require('./logger');

describe('Logger', () => {
  let logger;
  
  beforeEach(() => {
    logger = new Logger(null);    
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
