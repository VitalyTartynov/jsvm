const format = require('./format');

/**
 * Serialize/deserialize memory data to HEX string.
 * It's 'human-friendly' string with HEX information like '0x01 0x02 0xFF'.
 */
class HexMemorySerializer {
  constructor() {
    this.delimeter = ' ';
  }

  /**
   * Serialize data from memory to HEX string.
   * @param {Memory} memory Memory object.
   * @return {string} Serialized data.
   */
  serialize(memory) {
    let result = '';
    for (let i = 0; i < memory.length; i++) {
      result += format.asByte(memory.byteAt[i]);
      if (i !== memory.length - 1) {
        result += this.delimeter;
      }
    }
        
    return result;
  }

  /**
   * Deserialize HEX string to memory.
   * @param {string} data Serialized data.
   * @param {Memory} memory Memory object.
   * @returns {undefined}
   */
  deserialize(data, memory) {
    const values = data.split(this.delimeter);
        
    if (values.length > memory.length) {
      throw new Error('Program is bigger than memory');
    }
        
    for (let i = 0; i < memory.length; i++) {
      memory.byteAt[i] = values[i];
    }       
  }
}

module.exports = HexMemorySerializer;
