const VirtualMachine = require('./virtual-machine');

describe('VirtualMachine', () => {
  let virtualMachine;
  
  beforeEach(() => {
    virtualMachine = new VirtualMachine();
  });
  
  test('should be created', () => {
    expect(virtualMachine).toBeTruthy();
  });
});
