﻿const createMemory = require('./memory');
const Cpu = require('./cpu');
const format = require('../core/formatters');

const INSTRUCTIONS = require('../core/instruction.constant');
const REGISTERS = require('../core/register.constant');

let memory;
let cpu;

beforeEach(() => {
    memory = createMemory(256);
    cpu = new Cpu(memory);
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
    expect(registers.buffer.byteLength).toEqual(cpu.registerNames.length * 2);
});

test('cpu should contain memory', () => {
    expect(memory).toBeTruthy();
});

test('cpu should fetch 8 bit instruction from memory', () => {
    const expectedValue = 234;
    memory.setUint8(0, expectedValue);

    const instructionAddress = cpu.getRegister(REGISTERS.ip);
    const actualValue = cpu.fetch();
    const instructionAddressAfterFetch = cpu.getRegister(REGISTERS.ip);
    
    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(1);
});

test('cpu should fetch 16 bit instruction from memory', () => {
    const expectedValue = 65432;
    memory.setUint16(0, expectedValue);

    const instructionAddress = cpu.getRegister(REGISTERS.ip);
    const actualValue = cpu.fetch16();
    const instructionAddressAfterFetch = cpu.getRegister(REGISTERS.ip);

    expect(instructionAddress).toEqual(0);
    expect(actualValue).toEqual(expectedValue);
    expect(instructionAddressAfterFetch).toEqual(2);
});

test('cpu should execute instruction ....', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_R1;
    writableMemory[1] = 0xAB;
    writableMemory[2] = 0xCD;
    
    cpu.tick();
    const r1 = cpu.getRegister(REGISTERS.r1);
    const ip = cpu.getRegister(REGISTERS.ip);
    
    expect(format.asWord(r1)).toEqual('0xABCD');
    expect(format.asWord(ip)).toEqual('0x0003');
});

test('cpu should add r1 and r2 registers to accumulator', () => {
    const writableMemory = new Uint8Array(memory.buffer);
    writableMemory[0] = INSTRUCTIONS.MOV_LIT_R1;
    writableMemory[1] = 0x00;
    writableMemory[2] = 0x03;
    
    writableMemory[3] = INSTRUCTIONS.MOV_LIT_R2;
    writableMemory[4] = 0x01;
    writableMemory[5] = 0x03;

    writableMemory[6] = INSTRUCTIONS.ADD_REG_REG;

    cpu.tick();
    cpu.tick();
    cpu.tick();
    
    const acc = cpu.getRegister(REGISTERS.acc);

    expect(format.asWord(acc)).toEqual('0x0106');
});

test('cpu should have debug registers view', () => {
    cpu.debug();
});

test('cpu should have debug memory view', () => {
    cpu.debugMemoryAt(0);
    cpu.debugMemoryAt(8);
});
