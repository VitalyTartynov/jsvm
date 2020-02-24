const Memory = require('./memory');

describe('Memory', () => {
  test('should be created', () => {
    const expectedSize = 16;
    const memory = new Memory(expectedSize);
        
    expect(memory).toBeTruthy();
    expect(memory.length).toBe(expectedSize);
  });
    
  test('should have debug memory view', () => {
    const expectedSize = 16;
    const memory = new Memory(expectedSize);
    memory.byteAt[5] = 0x64;
    
    expect(memory.debugAt).toBeDefined();
        
    const result = memory.debugAt(0x0000);
    expect(result).toBe('0x0000: 0x00 0x00 0x00 0x00 0x00 0x64 0x00 0x00');
  });
    
  test('should have debug memory view with multiple lines', () => {
    const expectedSize = 16;
    const memory = new Memory(expectedSize);
    memory.byteAt[5] = 0x64;
    memory.byteAt[14] = 0x32;
    
    expect(memory.debugAt).toBeDefined();
    
    const result = memory.debugAt(0x0000, 2);
    expect(result).toBe('0x0000: 0x00 0x00 0x00 0x00 0x00 0x64 0x00 0x00\n0x0008: 0x00 0x00 0x00 0x00 0x00 0x00 0x32 0x00');
  });
});
