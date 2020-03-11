const REGISTER = require('../architecture/sample/register.constant');

/**
 * Central processor unit.
 */
class Cpu {
  constructor(ram, registers, alu, flash) {
    this.ram = ram;
    this.registers = registers;
    this.alu = alu;
    this.flash = flash;

    // VM 16 bit, we should have ability to PUSH 2 bytes to stack.
    this.stackPointerInitial = this.ram.length - 2;
    this.registers.set(REGISTER.SP.address, this.stackPointerInitial);
  }
        
  tick() {
    const opcode = this.alu.fetch8();
        
    return this.alu.execute(opcode);
  }
  
  run() {
    let isHalt = false;
    do {
      isHalt = this.tick();
    } while (!isHalt);
  }
}

module.exports = Cpu;
