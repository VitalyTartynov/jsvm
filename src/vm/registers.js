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
    }
    
    get(address) {
        return this._memory.getUint16(address);
    }
    
    set(address, newValue) {
        this._memory.setUint16(address, newValue);
    }

    debug() {
        let result = '';
        this._registers.forEach(register => {
            result += `${register.name}: 0x${format.asWord(this.get(register.address))}\n`;
        });
        
        return result;
    }
}

module.exports = Registers;
