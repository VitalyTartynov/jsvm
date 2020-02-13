const createMemory = require('./memory');

const REGISTERS = require('../core/register.constant');

class Registers {
    constructor() {
        this.registerNames = [REGISTERS.IP, REGISTERS.ACC, REGISTERS.R1, REGISTERS.R2];
        this.registers = createMemory(this.registerNames.length * 2);

        this.registerMap = this.registerNames.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {}); 
    }

    get(name) {
        return this.registers.getUint16(this.registerMap[name]);
    }

    set(name, newValue) {
        this.registers.setUint16(this.registerMap[name], newValue);
    }
}

module.exports = Registers;
