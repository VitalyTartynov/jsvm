const Memory = require('../vm/memory');
const HexMemorySerializer = require('./memory.serializer');

describe('Hex memory loader', () => {
  let memory;
  let serializer;
  
  beforeEach(() => {
    memory = new Memory(8);
    serializer = new HexMemorySerializer();
  });
    
  test('should save HEX bytecode to string', () => {
    memory.byteAt[0] = 0x01;
    memory.byteAt[1] = 0x23;
    memory.byteAt[2] = 0x45;
    memory.byteAt[3] = 0x67;
    memory.byteAt[4] = 0x89;
    memory.byteAt[5] = 0xAB;
    memory.byteAt[6] = 0xCD;
    memory.byteAt[7] = 0xEF;
        
    const result = serializer.serialize(memory);
        
    expect(result).toBeTruthy();
    expect(result).toEqual('0x01 0x23 0x45 0x67 0x89 0xAB 0xCD 0xEF');
  });
    
  test('should load HEX bytecode from string', () => {
    const data = '0x01 0x23 0x45 0x67 0x89 0xAB 0xCD 0xEF';
        
    serializer.deserialize(data, memory);
        
    expect(memory.byteAt[0]).toBe(0x01);
    expect(memory.byteAt[1]).toBe(0x23);
    expect(memory.byteAt[2]).toBe(0x45);
    expect(memory.byteAt[3]).toBe(0x67);
    expect(memory.byteAt[4]).toBe(0x89);
    expect(memory.byteAt[5]).toBe(0xAB);
    expect(memory.byteAt[6]).toBe(0xCD);
    expect(memory.byteAt[7]).toBe(0xEF);
  });
    
  test('should throw error when HEX bytecode bigger than memory', () => {
    // eslint-disable-next-line require-jsdoc
    function loadBiggerBytecode() {
      const data = '0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x00';
      serializer.load(data, memory);
    }
        
    expect(loadBiggerBytecode).toThrowError();
  });
});
