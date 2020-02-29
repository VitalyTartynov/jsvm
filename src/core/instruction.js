const format = require('../common/format');

class Instruction {
  /**
     * CPU instruction instance
     * @param opcode Operation code.
     * @param mnemonic Assemble command.
     * @param description Some description about instruction and operands.
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
