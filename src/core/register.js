class Register {
  /**
   * Register instance
   * @param name Human-friendly name of register.
   * @param address Address of register in internal register memory.
   * @param description Some description about register.
   */
  constructor(name, address, description) {
    this.name = name;
    this.address = address;
    this.description = description;
  }
}

module.exports = Register;
