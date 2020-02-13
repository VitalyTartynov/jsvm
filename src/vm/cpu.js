const createMemory = require('./memory');
const format = require('../core/formatters');

const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

class Cpu {
    constructor(memory) {
        this.memory = memory;
        
        this.registerNames = [REGISTERS.instruction, REGISTERS.accumulator, REGISTERS.r1];
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
        const address = this.getRegister(REGISTERS.instruction);
        const instruction = this.memory.getUint8(address);
        this.setRegister(REGISTERS.instruction, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.getRegister(REGISTERS.instruction);
        const instruction = this.memory.getUint16(address);
        this.setRegister(REGISTERS.instruction, address + 2);

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
            this.setRegister(REGISTERS.r1, literal);
            return;
        }
        }
    }
        
    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`);
        });
    }
    
    debugMemoryAt(address) {
        const nextBytes = Array.from({length: 8}, (_, i) => this.memory.getUint8(address + i)).map(value => format.asByte(value));
        console.log(`${format.asWord(address)}: ${nextBytes.join(' ')}`);
    }
}

module.exports = Cpu;
