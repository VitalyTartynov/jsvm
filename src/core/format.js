/**
 * Format byte value in HEX 
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asByte(value) {
    return _format(value, 2);
}

/**
 * Format word value in HEX
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asWord(value) {
    return _format(value, 4);
}

/**
 * Format dword value in HEX
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asDword(value) {
    return _format(value, 8);
}

/**
 * Format qword value in HEX
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asQword(value) {
    return _format(value, 16);
}

/**
 * Format value to HEX with base
 * @param value Value in DEC
 * @param base 2 for byte, 4 for word, 8 for dword
 * @returns {string} Result HEX value as string
 * @private
 */
function _format(value, base) {
    if (value < 0) {
        throw new Error('Negative values not allowed');
    }

    let hexValue = value.toString(16)
        .padStart(base, '0')
        .toUpperCase();

    if (hexValue.length > base) {
        hexValue = hexValue.substring(hexValue.length - base);
    }

    return `0x${hexValue}`;
}

module.exports = {
    asByte,
    asWord,
    asDword,
    asQword
};
