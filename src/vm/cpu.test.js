const Memory = require('./memory');
const Registers = require('./registers');
const Alu = require('./alu');
const Cpu = require('./cpu');

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
});

