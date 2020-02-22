const format = require('../core/format');

const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

class Cpu {
    constructor(memory, registers) {
        this.memory = memory;
        this.registers = registers;
    }
        
    fetch() {
        const address = this.registers.get(REGISTERS.IP);
        const instruction = this.memory.getUint8(address);
        this.registers.set(REGISTERS.IP, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.registers.get(REGISTERS.IP);
        const instruction = this.memory.getUint16(address);
        this.registers.set(REGISTERS.IP, address + 2);

        return instruction;
    }
    
    tick() {
        const instruction = this.fetch();
        
        return this.execute(instruction);
    }
    
    execute(instruction) {
        switch (instruction) {
            case INSTRUCTIONS.MOV_LIT_REG: {
                const literal = this.fetch16();
                const regValue = this.fetch();
                const register = (regValue % this.registers._names.length) * 2;
                this.registers._memory.setUint16(register, literal);
            
                return;
            }
        
            case INSTRUCTIONS.MOV_REG_REG: {
                const registerFrom = (this.fetch() % this.registers._names.length) * 2;
                const registerTo = (this.fetch() % this.registers._names.length) * 2;
                const value = this.registers._memory.getUint16(registerFrom);
                this.registers._memory.setUint16(registerTo, value);
            
                return;
            }
        
            case INSTRUCTIONS.MOV_REG_MEM: {
                const registerFrom = (this.fetch() % this.registers._names.length) * 2;
                const address = this.fetch16();
                const value = this.registers._memory.getUint16(registerFrom);
                this.memory.setUint16(address, value);
                
                return;
            }
            
            case INSTRUCTIONS.MOV_MEM_REG: {
                const address = this.fetch16();
                const registerTo = (this.fetch() % this.registers._names.length) * 2;
                const value = this.memory.getUint16(address);
                this.registers._memory.setUint16(registerTo, value);
                
                return;
            }
        
            case INSTRUCTIONS.ADD_REG_REG: {
                const firstRegisterAddress = (this.fetch() % this.registers._names.length) * 2;
                const firstValue = this.registers._memory.getUint16(firstRegisterAddress);
                
                const secondRegisterAddress = (this.fetch() % this.registers._names.length) * 2;
                const secondValue = this.registers._memory.getUint16(secondRegisterAddress);
                
                this.registers.set(REGISTERS.ACC, firstValue + secondValue);
            
                return;
            }
        }
    }
        
    debug() {
        this.registers._names.forEach(name => {
            console.log(`${name}: 0x${format.asWord(this.registers.get(name))}`);
        });
    }
    
    debugMemoryAt(address) {
        const nextBytes = Array.from({length: 8}, (_, i) => this.memory.getUint8(address + i)).map(value => format.asByte(value));
        console.log(`${format.asWord(address)}: ${nextBytes.join(' ')}`);
    }
}

module.exports = Cpu;
