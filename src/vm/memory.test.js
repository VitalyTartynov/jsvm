const Memory = require('./memory');

test('Memory should be createable', () => {
    const expectedSize = 16;
    const memory = new Memory(expectedSize);
    
    expect(memory).toBeTruthy();
    expect(memory.length).toBe(expectedSize);
});

test('Memory should have debug memory view', () => {
    const expectedSize = 16;
    const memory = new Memory(expectedSize);

    expect(memory.debugAt).toBeDefined();
    
    const result = memory.debugAt(0x0000);
    expect(result).toBe('0x0000: 0x00 0x00 0x00 0x00 0x00 0x00 0x00 0x00');
});
