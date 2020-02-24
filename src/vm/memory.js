const format = require('../core/format');

class Memory {    
    constructor(sizeInBytes) {
        const array = new ArrayBuffer(sizeInBytes);
        this._memory = new DataView(array);
        
        this.length = this._memory.buffer.byteLength;
        this.byteAt = new Uint8Array(this._memory.buffer);
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

    debugAt(address, lines = 1) {
        let result = '';
        const bytesInOneLine = 8;
        for (let i = 0; i < lines; i++) {
            const nextBytes = Array.from({length: bytesInOneLine}, (_, i) => this._memory.getUint8(address + i)).map(value => format.asByte(value));
            result += `${format.asWord(address)}: ${nextBytes.join(' ')}`;
            if (i !== lines - 1) {
                result += '\n';
                address += bytesInOneLine;
            }
        }
        
        return result;
    }
}

module.exports = Memory;
