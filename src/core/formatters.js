/**
 * Format byte value in HEX 
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asByte(value) {
    return `0x${value.toString(16).padStart(2, '0').toUpperCase()}`;
}

/**
 * Format word value in HEX
 * @param value Value in DEC
 * @returns {string} Result HEX value as string
 */
function asWord(value) {
    return `0x${value.toString(16).padStart(4, '0').toUpperCase()}`;
}

module.exports = {
    asByte,
    asWord
};
