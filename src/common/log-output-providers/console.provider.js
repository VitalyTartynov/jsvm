
class ConsoleProvider {

  /**
   * Log debug message to console
   * @param {string} message Debug message string
   * @returns {undefined}
   */
  debug(message) {
    console.debug(message);
  }

  /**
   * Log info message to console
   * @param {string} message Info message string
   * @returns {undefined}
   */
  info(message) {
    console.info(message);
  }

  /**
   * Log warning message to console
   * @param {string} message Warning message string
   * @returns {undefined}
   */
  warn(message) {
    console.warn(message);
  }

  /**
   * Log error message to console
   * @param {string} message Error message string
   * @returns {undefined}
   */
  error(message) {
    console.error(message);
  }

  /**
   * Log fatal message to console
   * @param {string} message Fatal message string
   * @returns {undefined}
   */
  fatal(message) {
    console.error(message);
  }
}

module.exports = ConsoleProvider;
