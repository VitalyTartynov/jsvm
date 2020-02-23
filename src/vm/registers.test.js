const Registers = require('./registers');

let registers;

beforeEach(() => {
    registers = new Registers();
});

test('registers should be createable', () => {
    expect(registers).toBeTruthy();
});

test('registers should contain register names', () => {
    const registerNames = registers._names;

    expect(registerNames).toBeTruthy();
    expect(registerNames.length).toBeGreaterThan(0);
});

test('registers should contain register values', () => {
    const registersMemory = registers._memory;
    const registersCount = registers._names.length;

    expect(registersMemory).toBeTruthy();
    expect(registersMemory.length).toEqual(registersCount * 2);
});

test('registers should have debug registers view', () => {
    expect(registers.debug).toBeDefined();

    const result = registers.debug();

    expect(result).toBe('ip: 0x0x0000\n' +
        'acc: 0x0x0000\n' +
        'sp: 0x0x0000\n' +
        'r1: 0x0x0000\n' +
        'r2: 0x0x0000\n' +
        'r3: 0x0x0000\n' +
        'r4: 0x0x0000\n');
});
