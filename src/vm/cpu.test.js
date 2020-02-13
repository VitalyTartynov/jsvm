const Cpu = require('./cpu');

const REGISTERS = require('../core/register.constant');

let cpu;

beforeEach(() => {
    cpu = new Cpu();
});

test('cpu should be createable', () => {
    expect(cpu).toBeTruthy();
});

test('cpu should contain registerNames', () => {
    const registerNames = cpu.registerNames;
    
    expect(registerNames).toBeTruthy();
    expect(registerNames.length).toBeGreaterThan(0);
});


test('cpu should contain registers', () => {
    const registers = cpu.registers;

    expect(registers).toBeTruthy();
    // TODO: add check for size
});

test('cpu should contain memory', () => {
    const memory = cpu.memory;

    expect(memory).toBeTruthy();
});

test('cpu should fetch 8 bit instruction from memory', () => {
    const memory = cpu.memory;
    const expectedValue = 234;
    memory.setUint8(0, expectedValue);

    const instructionAddress = cpu.getRegister(REGISTERS.instruction);
    const actualValue = cpu.fetch();
    const instructionAddressAfterFetch = cpu.getRegister(REGISTERS.instruction);
    
    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(1);
});

test('cpu should fetch 16 bit instruction from memory', () => {
    const memory = cpu.memory;
    const expectedValue = 65432;
    memory.setUint16(0, expectedValue);

    const instructionAddress = cpu.getRegister(REGISTERS.instruction);
    const actualValue = cpu.fetch16();
    const instructionAddressAfterFetch = cpu.getRegister(REGISTERS.instruction);

    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(2);
});

test('cpu should have debug registers view', () => {
    cpu.debug();
});

test('cpu should have debug memory view', () => {
    cpu.debugMemoryAt(0);
    cpu.debugMemoryAt(8);
});
