const Instruction = require('./instruction');

let nopInstruction;

beforeEach(() => {
    nopInstruction = new Instruction(0x00, 'NOP', 'Not operation');
});

test('instruction should be createable', () => {
    expect(nopInstruction).toBeTruthy();
});

test('instruction should have debug info', () => {
    const info = nopInstruction.toString();
    
    expect(info).toBeTruthy();
    expect(info).toEqual('NOP \t: 0x00 \t: Not operation');
});
