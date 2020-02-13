/**
 * Allocate piece of memory
 * @param sizeInBytes size of piece in bytes
 * @returns {DataView}
 */
function createMemory(sizeInBytes) {
    const array = new ArrayBuffer(sizeInBytes);
    return new DataView(array);
}

module.exports = createMemory;
