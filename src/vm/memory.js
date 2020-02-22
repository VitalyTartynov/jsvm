const format = require('../core/format');

class Memory {
    
    constructor(sizeInBytes) {
        const array = new ArrayBuffer(sizeInBytes);
        this._memory = new DataView(array);
        
        this.length = this._memory.buffer.byteLength;
        this.writableMemory = new Uint8Array(this._memory.buffer);
    }

    getUint8(address) {
        return this._memory.getUint8(address);
    }
    
    getUint16(address) {
        return this._memory.getUint16(address);
    }

    setUint8(address, newValue) {
        this._memory.setUint8(address, newValue);
    }
    
    setUint16(address, newValue) {
        this._memory.setUint16(address, newValue);
    }

    debugAt(address) {
        const nextBytes = Array.from({length: 8}, (_, i) => this._memory.getUint8(address + i)).map(value => format.asByte(value));
        return `${format.asWord(address)}: ${nextBytes.join(' ')}`;
    }
}

module.exports = Memory;
