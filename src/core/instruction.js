const format = require('../common/format');

/**
 * CPU instruction information.
 */
class Instruction {
  /**
     * CPU instruction instance.
     * @param {number} opcode Operation code.
     * @param {string} mnemonic Assemble command.
     * @param {string} description Some description about instruction and operands.
     */
  constructor(opcode, mnemonic, description) {
    this.mnemonic = mnemonic;
    this.opcode = opcode;
    this.description = description;
  }
    
  toString() {
    return `${this.mnemonic} \t: ${format.asByte(this.opcode)} \t: ${this.description}`;
  }
}

module.exports = Instruction;
