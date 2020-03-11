
class Logger {
  constructor(outputProvider) {
    this.outpuProvider = outputProvider;
  }

  /**
   * Log message
   * @param message Message string
   */
  log(message) {
    this.outpuProvider.log(message);
  }

  /**
   * Log error message 
   * @param message Error message string
   */
  error(message) {
    this.outpuProvider.error(message);
  }
}

module.exports = Logger;
