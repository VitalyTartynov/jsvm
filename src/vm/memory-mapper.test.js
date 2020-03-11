const MemoryMapper = require('./memory-mapper');
const Memory = require('./memory');

describe('MemoryMapper', () => {
  const ramSize = 64;
  let memoryMapper;

  beforeEach(() => {
    memoryMapper = new MemoryMapper();  
  });

  test('should be created', () => {
    expect(memoryMapper).toBeTruthy();
  });
  
  test('should throw error when unmapped', () => {
    // eslint-disable-next-line no-unused-vars,require-jsdoc
    function getByteFromMemory() {
      memoryMapper.getUint8();
    }
    
    // eslint-disable-next-line no-unused-vars,require-jsdoc
    function setByteToMemory() {
      memoryMapper.setUint8();
    }
    
    // eslint-disable-next-line no-unused-vars,require-jsdoc
    function getWordFromMemory() {
      memoryMapper.getUint16();
    }

    // eslint-disable-next-line no-unused-vars,require-jsdoc
    function setWordToMemory() {
      memoryMapper.setUint16();
    }

    
    expect(getByteFromMemory).toThrowError();    
    expect(setByteToMemory).toThrowError();    
    expect(getWordFromMemory).toThrowError();    
    expect(setWordToMemory).toThrowError();    
  });
  
  test('should work with mapped device memory', () => {
    const ram = new Memory(ramSize);
    ram.byteAt[0] = 0x01;
    ram.byteAt[1] = 0x23;
    ram.byteAt[2] = 0x45;
    memoryMapper.map(ram, 0, ramSize);
    
    expect(memoryMapper.getUint8(0x0000)).toBe(0x01);
    expect(memoryMapper.getUint16(0x0001)).toBe(0x2345);
    
    memoryMapper.setUint8(0x000A, 0xFE);
    expect(ram.byteAt[0x000A]).toBe(0xFE);
    
    memoryMapper.setUint16(0x00E, 0xABCD);
    expect(ram.byteAt[0x000E]).toBe(0xAB);
    expect(ram.byteAt[0x000F]).toBe(0xCD);
  });

  test('should override mapped device memory', () => {
    const ram = new Memory(ramSize);
    ram.byteAt[0] = 0x01;
    ram.byteAt[1] = 0x23;
    memoryMapper.map(ram, 0, ramSize);

    // create video memory and map area from 0x0002 to 0x000A to it
    const videoMemory = new Memory(8);
    videoMemory.byteAt[0] = 0xFE;
    videoMemory.byteAt[1] = 0xDC;
    memoryMapper.map(videoMemory, 0x0002, 0x000A, true);

    // this area from RAM memory.
    expect(memoryMapper.getUint8(0x0000)).toBe(0x01);
    expect(memoryMapper.getUint16(0x0000)).toBe(0x0123);
    memoryMapper.setUint8(0x0000, 0x98);
    expect(ram.byteAt[0x0000]).toBe(0x98);
    memoryMapper.setUint16(0x0000, 0x7654);
    expect(ram.byteAt[0x0000]).toBe(0x76);
    expect(ram.byteAt[0x0001]).toBe(0x54);

    // this area from video memory.
    expect(memoryMapper.getUint8(0x0002)).toBe(0xFE);
    expect(memoryMapper.getUint16(0x0002)).toBe(0xFEDC);
    memoryMapper.setUint8(0x0002, 0x12);
    expect(videoMemory.byteAt[0x0000]).toBe(0x12); // mapped address not equal real address from device!
    memoryMapper.setUint16(0x0002, 0x3456);
    expect(videoMemory.byteAt[0x0000]).toBe(0x34);
    expect(videoMemory.byteAt[0x0001]).toBe(0x56);
  });
});
