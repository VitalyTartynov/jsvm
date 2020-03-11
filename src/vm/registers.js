const Memory = require('./memory');

const format = require('../common/format');

/**
 * CPU register set.
 */
class Registers {
  constructor(registerNames) {
    this._registers = registerNames;
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
