const Registers = require('./registers');

let registers;

beforeEach(() => {
    registers = new Registers();
});

test('registers should be createable', () => {
    expect(registers).toBeTruthy();
});

test('registers should contain register names', () => {
    const internalRegisters = registers._registers;

    expect(internalRegisters).toBeTruthy();
    expect(internalRegisters.length).toBeGreaterThan(0);
});

test('registers should contain register values', () => {
    const registersMemory = registers._memory;
    const registersCount = registers._registers.length;

    expect(registersMemory).toBeTruthy();
    expect(registersMemory.length).toEqual(registersCount * 2);
});

test('registers should have debug registers view', () => {
    expect(registers.debug).toBeDefined();

    const result = registers.debug();

    expect(result).toBe('IP: 0x0x0000\n' +
        'AC: 0x0x0000\n' +
        'SP: 0x0x0000\n' +
        'R1: 0x0x0000\n' +
        'R2: 0x0x0000\n' +
        'R3: 0x0x0000\n' +
        'R4: 0x0x0000\n');
});
