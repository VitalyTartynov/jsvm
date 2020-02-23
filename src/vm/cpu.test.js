const Memory = require('./memory');
const Cpu = require('./cpu');
const Registers = require('./registers');

const format = require('../core/format');

const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

let memory;
let registers;
let cpu;

beforeEach(() => {
    memory = new Memory(64);
    registers = new Registers();
    cpu = new Cpu(memory, registers);
});

test('cpu should be createable', () => {
    expect(cpu).toBeTruthy();
});

test('cpu should contain memory and registers', () => {
    expect(cpu.memory).toBeTruthy();
    expect(cpu.registers).toBeTruthy();
});

test('cpu should fetch 8 bit instruction from memory', () => {
    const expectedValue = 234;
    memory.setUint8(0, expectedValue);

    const instructionAddress = cpu.registers.getValueByName(REGISTERS.IP);
    const actualValue = cpu.fetch8();
    const instructionAddressAfterFetch = cpu.registers.getValueByName(REGISTERS.IP);
    
    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(1);
});

test('cpu should fetch 16 bit instruction from memory', () => {
    const expectedValue = 65432;
    memory.setUint16(0, expectedValue);

    const instructionAddress = cpu.registers.getValueByName(REGISTERS.IP);
    const actualValue = cpu.fetch16();
    const instructionAddressAfterFetch = cpu.registers.getValueByName(REGISTERS.IP);

    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(2);
});

test('cpu should execute instruction MOVE LITERAL TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTIONS.MOV_LIT_REG;
    memory.byteAt[1] = 0xAB;
    memory.byteAt[2] = 0xCD;
    memory.byteAt[3] = REGISTERS.R1;

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0000');
    
    cpu.tick();
    console.log(registers.debug());
    console.log(memory.debugAt(0x0000));
    
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0xABCD');
});

test('cpu should execute instruction MOVE REGISTER TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTIONS.MOV_LIT_REG;
    memory.byteAt[1] = 0xAB;
    memory.byteAt[2] = 0xCD;
    memory.byteAt[3] = REGISTERS.R1;
    memory.byteAt[4] = INSTRUCTIONS.MOV_REG_REG;
    memory.byteAt[5] = REGISTERS.R1;
    memory.byteAt[6] = REGISTERS.R2;

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R2))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R2))).toEqual('0x0000');

    cpu.tick();
    
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0007');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R2))).toEqual('0xABCD');
});

test('cpu should execute instruction MOVE REGISTER TO MEMORY', () => {
    memory.byteAt[0] = INSTRUCTIONS.MOV_LIT_REG;
    memory.byteAt[1] = 0xAB;
    memory.byteAt[2] = 0xCD;
    memory.byteAt[3] = REGISTERS.R1;
    memory.byteAt[4] = INSTRUCTIONS.MOV_REG_MEM;
    memory.byteAt[5] = REGISTERS.R1;
    memory.byteAt[6] = 0x00;
    memory.byteAt[7] = 0x10; // memory address

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(memory.getUint16(0x0010))).toEqual('0x0000');
    
    cpu.tick();
    
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(memory.getUint16(0x0010))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0008');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0xABCD');
    expect(format.asWord(memory.getUint16(0x0010))).toEqual('0xABCD');
});

test('cpu should execute instruction MOVE MEMORY TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTIONS.MOV_MEM_REG;
    memory.byteAt[1] = 0x00;
    memory.byteAt[2] = 0x04;
    memory.byteAt[3] = REGISTERS.R1;
    memory.byteAt[4] = 0x23;
    memory.byteAt[5] = 0x45; // value to move

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(memory.getUint16(0x0004))).toEqual('0x2345');

    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x2345');
    expect(format.asWord(memory.getUint16(0x0004))).toEqual('0x2345');

});

test('cpu should execute instruction ADD REGISTER TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTIONS.MOV_LIT_REG;
    memory.byteAt[1] = 0x02;
    memory.byteAt[2] = 0x04;
    memory.byteAt[3] = REGISTERS.R1;

    memory.byteAt[4] = INSTRUCTIONS.MOV_LIT_REG;
    memory.byteAt[5] = 0x03;
    memory.byteAt[6] = 0x06;
    memory.byteAt[7] = REGISTERS.R2;

    memory.byteAt[8] = INSTRUCTIONS.ADD_REG_REG;
    memory.byteAt[9] = REGISTERS.R1;
    memory.byteAt[10] = REGISTERS.R2;

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R2))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x0000');

    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0204');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R2))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0008');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0204');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R2))).toEqual('0x0306');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x000B');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R1))).toEqual('0x0204');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.R2))).toEqual('0x0306');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x050A');
});

test('cpu should execute instruction JUMP EQUAL', () => {
    memory.byteAt[0] = INSTRUCTIONS.MOV_LIT_REG;
    memory.byteAt[1] = 0x12; 
    memory.byteAt[2] = 0x34;
    memory.byteAt[3] = REGISTERS.ACC;
    
    memory.byteAt[4] = INSTRUCTIONS.JMP_EQ;
    memory.byteAt[5] = 0x12; 
    memory.byteAt[6] = 0x34; // value for check
    memory.byteAt[7] = 0x00;
    memory.byteAt[8] = 0x1F; // address for jump

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x0000');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x1234');
    
    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x001F');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x1234');
});

test('cpu should execute instruction JUMP NOT EQUAL', () => {

    memory.byteAt[0] = INSTRUCTIONS.MOV_LIT_REG;
    memory.byteAt[1] = 0x12;
    memory.byteAt[2] = 0x34;
    memory.byteAt[3] = REGISTERS.ACC;

    memory.byteAt[4] = INSTRUCTIONS.JMP_NOT_EQ;
    memory.byteAt[5] = 0x43;
    memory.byteAt[6] = 0x21; // value for check
    memory.byteAt[7] = 0x00;
    memory.byteAt[8] = 0x1F; // address for jump

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0000');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x0000');

    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x0004');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x1234');

    cpu.tick();

    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.IP))).toEqual('0x001F');
    expect(format.asWord(cpu.registers.getValueByName(REGISTERS.ACC))).toEqual('0x1234');
});
