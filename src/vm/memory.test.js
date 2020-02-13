const createMemory = require('./memory');

test('Memory should be createable', () => {
    const expectedSize = 16;
    const memory = createMemory(expectedSize);
    
    expect(memory).toBeTruthy();
});
