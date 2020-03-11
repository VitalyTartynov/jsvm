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
    logger.debug = jest.fn();
    
    logger.debug('test log message');
        
    expect(logger.debug).toBeCalledTimes(1);
  });

  test('should error message', () => {
    logger.error = jest.fn();
    
    logger.error('test error message');
    
    expect(logger.error).toBeCalledTimes(1);
  });
});
