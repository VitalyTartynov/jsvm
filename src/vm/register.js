const createMemory = require('./memory');

const REGISTERS = require('../core/register.constant');

class Registers {
    constructor() {
        this.__names = [REGISTERS.IP, REGISTERS.ACC, REGISTERS.R1, REGISTERS.R2];
        this.__memory = createMemory(this.__names.length * 2);

        this.__map = this.__names.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {}); 
    }

    get(name) {
        return this.__memory.getUint16(this.__map[name]);
    }

    set(name, newValue) {
        this.__memory.setUint16(this.__map[name], newValue);
    }
}

module.exports = Registers;
