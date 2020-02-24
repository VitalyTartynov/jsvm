const Memory = require('./memory');
const Registers = require('./registers');
const Alu = require('./alu');
const Cpu = require('./cpu');

const INSTRUCTION = require('../core/instruction.constant');
const REGISTER = require('../core/register.constant');

describe('CPU', () => {
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
    
  test('should be created', () => {
    expect(cpu).toBeTruthy();
  });
    
  test('should contain ram, registers, alu and flash', () => {
    expect(cpu.ram).toBeTruthy();
    expect(cpu.registers).toBeTruthy();
    expect(cpu.alu).toBeTruthy();
    expect(cpu.flash).toBeTruthy();
  });
    
  test('stack pointer should point to end of memory after start', () => {
    expect(cpu.registers.get(REGISTER.SP.address)).toBe(cpu.stackPointerInitial);
  });
  
  test('should run program until HALT instruction', () => {
    ram.byteAt[0] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[1] = 0x12;
    ram.byteAt[2] = 0x34;
    ram.byteAt[3] = REGISTER.R1.address;
    
    ram.byteAt[4] = INSTRUCTION.MOV_LIT_REG.opcode;
    ram.byteAt[5] = 0x56;
    ram.byteAt[6] = 0x78;
    ram.byteAt[7] = REGISTER.R2.address;
    
    ram.byteAt[8] = INSTRUCTION.HLT.opcode;
    
    cpu.run();
    
    expect(cpu.registers.get(REGISTER.R1.address)).toBe(0x1234);
    expect(cpu.registers.get(REGISTER.R2.address)).toBe(0x5678);
    expect(cpu.registers.get(REGISTER.IP.address)).toBe(0x0009);
  });
});

