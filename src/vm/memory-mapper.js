/**
 * Map memory to other devices like video memory or smth else.
 */
class MemoryMapper {
  constructor() {
    this.regions = [];
  }

  /**
   * Map part of memory to specific device.
   * @param {object} device Device for map.
   * @param {number} start Start address.
   * @param {number} end End address.
   * @param {boolean} remap Remap.
   * @returns {undefined}
   */
  map(device, start, end, remap = true) {
    const region = {
      device,
      start,
      end,
      remap
    };
    this.regions.unshift(region);

    return () => {
      this.regions = this.regions.filter(x => x !== region);
    };
  }

  getUint8(address) {
    const region = this.findRegion(address);
    const finalAddress = region.remap
      ? address - region.start
      : address;
    return region.device.getUint8(finalAddress);
  }

  setUint8(address, value) {
    const region = this.findRegion(address);
    const finalAddress = region.remap
      ? address - region.start
      : address;
    return region.device.setUint8(finalAddress, value);
  }

  getUint16(address) {
    const region = this.findRegion(address);
    const finalAddress = region.remap
      ? address - region.start
      : address;
    return region.device.getUint16(finalAddress);
  }

  setUint16(address, value) {
    const region = this.findRegion(address);
    const finalAddress = region.remap
      ? address - region.start
      : address;
    return region.device.setUint16(finalAddress, value);
  }

  findRegion(address) {
    let region = this.regions.find(r => address >= r.start && address <= r.end);
    if (!region) {
      throw new Error(`No memory region found for address ${address}`);
    }
    
    return region;
  }
}

module.exports = MemoryMapper;
