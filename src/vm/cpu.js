const INSTRUCTION = require('../core/instruction.constant');
const REGISTER = require('../core/register.constant');

class Cpu {
    constructor(memory, registers) {
        this.memory = memory;
        this.registers = registers;

        // VM 16 bit, we should have ability to PUSH 2 bytes to stack
        this.stackPointerInitial = this.memory.length - 2;
        this.registers.set(REGISTER.SP.address, this.stackPointerInitial);
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
    
    tick() {
        const instruction = this.fetch8();
        
        return this.execute(instruction);
    }
    
    execute(instruction) {
        switch (instruction) {
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
                
                this.registers.set(REGISTER.ACC.address, firstValue + secondValue);
            
                return;
            }
            
            case INSTRUCTION.SUB_REG_REG.opcode: {
                const firstRegisterAddress = this.fetch8();
                const firstValue = this.registers.get(firstRegisterAddress);

                const secondRegisterAddress = this.fetch8();
                const secondValue = this.registers.get(secondRegisterAddress);

                this.registers.set(REGISTER.ACC.address, firstValue - secondValue);

                return;
            }
            
            case INSTRUCTION.JMP_EQ.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value === this.registers.get(REGISTER.ACC.address)) {
                    this.registers.set(REGISTER.IP.address, address);
                }
                
                return;
            }
            
            case INSTRUCTION.JMP_NOT_EQ.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value !== this.registers.get(REGISTER.ACC.address)) {
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
        }
    }
}

module.exports = Cpu;
