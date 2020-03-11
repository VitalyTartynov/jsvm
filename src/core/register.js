class Register {
  /**
   * Register instance
   * @param {string} name Human-friendly name of register.
   * @param {number} address Address of register in internal register memory.
   * @param {string} description Some description about register.
   */
  constructor(name, address, description) {
    this.name = name;
    this.address = address;
    this.description = description;
  }
}

module.exports = Register;
