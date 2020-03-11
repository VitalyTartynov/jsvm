const LOGLEVEL = require('./log-level.constant');

class Logger {
  constructor(outputProvider, logLevel = LOGLEVEL.ERROR) {
    this.outputProvider = outputProvider;
    this.logLevel = logLevel;
  }

  /**
   * Log debug message
   * @param {string} message Debug message string
   * @returns {undefined}
   */
  debug(message) {
    if (this.logLevel <= LOGLEVEL.DEBUG) {
      this.outputProvider.debug(message);
    }    
  }

  /**
   * Log info message
   * @param {string} message Info message string
   * @returns {undefined}
   */
  info(message) {
    if (this.logLevel <= LOGLEVEL.INFO) {
      this.outputProvider.info(message);
    }
  }

  /**
   * Log warning message
   * @param {string} message Warning message string
   * @returns {undefined}
   */
  warn(message) {
    if (this.logLevel <= LOGLEVEL.WARN) {
      this.outputProvider.warn(message);
    }
  }

  /**
   * Log error message 
   * @param {string} message Error message string
   * @returns {undefined}
   */
  error(message) {
    if (this.logLevel <= LOGLEVEL.ERROR) {
      this.outputProvider.error(message);
    }    
  }

  /**
   * Log fatal message
   * @param {string} message Fatal message string
   * @returns {undefined}
   */
  fatal(message) {
    if (this.logLevel <= LOGLEVEL.FATAL) {
      this.outputProvider.fatal(message);
    }
  }
}

module.exports = Logger;
