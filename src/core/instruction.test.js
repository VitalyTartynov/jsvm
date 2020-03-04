const INSTRUCTION = require('../architecture/sample/instruction.constant');

describe('Instruction', () => {
  test('should be created', () => {
    expect(INSTRUCTION.NOP).toBeTruthy();
  });
    
  test('should have debug info', () => {
    const info = INSTRUCTION.NOP.toString();
        
    expect(info).toBeTruthy();
    expect(info).toEqual('NOP \t: 0x00 \t: NO OPERATION');
  });
});
