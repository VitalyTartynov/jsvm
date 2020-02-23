const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

class Cpu {
    constructor(memory, registers) {
        this.memory = memory;
        this.registers = registers;

        // VM 16 bit, we should have ability to PUSH 2 bytes to stack
        this.stackPointerInitial = this.memory.length - 2;
        this.registers.setValueByName(REGISTERS.SP, this.stackPointerInitial);
    }
        
    fetch8() {
        const address = this.registers.getValueByName(REGISTERS.IP);
        const instruction = this.memory.getUint8(address);
        this.registers.setValueByName(REGISTERS.IP, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.registers.getValueByName(REGISTERS.IP);
        const instruction = this.memory.getUint16(address);
        this.registers.setValueByName(REGISTERS.IP, address + 2);

        return instruction;
    }
    
    push(value) {
        const stackAddress = this.registers.getValueByName(REGISTERS.SP);
        this.memory.setUint16(stackAddress, value);
        this.registers.setValueByName(REGISTERS.SP, stackAddress - 2);        
    }
    
    pop() {
        const nextStackAddress = this.registers.getValueByName(REGISTERS.SP) + 2;
        this.registers.setValueByName(REGISTERS.SP, nextStackAddress);
        
        return this.memory.getUint16(nextStackAddress);
    }
    
    tick() {
        const instruction = this.fetch8();
        
        return this.execute(instruction);
    }
    
    execute(instruction) {
        switch (instruction) {
            case INSTRUCTIONS.MOV_LIT_REG: {
                const literal = this.fetch16();
                const registerAddress = this.registers.getAddressByName(this.fetch8());
                this.registers.setValueByAddress(registerAddress, literal);
            
                return;
            }
        
            case INSTRUCTIONS.MOV_REG_REG: {
                const registerAddressFrom = this.registers.getAddressByName(this.fetch8());
                const registerAddressTo = this.registers.getAddressByName(this.fetch8());
                const value = this.registers.getValueByAddress(registerAddressFrom);
                
                this.registers.setValueByAddress(registerAddressTo, value);
            
                return;
            }
        
            case INSTRUCTIONS.MOV_REG_MEM: {
                const registerAddressFrom = this.registers.getAddressByName(this.fetch8());
                const memoryAddressTo = this.fetch16();
                const value = this.registers.getValueByAddress(registerAddressFrom);
                this.memory.setUint16(memoryAddressTo, value);
                
                return;
            }
            
            case INSTRUCTIONS.MOV_MEM_REG: {
                const memoryAddressFrom = this.fetch16();
                const registerAddressTo = this.registers.getAddressByName(this.fetch8());
                const value = this.memory.getUint16(memoryAddressFrom);
                this.registers.setValueByAddress(registerAddressTo, value);
                
                return;
            }
        
            case INSTRUCTIONS.ADD_REG_REG: {
                const firstRegisterAddress = this.registers.getAddressByName(this.fetch8());
                const firstValue = this.registers.getValueByAddress(firstRegisterAddress);
                
                const secondRegisterAddress = this.registers.getAddressByName(this.fetch8());
                const secondValue = this.registers.getValueByAddress(secondRegisterAddress);
                
                this.registers.setValueByName(REGISTERS.ACC, firstValue + secondValue);
            
                return;
            }
            
            case INSTRUCTIONS.JMP_EQ: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value === this.registers.getValueByName(REGISTERS.ACC)) {
                    this.registers.setValueByName(REGISTERS.IP, address);
                }
                
                return;
            }
            
            case INSTRUCTIONS.JMP_NOT_EQ: {
                const value = this.fetch16();
                const address = this.fetch16();
                if (value !== this.registers.getValueByName(REGISTERS.ACC)) {
                    this.registers.setValueByName(REGISTERS.IP, address);
                }
                
                return;
            }
            
            case INSTRUCTIONS.PSH_LIT: {
                const value = this.fetch16();
                this.push(value);
                
                return;                
            }
            
            case INSTRUCTIONS.PSH_REG: {
                const registerAddress = this.registers.getAddressByName(this.fetch8());
                this.push(this.registers.getValueByAddress(registerAddress));
                
                return;
            }
            
            case INSTRUCTIONS.POP: {
                const registerAddress = this.registers.getAddressByName(this.fetch8());
                const value = this.pop();
                this.registers.setValueByAddress(registerAddress, value);
                
                return;
            }
        }
    }
}

module.exports = Cpu;
