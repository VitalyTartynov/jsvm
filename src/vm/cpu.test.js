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

test('cpu should execute instruction MOVE LITERAL TO REGISTER', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[1] = 0xAB;
    writableMemory[2] = 0xCD;
    writableMemory[3] = 0x02; // R1 address
    
    cpu.tick();
    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0xABCD');
});

test('cpu should execute instruction MOVE REGISTER TO REGISTER', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[1] = 0xAB;
    writableMemory[2] = 0xCD;
    writableMemory[3] = 0x02; // R1 address
    writableMemory[4] = INSTRUCTIONS.MOV_REG_REG;
    writableMemory[5] = 0x02; // R1 address
    writableMemory[6] = 0x03; // R2 address

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.R2))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(cpu.registers.get(REGISTERS.R2))).toEqual('0x0000');

    cpu.tick();
    
    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0007');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(cpu.registers.get(REGISTERS.R2))).toEqual('0xABCD');
});

test('cpu should execute instruction MOVE REGISTER TO MEMORY', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[1] = 0xAB;
    writableMemory[2] = 0xCD;
    writableMemory[3] = 0x02; // R1 address
    writableMemory[4] = INSTRUCTIONS.MOV_REG_MEM;
    writableMemory[5] = 0x02; // R1 address
    writableMemory[6] = 0x00;
    writableMemory[7] = 0x10; // memory address

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(memory.getUint16(0x0010))).toEqual('0x0000');
    
    cpu.tick();
    
    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(memory.getUint16(0x0010))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0008');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(memory.getUint16(0x0010))).toEqual('0xABCD');
});

test('cpu should execute instruction MOVE MEMORY TO REGISTER', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_MEM_REG;
    writableMemory[1] = 0x00;
    writableMemory[2] = 0x04;
    writableMemory[3] = 0x02; // R1 address
    
    writableMemory[4] = 0x23;
    writableMemory[5] = 0x45; // value to move

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(memory.getUint16(0x0004))).toEqual('0x2345');

    cpu.tick();

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x2345');
    expect(format.asWord(memory.getUint16(0x0004))).toEqual('0x2345');

});

test('cpu should execute instruction ADD REGISTER TO REGISTER', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[1] = 0x02;
    writableMemory[2] = 0x04;
    writableMemory[3] = 0x02; // R1 address    
    
    writableMemory[4] = INSTRUCTIONS.MOV_LIT_REG;
    writableMemory[5] = 0x03;
    writableMemory[6] = 0x06;
    writableMemory[7] = 0x03; // R2 address    

    writableMemory[8] = INSTRUCTIONS.ADD_REG_REG;
    writableMemory[9] = 0x02; // R1 address
    writableMemory[10] = 0x03; // R2 address

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.R2))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.ACC))).toEqual('0x0000');

    cpu.tick();

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x0204');
    expect(format.asWord(cpu.registers.get(REGISTERS.R2))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.get(REGISTERS.ACC))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x0008');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x0204');
    expect(format.asWord(cpu.registers.get(REGISTERS.R2))).toEqual('0x0306');
    expect(format.asWord(cpu.registers.get(REGISTERS.ACC))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.get(REGISTERS.IP))).toEqual('0x000B');
    expect(format.asWord(cpu.registers.get(REGISTERS.R1))).toEqual('0x0204');
    expect(format.asWord(cpu.registers.get(REGISTERS.R2))).toEqual('0x0306');
    expect(format.asWord(cpu.registers.get(REGISTERS.ACC))).toEqual('0x050A');
});

test('cpu should have debug registers view', () => {
    cpu.debug();
});

test('cpu should have debug memory view', () => {
    cpu.debugMemoryAt(0);
    cpu.debugMemoryAt(8);
});
