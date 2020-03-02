﻿const Register = require('../../core/register');

const IP = new Register('IP', 0x00, 'Instruction Pointer');
const AC = new Register('AC', 0x02, 'Accumulator');
const SP = new Register('SP', 0x04, 'Stack Pointer');
const R1 = new Register('R1', 0x06, 'General Purpose register 1');
const R2 = new Register('R2', 0x08, 'General Purpose register 2');
const R3 = new Register('R3', 0x0A, 'General Purpose register 3');
const R4 = new Register('R4', 0x0C, 'General Purpose register 4');

const ALL = [IP, AC, SP, R1, R2, R3, R4];

module.exports = {
  IP,
  AC,
  SP,
  R1,
  R2,
  R3,
  R4,
  ALL
};
