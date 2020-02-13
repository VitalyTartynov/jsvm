const createMemory = require('./memory');
const format = require('../core/format');

const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

class Cpu {
    constructor(memory) {
        this.memory = memory;
        
        this.registerNames = [REGISTERS.IP, REGISTERS.ACC, REGISTERS.R1, REGISTERS.R2];
        this.registers = createMemory(this.registerNames.length * 2);

        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {});
    }
    
    getRegister(name) {
        return this.registers.getUint16(this.registerMap[name]);
    }
    
    setRegister(name, newValue) {
        this.registers.setUint16(this.registerMap[name], newValue);
    }
    
    fetch() {
        const address = this.getRegister(REGISTERS.IP);
        const instruction = this.memory.getUint8(address);
        this.setRegister(REGISTERS.IP, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.getRegister(REGISTERS.IP);
        const instruction = this.memory.getUint16(address);
        this.setRegister(REGISTERS.IP, address + 2);

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
            this.setRegister(REGISTERS.R1, literal);
            
            return;
        }
        
        case INSTRUCTIONS.MOV_LIT_R2: {
            const literal = this.fetch16();
            this.setRegister(REGISTERS.R2, literal);
            
            return;
        }
        
        case INSTRUCTIONS.ADD_REG_REG: {
            const r1Value = this.getRegister(REGISTERS.R1);
            const r2Value = this.getRegister(REGISTERS.R2);
            this.setRegister(REGISTERS.ACC, r1Value + r2Value);
            
            return;
        }
        }
    }
        
    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${format.asWord(this.getRegister(name))}`);
        });
    }
    
    debugMemoryAt(address) {
        const nextBytes = Array.from({length: 8}, (_, i) => this.memory.getUint8(address + i)).map(value => format.asByte(value));
        console.log(`${format.asWord(address)}: ${nextBytes.join(' ')}`);
    }
}

module.exports = Cpu;
