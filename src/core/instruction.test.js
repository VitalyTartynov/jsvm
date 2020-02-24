const INSTRUCTION = require('./instruction.constant');

test('instruction should be createable', () => {
    expect(INSTRUCTION.NOP).toBeTruthy();
});

test('instruction should have debug info', () => {
    const info = INSTRUCTION.NOP.toString();
    
    expect(info).toBeTruthy();
    expect(info).toEqual('NOP \t: 0x00 \t: NO OPERATION');
});
