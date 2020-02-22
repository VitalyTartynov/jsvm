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
        case INSTRUCTIONS.MOV_LIT_R1: {
            const literal = this.fetch16();
            this.registers.set(REGISTERS.R1, literal);
            
            return;
        }
        
        case INSTRUCTIONS.MOV_LIT_R2: {
            const literal = this.fetch16();
            this.registers.set(REGISTERS.R2, literal);
            
            return;
        }
        
        case INSTRUCTIONS.ADD_REG_REG: {
            const r1Value = this.registers.get(REGISTERS.R1);
            const r2Value = this.registers.get(REGISTERS.R2);
            this.registers.set(REGISTERS.ACC, r1Value + r2Value);
            
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
