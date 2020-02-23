const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

class Cpu {
    constructor(memory, registers) {
        this.memory = memory;
        this.registers = registers;

        // VM 16 bit, we should have ability to PUSH 2 bytes to stack
        this.stackPointerInitial = this.memory.length - 2;
        this.registers.set(REGISTERS.SP.address, this.stackPointerInitial);
    }
        
    fetch8() {
        const address = this.registers.get(REGISTERS.IP.address);
        const instruction = this.memory.getUint8(address);
        this.registers.set(REGISTERS.IP.address, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.registers.get(REGISTERS.IP.address);
        const instruction = this.memory.getUint16(address);
        this.registers.set(REGISTERS.IP.address, address + 2);

        return instruction;
    }
    
    push(value) {
        const stackAddress = this.registers.get(REGISTERS.SP.address);
        this.memory.setUint16(stackAddress, value);
        this.registers.set(REGISTERS.SP.address, stackAddress - 2);        
    }
    
    pop() {
        const nextStackAddress = this.registers.get(REGISTERS.SP.address) + 2;
        this.registers.set(REGISTERS.SP.address, nextStackAddress);
        
        return this.memory.getUint16(nextStackAddress);
    }
    
    tick() {
        const instruction = this.fetch8();
        
        return this.execute(instruction);
    }
    
    execute(instruction) {
        switch (instruction) {
            case INSTRUCTIONS.MOV_LIT_REG.opcode: {
                const literal = this.fetch16();
                const registerAddress = this.fetch8();
                this.registers.set(registerAddress, literal);
            
                return;
            }
        
            case INSTRUCTIONS.MOV_REG_REG.opcode: {
                const registerAddressFrom = this.fetch8();
                const registerAddressTo = this.fetch8();
                const value = this.registers.get(registerAddressFrom);
                
                this.registers.set(registerAddressTo, value);
            
                return;
            }
        
            case INSTRUCTIONS.MOV_REG_MEM.opcode: {
                const registerAddressFrom = this.fetch8();
                const memoryAddressTo = this.fetch16();
                const value = this.registers.get(registerAddressFrom);
                this.memory.setUint16(memoryAddressTo, value);
                
                return;
            }
            
            case INSTRUCTIONS.MOV_MEM_REG.opcode: {
                const memoryAddressFrom = this.fetch16();
                const registerAddressTo = this.fetch8();
                const value = this.memory.getUint16(memoryAddressFrom);
                this.registers.set(registerAddressTo, value);
                
                return;
            }
        
            case INSTRUCTIONS.ADD_REG_REG.opcode: {
                const firstRegisterAddress = this.fetch8();
                const firstValue = this.registers.get(firstRegisterAddress);
                
                const secondRegisterAddress = this.fetch8();
                const secondValue = this.registers.get(secondRegisterAddress);
                
                this.registers.set(REGISTERS.ACC.address, firstValue + secondValue);
            
                return;
            }
            
            case INSTRUCTIONS.SUB_REG_REG.opcode: {
                const firstRegisterAddress = this.fetch8();
                const firstValue = this.registers.get(firstRegisterAddress);

                const secondRegisterAddress = this.fetch8();
                const secondValue = this.registers.get(secondRegisterAddress);

                this.registers.set(REGISTERS.ACC.address, firstValue - secondValue);

                return;
            }
            
            case INSTRUCTIONS.JMP_EQ.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value === this.registers.get(REGISTERS.ACC.address)) {
                    this.registers.set(REGISTERS.IP.address, address);
                }
                
                return;
            }
            
            case INSTRUCTIONS.JMP_NOT_EQ.opcode: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value !== this.registers.get(REGISTERS.ACC.address)) {
                    this.registers.set(REGISTERS.IP.address, address);
                }
                
                return;
            }
            
            case INSTRUCTIONS.PSH_LIT.opcode: {
                const value = this.fetch16();
                this.push(value);
                
                return;                
            }
            
            case INSTRUCTIONS.PSH_REG.opcode: {
                const registerAddress = this.fetch8();
                this.push(this.registers.get(registerAddress));
                
                return;
            }
            
            case INSTRUCTIONS.POP.opcode: {
                const registerAddress = this.fetch8();
                const value = this.pop();
                this.registers.set(registerAddress, value);
                
                return;
            }            
        }
    }
}

module.exports = Cpu;
