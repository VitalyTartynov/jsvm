const format = require('../core/format');
const Memory = require('./memory');

const REGISTERS = require('../core/register.constant');

class Registers {
    constructor() {
        this._registers = [
            REGISTERS.IP, 
            REGISTERS.ACC,
            REGISTERS.SP, 
            REGISTERS.R1, 
            REGISTERS.R2, 
            REGISTERS.R3, 
            REGISTERS.R4];
        this._memory = new Memory(this._registers.length * 2);

        this._map = this._registers.reduce((map, register) => {
            map[register.name] = register.address;
            
            return map;
        }, {}); 
    }

    getAddressByName(name) {
        return (name % this._registers.length) * 2;
    }

    getValueByName(name) {
        return this._memory.getUint16(this._map[name]);
    }
    
    getValueByAddress(address) {
        return this._memory.getUint16(address);
    }

    setValueByName(name, newValue) {
        this._memory.setUint16(this._map[name], newValue);
    }
    
    setValueByAddress(address, newValue) {
        this._memory.setUint16(address, newValue);
    }

    debug() {
        let result = '';
        this._registers.forEach(register => {
            result += `${register.name}: 0x${format.asWord(this.getValueByAddress(register.address))}\n`;
        });
        
        return result;
    }
}

module.exports = Registers;
