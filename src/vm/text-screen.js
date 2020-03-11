/**
 * Text screen device.
 */
class TextScreen {
  constructor() {
  }
  
  getUint8() { }
  setUint8() { }
  getUint16() { }
  setUint16(address, value) {
    const character = String.fromCharCode(value);
    console.log(character);
  }
}

module.exports = TextScreen;
