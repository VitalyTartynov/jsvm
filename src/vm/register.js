const createMemory = require('./memory');

const REGISTERS = require('../core/register.constant');

class Registers {
    constructor() {
        this.names = [REGISTERS.IP, REGISTERS.ACC, REGISTERS.R1, REGISTERS.R2];
        this.memory = createMemory(this.names.length * 2);

        this.map = this.names.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {}); 
    }

    get(name) {
        return this.memory.getUint16(this.map[name]);
    }

    set(name, newValue) {
        this.memory.setUint16(this.map[name], newValue);
    }
}

module.exports = Registers;
