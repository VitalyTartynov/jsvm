/**
 * Format byte value in HEX 
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asByte(value) {
    if (value < 0) {
        throw new Error('Negative values not allowed');
    }    
    
    let hexValue = value.toString(16)
        .padStart(2, '0')
        .toUpperCase();
    
    if (hexValue.length > 2) {
        hexValue = hexValue.substring(hexValue.length - 2);
    }
    
    return `0x${hexValue}`;
}

/**
 * Format word value in HEX
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asWord(value) {
    if (value < 0) {
        throw new Error('Negative values not allowed');
    }
    
    let hexValue = value.toString(16)
        .padStart(4, '0')
        .toUpperCase();
    
    if (hexValue.length > 4) {
        hexValue = hexValue.substring(hexValue.length - 4);
    }
    
    return `0x${hexValue}`;
}

module.exports = {
    asByte,
    asWord
};
