const format = require('./formatters');

test('formatter should format byte', () => {
    const values = [
        { value: 0,   result: '0x00'},
        { value: 1,   result: '0x01'},
        { value: 12,  result: '0x0C'},
        { value: 15,  result: '0x0F'},
        { value: 128, result: '0x80'},
        { value: 170, result: '0xAA'},
        { value: 255, result: '0xFF'},
    ];
    
    values.forEach(item => {
        expect(format.asByte(item.value)).toEqual(item.result);  
    });
});

test('formatter should format word', () => {
    const values = [
        { value: 0,     result: '0x0000'},
        { value: 1,     result: '0x0001'},
        { value: 12,    result: '0x000C'},
        { value: 15,    result: '0x000F'},
        { value: 128,   result: '0x0080'},
        { value: 170,   result: '0x00AA'},
        { value: 255,   result: '0x00FF'},
        { value: 65535, result: '0xFFFF'},
    ];

    values.forEach(item => {
        expect(format.asWord(item.value)).toEqual(item.result);
    });
});
