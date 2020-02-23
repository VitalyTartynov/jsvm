const IP  = 0x00;
const ACC = 0x01;
const SP  = 0x02;
const R1  = 0x03;
const R2  = 0x04;
const R3  = 0x05;
const R4  = 0x06;

const registerMappings = {};
registerMappings[IP]  = 'ip';
registerMappings[ACC] = 'acc';
registerMappings[SP]  = 'sp';
registerMappings[R1]  = 'r1';
registerMappings[R2]  = 'r2';
registerMappings[R3]  = 'r3';
registerMappings[R4]  = 'r4';

module.exports = {
    IP,
    ACC,
    SP,
    R1,
    R2,
    R3,
    R4,
    registerMappings
};
