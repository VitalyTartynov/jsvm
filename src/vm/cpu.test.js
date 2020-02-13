const Cpu = require('./cpu');

let cpu;

beforeEach(() => {
    cpu = new Cpu();
});

test('cpu should be createable', () => {
    expect(cpu).toBeTruthy();
});

test('cpu should contain registers', () => {
    const registers = cpu.registers;
    
    expect(registers).toBeTruthy();
    expect(registers.length).toBeGreaterThan(0);
});
