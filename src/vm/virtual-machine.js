const Cpu = require('./cpu');
const Alu = require('./alu');
const Memory = require('./memory');
const Registers = require('./registers');

const REGISTER = require('../architecture/sample/register.constant');

/**
 * Virtual machine.
 */
class VirtualMachine {
  constructor(ramSize = 64) {
    this.ram = new Memory(ramSize);
    this.registers = new Registers(REGISTER.ALL);
    this.alu = new Alu(this.ram, this.registers);
    this.flash = new Memory(0);
    this.cpu = new Cpu(this.ram, this.registers, this.alu, this.flash);
  }
}

module.exports = VirtualMachine;
