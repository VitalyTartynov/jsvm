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
        { value: 256, result: '0x00'},
        { value: 257, result: '0x01'},
    ];
    
    values.forEach(item => {
        expect(format.asByte(item.value)).toEqual(item.result);  
    });
});

test('formatter should throw error for format negative value as byte', () => {
    // eslint-disable-next-line require-jsdoc
    function formatNegativeByte() {
        format.asByte(-1);
    }
    
    expect(formatNegativeByte).toThrowError(); 
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
        { value: 65536, result: '0x0000'},
        { value: 65537, result: '0x0001'},
    ];

    values.forEach(item => {
        expect(format.asWord(item.value)).toEqual(item.result);
    });
});

test('formatter should throw error for format negative value as word', () => {
    // eslint-disable-next-line require-jsdoc
    function formatNegativeWord() {
        format.asWord(-1);
    }

    expect(formatNegativeWord).toThrowError();
});
