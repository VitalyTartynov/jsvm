const format = require('./format');

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

test('formatter should format dword', () => {
    const values = [
        { value: 0,          result: '0x00000000'},
        { value: 1,          result: '0x00000001'},
        { value: 12,         result: '0x0000000C'},
        { value: 15,         result: '0x0000000F'},
        { value: 128,        result: '0x00000080'},
        { value: 170,        result: '0x000000AA'},
        { value: 255,        result: '0x000000FF'},
        { value: 65535,      result: '0x0000FFFF'},
        { value: 65536,      result: '0x00010000'},
        { value: 65537,      result: '0x00010001'},
        { value: 4294967295, result: '0xFFFFFFFF'},
        { value: 4294967296, result: '0x00000000'},
        { value: 4294967297, result: '0x00000001'},
    ];

    values.forEach(item => {
        expect(format.asDword(item.value)).toEqual(item.result);
    });
});

test('formatter should throw error for format negative value as dword', () => {
    // eslint-disable-next-line require-jsdoc
    function formatNegativeWord() {
        format.asDword(-1);
    }

    expect(formatNegativeWord).toThrowError();
});

test('formatter should format qword', () => {
    const values = [
        { value: 0,                       result: '0x0000000000000000'},
        { value: 1,                       result: '0x0000000000000001'},
        { value: 12,                      result: '0x000000000000000C'},
        { value: 15,                      result: '0x000000000000000F'},
        { value: 128,                     result: '0x0000000000000080'},
        { value: 170,                     result: '0x00000000000000AA'},
        { value: 255,                     result: '0x00000000000000FF'},
        { value: 65535,                   result: '0x000000000000FFFF'},
        { value: 65536,                   result: '0x0000000000010000'},
        { value: 65537,                   result: '0x0000000000010001'},
        { value: 4294967295,              result: '0x00000000FFFFFFFF'},
        { value: 4294967296,              result: '0x0000000100000000'},
        { value: 4294967297,              result: '0x0000000100000001'},
        { value: Number.MAX_SAFE_INTEGER, result: '0x001FFFFFFFFFFFFF'},        
    ];

    values.forEach(item => {
        expect(format.asQword(item.value)).toEqual(item.result);
    });
});

test('formatter should throw error for format negative value as qword', () => {
    // eslint-disable-next-line require-jsdoc
    function formatNegativeWord() {
        format.asQword(-1);
    }

    expect(formatNegativeWord).toThrowError();
});
