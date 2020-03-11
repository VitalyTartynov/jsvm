const LOGLEVEL = require('./log-level.constant');

class Logger {
  constructor(outputProvider, logLevel = LOGLEVEL.ERROR) {
    this.outpuProvider = outputProvider;
    this.logLevel = logLevel;
  }

  /**
   * Log message
   * @param {string} message Message string
   * @returns {undefined}
   */
  debug(message) {
    if (this.logLevel >= LOGLEVEL.DEBUG) {
      this.outpuProvider.log(message);
    }    
  }

  /**
   * Log error message 
   * @param {string} message Error message string
   * @returns {undefined}
   */
  error(message) {
    if (this.logLevel >= LOGLEVEL.ERROR) {
      this.outpuProvider.error(message);
    }    
  }
}

module.exports = Logger;
