const Register = require('./register');

const IP  = new Register('IP',  0x00);
const ACC = new Register('ACC', 0x02);
const SP  = new Register('SP',  0x04);
const R1  = new Register('R1',  0x06);
const R2  = new Register('R2',  0x08);
const R3  = new Register('R3',  0x0A);
const R4  = new Register('R4',  0x0C);

module.exports = {
    IP,
    ACC,
    SP,
    R1,
    R2,
    R3,
    R4,
};
