const Memory = require('./memory');
const Cpu = require('./cpu');
const Registers = require('./registers');

const INSTRUCTION = require('../core/instruction.constant');
const REGISTER = require('../core/register.constant');

const memorySize = 64;
    
let memory;
let registers;
let cpu;

beforeEach(() => {
    memory = new Memory(memorySize);
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

test('cpu stack pointer should point to end of memory after start', () => {
    expect(cpu.registers.get(REGISTER.SP.address)).toBe(cpu.stackPointerInitial);
});

test('cpu should fetch 8 bit instruction from memory', () => {
    const expectedValue = 234;
    memory.setUint8(0, expectedValue);

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.fetch8()).toEqual(expectedValue);
    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0001);
});

test('cpu should fetch 16 bit instruction from memory', () => {
    const expectedValue = 65432;
    memory.setUint16(0, expectedValue);

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.fetch16()).toEqual(expectedValue);
    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0002);
});

test('cpu should execute instruction MOVE LITERAL TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0xAB;
    memory.byteAt[2] = 0xCD;
    memory.byteAt[3] = REGISTER.R1.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    
    cpu.tick();
    
    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
});

test('cpu should execute instruction MOVE REGISTER TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0xAB;
    memory.byteAt[2] = 0xCD;
    memory.byteAt[3] = REGISTER.R1.address;
    
    memory.byteAt[4] = INSTRUCTION.MOV_REG_REG.opcode;
    memory.byteAt[5] = REGISTER.R1.address;
    memory.byteAt[6] = REGISTER.R2.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    
    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);

    cpu.tick();
    
    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0007);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0xABCD);
});

test('cpu should execute instruction MOVE REGISTER TO MEMORY', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0xAB;
    memory.byteAt[2] = 0xCD;
    memory.byteAt[3] = REGISTER.R1.address;
    
    memory.byteAt[4] = INSTRUCTION.MOV_REG_MEM.opcode;
    memory.byteAt[5] = REGISTER.R1.address;
    memory.byteAt[6] = 0x00;
    memory.byteAt[7] = 0x10; // memory address

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(memory.getUint16(0x0010)).toEqual(0x0000);
    
    cpu.tick();
    
    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
    expect(memory.getUint16(0x0010)).toEqual(0x0000);
    
    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0008);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
    expect(memory.getUint16(0x0010)).toEqual(0xABCD);
});

test('cpu should execute instruction MOVE MEMORY TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_MEM_REG.opcode;
    memory.byteAt[1] = 0x00;
    memory.byteAt[2] = 0x04;
    memory.byteAt[3] = REGISTER.R1.address;
    memory.byteAt[4] = 0x23;
    memory.byteAt[5] = 0x45; // value to move

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(memory.getUint16(0x0004)).toEqual(0x2345);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x2345);
    expect(memory.getUint16(0x0004)).toEqual(0x2345);

});

test('cpu should execute instruction ADD REGISTER TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0x02;
    memory.byteAt[2] = 0x04;
    memory.byteAt[3] = REGISTER.R1.address;

    memory.byteAt[4] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[5] = 0x03;
    memory.byteAt[6] = 0x06;
    memory.byteAt[7] = REGISTER.R2.address;

    memory.byteAt[8] = INSTRUCTION.ADD_REG_REG.opcode;
    memory.byteAt[9] = REGISTER.R1.address;
    memory.byteAt[10] = REGISTER.R2.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0204);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);
    
    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0008);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0204);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);
    
    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x000B);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0204);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x050A);
});

test('cpu should execute instruction SUBTRACT REGISTER TO REGISTER', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0x03;
    memory.byteAt[2] = 0x06;
    memory.byteAt[3] = REGISTER.R1.address;

    memory.byteAt[4] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[5] = 0x01;
    memory.byteAt[6] = 0x02;
    memory.byteAt[7] = REGISTER.R2.address;

    memory.byteAt[8] = INSTRUCTION.SUB_REG_REG.opcode;
    memory.byteAt[9] = REGISTER.R1.address;
    memory.byteAt[10] = REGISTER.R2.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0008);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0102);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x000B);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0102);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0204);
});

test('cpu should execute instruction JUMP EQUAL', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0x12; 
    memory.byteAt[2] = 0x34;
    memory.byteAt[3] = REGISTER.ACC.address;
    
    memory.byteAt[4] = INSTRUCTION.JMP_EQ.opcode;
    memory.byteAt[5] = 0x12; 
    memory.byteAt[6] = 0x34; // value for check
    memory.byteAt[7] = 0x00;
    memory.byteAt[8] = 0x1F; // address for jump

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);
    
    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x1234);
    
    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x001F);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x1234);
});

test('cpu should execute instruction JUMP NOT EQUAL', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0x12;
    memory.byteAt[2] = 0x34;
    memory.byteAt[3] = REGISTER.ACC.address;

    memory.byteAt[4] = INSTRUCTION.JMP_NOT_EQ.opcode;
    memory.byteAt[5] = 0x43;
    memory.byteAt[6] = 0x21; // value for check
    memory.byteAt[7] = 0x00;
    memory.byteAt[8] = 0x1F; // address for jump

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x1234);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x001F);
    expect(cpu.registers.get(REGISTER.ACC.address)).toEqual(0x1234);
});

test('cpu should execute instruction PUSH LITERAL TO STACK', () => {
    memory.byteAt[0] = INSTRUCTION.PSH_LIT.opcode;
    memory.byteAt[1] = 0x12;
    memory.byteAt[2] = 0x34;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.memory.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);
    
    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0003);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial - 2);
    expect(cpu.memory.getUint16(cpu.registers.get(REGISTER.SP.address) + 2)).toEqual(0x1234);
});

test('cpu should execute instruction PUSH REGISTER TO STACK', () => {
    memory.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    memory.byteAt[1] = 0x12;
    memory.byteAt[2] = 0x34;
    memory.byteAt[3] = REGISTER.R1.address;
    
    memory.byteAt[4] = INSTRUCTION.PSH_REG.opcode;
    memory.byteAt[5] = REGISTER.R1.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.memory.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x1234);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.memory.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0006);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x1234);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial - 2);
    expect(cpu.memory.getUint16(cpu.registers.get(REGISTER.SP.address) + 2)).toEqual(0x1234);
});

test('cpu should execute instruction POP FROM STACK', () => {
    memory.byteAt[0] = INSTRUCTION.PSH_LIT.opcode;
    memory.byteAt[1] = 0x12;
    memory.byteAt[2] = 0x34;
    
    memory.byteAt[3] = INSTRUCTION.POP.opcode;
    memory.byteAt[4] = REGISTER.R1.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.memory.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0003);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial - 2);
    expect(cpu.memory.getUint16(cpu.registers.get(REGISTER.SP.address) + 2)).toEqual(0x1234);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0005);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x1234);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
});
