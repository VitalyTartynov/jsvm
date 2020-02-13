const createMemory = require('./memory');
const registerNames = require('../core/registers');

class Cpu {
       
    constructor() {
                
        this.memory = createMemory(256);
        
        this.registerNames = [registerNames.instructionRegister, registerNames.accumulatorRegister, registerNames.r1Register];
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
        const address = this.getRegister(registerNames.instructionRegister);
        const instruction = this.memory.getUint8(address);
        this.setRegister(registerNames.instructionRegister, address + 1);
        
        return instruction;
    }
    
    fetch16() {
        const address = this.getRegister(registerNames.instructionRegister);
        const instruction = this.memory.getUint16(address);
        this.setRegister(registerNames.instructionRegister, address + 2);

        return instruction;
    }
        
    debug() {
        this.registerNames.forEach(name => {
            console.log(`${name}: 0x${this.getRegister(name).toString(16).padStart(4, '0')}`);
        });
    }
}

module.exports = Cpu;
