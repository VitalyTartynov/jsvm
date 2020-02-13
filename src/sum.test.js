const sum = require('./sum');

test('sum 1 and 2 equal 3', () => {
    expect(sum(1, 2)).toBe(3);
});
