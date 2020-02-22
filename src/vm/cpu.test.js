const createMemory = require('./memory');
const Cpu = require('./cpu');
const Registers = require('./register');
const format = require('../core/format');

const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

let memory;
let registers;
let cpu;

beforeEach(() => {
    memory = createMemory(256);
    registers = new Registers();
    cpu = new Cpu(memory, registers);
});

test('cpu should be createable', () => {
    expect(cpu).toBeTruthy();
});

test('cpu should contain register names', () => {
    const registerNames = cpu.registers._names;
    
    expect(registerNames).toBeTruthy();
    expect(registerNames.length).toBeGreaterThan(0);
});

test('cpu should contain register values', () => {
    const registersMemory = cpu.registers._memory;
    const registersCount = cpu.registers._names.length;

    expect(registersMemory).toBeTruthy();
    expect(registersMemory.buffer.byteLength).toEqual(registersCount * 2);
});

test('cpu should contain memory', () => {
    expect(memory).toBeTruthy();
});

test('cpu should fetch 8 bit instruction from memory', () => {
    const expectedValue = 234;
    memory.setUint8(0, expectedValue);

    const instructionAddress = cpu.registers.get(REGISTERS.IP);
    const actualValue = cpu.fetch();
    const instructionAddressAfterFetch = cpu.registers.get(REGISTERS.IP);
    
    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(1);
});

test('cpu should fetch 16 bit instruction from memory', () => {
    const expectedValue = 65432;
    memory.setUint16(0, expectedValue);

    const instructionAddress = cpu.registers.get(REGISTERS.IP);
    const actualValue = cpu.fetch16();
    const instructionAddressAfterFetch = cpu.registers.get(REGISTERS.IP);

    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(2);
});

test('cpu should execute instruction ....', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[1] = 0xAB;
    writableMemory[2] = 0xCD;
    writableMemory[3] = 0x02; // R1 address
    
    cpu.tick();
    const r1 = cpu.registers.get(REGISTERS.R1);
    const ip = cpu.registers.get(REGISTERS.IP);

    expect(format.asWord(r1)).toEqual('0xABCD');
    expect(format.asWord(ip)).toEqual('0x0004');
});

test('cpu should add r1 and r2 registers to accumulator', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[1] = 0x00;
    writableMemory[2] = 0x03;
    writableMemory[3] = 0x02; // R1 address
    
    
    writableMemory[4] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[5] = 0x01;
    writableMemory[6] = 0x03;
    writableMemory[7] = 0x03; // R2 address
    

    writableMemory[8] = INSTRUCTIONS.ADD_REG_REG;

    cpu.tick();
    cpu.tick();
    cpu.tick();
    
    const acc = cpu.registers.get(REGISTERS.ACC);

    expect(format.asWord(acc)).toEqual('0x0106');
});

test('cpu should have debug registers view', () => {
    cpu.debug();
});

test('cpu should have debug memory view', () => {
    cpu.debugMemoryAt(0);
    cpu.debugMemoryAt(8);
});
