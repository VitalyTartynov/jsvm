const format = require('./format');

class HexMemoryLoader {
  constructor() {
    this.delimeter = ' ';
  }
  
  save(memory) {
    let result = '';
    for (let i = 0; i < memory.length; i++) {
      result += format.asByte(memory.byteAt[i]);
      if (i !== memory.length - 1) {
        result += this.delimeter;
      }
    }
        
    return result;
  }
    
  load(data, memory) {
    const values = data.split(this.delimeter);
        
    if (values.length > memory.length) {
      throw new Error('Program is bigger than memory');
    }
        
    for (let i = 0; i < memory.length; i++) {
      memory.byteAt[i] = values[i];
    }       
  }
}

module.exports = HexMemoryLoader;
