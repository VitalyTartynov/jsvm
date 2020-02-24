const INSTRUCTION = require('../core/instruction.constant');
const REGISTER = require('../core/register.constant');

class Alu {
  constructor(memory, registers) {
    this.memory = memory;
    this.registers = registers;
  }

  fetch8() {
    const address = this.registers.get(REGISTER.IP.address);
    const instruction = this.memory.getUint8(address);
    this.registers.set(REGISTER.IP.address, address + 1);

    return instruction;
  }

  fetch16() {
    const address = this.registers.get(REGISTER.IP.address);
    const instruction = this.memory.getUint16(address);
    this.registers.set(REGISTER.IP.address, address + 2);

    return instruction;
  }

  push(value) {
    const stackAddress = this.registers.get(REGISTER.SP.address);
    this.memory.setUint16(stackAddress, value);
    this.registers.set(REGISTER.SP.address, stackAddress - 2);
  }

  pop() {
    const nextStackAddress = this.registers.get(REGISTER.SP.address) + 2;
    this.registers.set(REGISTER.SP.address, nextStackAddress);

    return this.memory.getUint16(nextStackAddress);
  }
    
  execute(opcode) {
    switch (opcode) {
      case INSTRUCTION.NOP.opcode: {
        return;
      }

      case INSTRUCTION.MOV_LIT_REG.opcode: {
        const literal = this.fetch16();
        const registerAddress = this.fetch8();
        this.registers.set(registerAddress, literal);

        return;
      }

      case INSTRUCTION.MOV_REG_REG.opcode: {
        const registerAddressFrom = this.fetch8();
        const registerAddressTo = this.fetch8();
        const value = this.registers.get(registerAddressFrom);

        this.registers.set(registerAddressTo, value);

        return;
      }

      case INSTRUCTION.MOV_REG_MEM.opcode: {
        const registerAddressFrom = this.fetch8();
        const memoryAddressTo = this.fetch16();
        const value = this.registers.get(registerAddressFrom);
        this.memory.setUint16(memoryAddressTo, value);

        return;
      }

      case INSTRUCTION.MOV_MEM_REG.opcode: {
        const memoryAddressFrom = this.fetch16();
        const registerAddressTo = this.fetch8();
        const value = this.memory.getUint16(memoryAddressFrom);
        this.registers.set(registerAddressTo, value);

        return;
      }

      case INSTRUCTION.ADD_REG_REG.opcode: {
        const firstRegisterAddress = this.fetch8();
        const firstValue = this.registers.get(firstRegisterAddress);

        const secondRegisterAddress = this.fetch8();
        const secondValue = this.registers.get(secondRegisterAddress);

        this.registers.set(REGISTER.AC.address, firstValue + secondValue);

        return;
      }

      case INSTRUCTION.SUB_REG_REG.opcode: {
        const firstRegisterAddress = this.fetch8();
        const firstValue = this.registers.get(firstRegisterAddress);

        const secondRegisterAddress = this.fetch8();
        const secondValue = this.registers.get(secondRegisterAddress);

        this.registers.set(REGISTER.AC.address, firstValue - secondValue);

        return;
      }
            
      case INSTRUCTION.JMP.opcode: {
        const address = this.fetch16();
        this.registers.set(REGISTER.IP.address, address);
                
        return;
      }

      case INSTRUCTION.JMP_EQ.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value === this.registers.get(REGISTER.AC.address)) {
          this.registers.set(REGISTER.IP.address, address);
        }

        return;
      }

      case INSTRUCTION.JMP_NOT_EQ.opcode: {
        const value = this.fetch16();
        const address = this.fetch16();
        if (value !== this.registers.get(REGISTER.AC.address)) {
          this.registers.set(REGISTER.IP.address, address);
        }

        return;
      }

      case INSTRUCTION.PSH_LIT.opcode: {
        const value = this.fetch16();
        this.push(value);

        return;
      }

      case INSTRUCTION.PSH_REG.opcode: {
        const registerAddress = this.fetch8();
        this.push(this.registers.get(registerAddress));

        return;
      }

      case INSTRUCTION.POP.opcode: {
        const registerAddress = this.fetch8();
        const value = this.pop();
        this.registers.set(registerAddress, value);

        return;
      }
            
      default: {
        throw new Error(`Tried to execute unknown opcode ${opcode}. ALU stopped.`);
      }
    }
  }
}

module.exports = Alu;
