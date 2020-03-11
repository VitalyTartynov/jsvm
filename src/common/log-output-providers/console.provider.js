
class ConsoleProvider {

  /**
   * Log message to console
   * @param {string} message Message string
   * @returns {undefined}
   */
  log(message) {
    console.log(message);
  }

  /**
   * Log error message to console
   * @param {string} message Error message string
   * @returns {undefined}
   */
  error(message) {
    console.error(message);
  }
}

module.exports = ConsoleProvider;
