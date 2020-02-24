const format = require('./format');

class MemoryLoader {
  save(memory) {
    let result = '';
    for (let i = 0; i < memory.length; i++) {
      result += format.asByte(memory.byteAt[i]);
      if (i !== memory.length - 1) {
        result += ' ';
      }
    }
        
    return result;
  }
    
  load(data, memory) {
    const values = data.split(' ');
        
    if (values.length > memory.length) {
      throw new Error('Program is bigger than memory');
    }
        
    for (let i = 0; i < memory.length; i++) {
      memory.byteAt[i] = values[i];
    }       
  }
}

module.exports = MemoryLoader;
