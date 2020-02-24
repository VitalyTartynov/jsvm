const Memory = require('./memory');
const Registers = require('./registers');
const Alu = require('./alu');
const Cpu = require('./cpu');

const INSTRUCTION = require('../core/instruction.constant');
const REGISTER = require('../core/register.constant');

const ramSize = 64;
const flashSize = 32;

let ram;
let registers;
let alu;
let flash;
let cpu;

beforeEach(() => {
    ram = new Memory(ramSize);
    registers = new Registers();
    alu = new Alu(ram, registers);
    flash = new Memory(flashSize);
    cpu = new Cpu(ram, registers, alu, flash);
});

test('alu should fetch 8 bit instruction from ram', () => {
    const expectedValue = 234;
    ram.setUint8(0, expectedValue);

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.alu.fetch8()).toEqual(expectedValue);
    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0001);
});

test('alu should fetch 16 bit instruction from ram', () => {
    const expectedValue = 65432;
    ram.setUint16(0, expectedValue);

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.alu.fetch16()).toEqual(expectedValue);
    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0002);
});

test('alu should execute instruction NO OPERATION', () => {
    ram.byteAt[0] = INSTRUCTION.NOP.opcode;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0001);
});

test('alu should execute instruction MOVE LITERAL TO REGISTER', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0xAB;
    ram.byteAt[2] = 0xCD;
    ram.byteAt[3] = REGISTER.R1.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
});

test('alu should execute instruction MOVE REGISTER TO REGISTER', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0xAB;
    ram.byteAt[2] = 0xCD;
    ram.byteAt[3] = REGISTER.R1.address;

    ram.byteAt[4] = INSTRUCTION.MOV_REG_REG.opcode;
    ram.byteAt[5] = REGISTER.R1.address;
    ram.byteAt[6] = REGISTER.R2.address;

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

test('alu should execute instruction MOVE REGISTER TO MEMORY', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0xAB;
    ram.byteAt[2] = 0xCD;
    ram.byteAt[3] = REGISTER.R1.address;

    ram.byteAt[4] = INSTRUCTION.MOV_REG_MEM.opcode;
    ram.byteAt[5] = REGISTER.R1.address;
    ram.byteAt[6] = 0x00;
    ram.byteAt[7] = 0x10; // ram address

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(ram.getUint16(0x0010)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
    expect(ram.getUint16(0x0010)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0008);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0xABCD);
    expect(ram.getUint16(0x0010)).toEqual(0xABCD);
});

test('alu should execute instruction MOVE MEMORY TO REGISTER', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_MEM_REG.opcode;
    ram.byteAt[1] = 0x00;
    ram.byteAt[2] = 0x04;
    ram.byteAt[3] = REGISTER.R1.address;
    ram.byteAt[4] = 0x23;
    ram.byteAt[5] = 0x45; // value to move

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(ram.getUint16(0x0004)).toEqual(0x2345);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x2345);
    expect(ram.getUint16(0x0004)).toEqual(0x2345);

});

test('alu should execute instruction ADD REGISTER TO REGISTER', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0x02;
    ram.byteAt[2] = 0x04;
    ram.byteAt[3] = REGISTER.R1.address;

    ram.byteAt[4] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[5] = 0x03;
    ram.byteAt[6] = 0x06;
    ram.byteAt[7] = REGISTER.R2.address;

    ram.byteAt[8] = INSTRUCTION.ADD_REG_REG.opcode;
    ram.byteAt[9] = REGISTER.R1.address;
    ram.byteAt[10] = REGISTER.R2.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0204);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0008);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0204);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x000B);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0204);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x050A);
});

test('alu should execute instruction SUBTRACT REGISTER TO REGISTER', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0x03;
    ram.byteAt[2] = 0x06;
    ram.byteAt[3] = REGISTER.R1.address;

    ram.byteAt[4] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[5] = 0x01;
    ram.byteAt[6] = 0x02;
    ram.byteAt[7] = REGISTER.R2.address;

    ram.byteAt[8] = INSTRUCTION.SUB_REG_REG.opcode;
    ram.byteAt[9] = REGISTER.R1.address;
    ram.byteAt[10] = REGISTER.R2.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0008);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0102);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x000B);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0306);
    expect(cpu.registers.get(REGISTER.R2.address)).toEqual(0x0102);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0204);
});

test('alu should execute instruction JUMP EQUAL', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0x12;
    ram.byteAt[2] = 0x34;
    ram.byteAt[3] = REGISTER.AC.address;

    ram.byteAt[4] = INSTRUCTION.JMP_EQ.opcode;
    ram.byteAt[5] = 0x12;
    ram.byteAt[6] = 0x34; // value for check
    ram.byteAt[7] = 0x00;
    ram.byteAt[8] = 0x1F; // address for jump

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x1234);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x001F);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x1234);
});

test('alu should execute instruction JUMP NOT EQUAL', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0x12;
    ram.byteAt[2] = 0x34;
    ram.byteAt[3] = REGISTER.AC.address;

    ram.byteAt[4] = INSTRUCTION.JMP_NOT_EQ.opcode;
    ram.byteAt[5] = 0x43;
    ram.byteAt[6] = 0x21; // value for check
    ram.byteAt[7] = 0x00;
    ram.byteAt[8] = 0x1F; // address for jump

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x1234);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x001F);
    expect(cpu.registers.get(REGISTER.AC.address)).toEqual(0x1234);
});

test('alu should execute instruction PUSH LITERAL TO STACK', () => {
    ram.byteAt[0] = INSTRUCTION.PSH_LIT.opcode;
    ram.byteAt[1] = 0x12;
    ram.byteAt[2] = 0x34;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.ram.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0003);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial - 2);
    expect(cpu.ram.getUint16(cpu.registers.get(REGISTER.SP.address) + 2)).toEqual(0x1234);
});

test('alu should execute instruction PUSH REGISTER TO STACK', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0x12;
    ram.byteAt[2] = 0x34;
    ram.byteAt[3] = REGISTER.R1.address;

    ram.byteAt[4] = INSTRUCTION.PSH_REG.opcode;
    ram.byteAt[5] = REGISTER.R1.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.ram.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0004);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x1234);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.ram.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0006);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x1234);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial - 2);
    expect(cpu.ram.getUint16(cpu.registers.get(REGISTER.SP.address) + 2)).toEqual(0x1234);
});

test('alu should execute instruction POP FROM STACK', () => {
    ram.byteAt[0] = INSTRUCTION.PSH_LIT.opcode;
    ram.byteAt[1] = 0x12;
    ram.byteAt[2] = 0x34;

    ram.byteAt[3] = INSTRUCTION.POP.opcode;
    ram.byteAt[4] = REGISTER.R1.address;

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
    expect(cpu.ram.getUint16(cpu.registers.get(REGISTER.SP.address))).toEqual(0x0000);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0003);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x0000);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial - 2);
    expect(cpu.ram.getUint16(cpu.registers.get(REGISTER.SP.address) + 2)).toEqual(0x1234);

    cpu.tick();

    expect(cpu.registers.get(REGISTER.IP.address)).toEqual(0x0005);
    expect(cpu.registers.get(REGISTER.R1.address)).toEqual(0x1234);
    expect(cpu.registers.get(REGISTER.SP.address)).toEqual(cpu.stackPointerInitial);
});
