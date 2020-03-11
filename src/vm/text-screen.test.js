const MemoryMapper = require('./memory-mapper');
const Memory = require('./memory');
const TextScreen = require('./text-screen');

describe('TextScreen', () => {
  const ramSize = 64;
  let memoryMapper;
  let ram;
  let textScreen;
  
  beforeEach(() => {
    ram = new Memory(ramSize);
    memoryMapper = new MemoryMapper();
    textScreen = new TextScreen();
    
    memoryMapper.map(ram, 0, ramSize);
    memoryMapper.map(textScreen, 0x0010, 0x0020, true);
  });
  
  test('should be created', () => {
    expect(textScreen).toBeTruthy();
  });
  
  test('should log characters via text screen', () => {
    memoryMapper.setUint16(0x0010, 'G'.charCodeAt(0));
    memoryMapper.setUint16(0x0010, 'O'.charCodeAt(0));
  });
});
