const format = require('../core/format');

const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

class Cpu {
    constructor(memory, registers) {
        this.memory = memory;
        this.registers = registers;
    }
        
    fetch() {
        const address = this.registers.getRegister(REGISTERS.IP);
        const instruction = this.memory.getUint8(address);
        this.registers.setRegister(REGISTERS.IP, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.registers.getRegister(REGISTERS.IP);
        const instruction = this.memory.getUint16(address);
        this.registers.setRegister(REGISTERS.IP, address + 2);

        return instruction;
    }
    
    tick() {
        const instruction = this.fetch();
        
        return this.execute(instruction);
    }
    
    execute(instruction) {
        switch (instruction) {
        case INSTRUCTIONS.MOV_LIT_R1: {
            const literal = this.fetch16();
            this.registers.setRegister(REGISTERS.R1, literal);
            
            return;
        }
        
        case INSTRUCTIONS.MOV_LIT_R2: {
            const literal = this.fetch16();
            this.registers.setRegister(REGISTERS.R2, literal);
            
            return;
        }
        
        case INSTRUCTIONS.ADD_REG_REG: {
            const r1Value = this.registers.getRegister(REGISTERS.R1);
            const r2Value = this.registers.getRegister(REGISTERS.R2);
            this.registers.setRegister(REGISTERS.ACC, r1Value + r2Value);
            
            return;
        }
        }
    }
        
    debug() {
        this.registers.registerNames.forEach(name => {
            console.log(`${name}: 0x${format.asWord(this.registers.getRegister(name))}`);
        });
    }
    
    debugMemoryAt(address) {
        const nextBytes = Array.from({length: 8}, (_, i) => this.memory.getUint8(address + i)).map(value => format.asByte(value));
        console.log(`${format.asWord(address)}: ${nextBytes.join(' ')}`);
    }
}

module.exports = Cpu;
