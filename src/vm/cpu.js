const createMemory = require('./memory');
const registerNames = require('../core/registers');
const format = require('../core/formatters');

class Cpu {
       
    constructor() {
                
        this.memory = createMemory(256);
        
        this.registerNames = [registerNames.instruction, registerNames.accumulator, registerNames.r1];
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
        const address = this.getRegister(registerNames.instruction);
        const instruction = this.memory.getUint8(address);
        this.setRegister(registerNames.instruction, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.getRegister(registerNames.instruction);
        const instruction = this.memory.getUint16(address);
        this.setRegister(registerNames.instruction, address + 2);

        return instruction;
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
