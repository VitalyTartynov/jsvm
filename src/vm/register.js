const createMemory = require('./memory');

const REGISTERS = require('../core/register.constant');

class Registers {
    constructor() {
        this._names = [REGISTERS.IP, REGISTERS.ACC, REGISTERS.R1, REGISTERS.R2];
        this._memory = createMemory(this._names.length * 2);

        this._map = this._names.reduce((map, name, i) => {
            map[name] = i * 2;
            return map;
        }, {}); 
    }

    get(name) {
        return this._memory.getUint16(this._map[name]);
    }

    set(name, newValue) {
        this._memory.setUint16(this._map[name], newValue);
    }
}

module.exports = Registers;
