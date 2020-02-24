const Instruction = require('./instruction');

const NOP         = new Instruction(0x00, 'NOP', 'NO OPERATION');
const MOV_LIT_REG = new Instruction(0x10, 'MOV', 'MOVE WORD Rx -> Rx');
const MOV_REG_REG = new Instruction(0x11, 'MOV', 'MOVE Rx Ry -> Ry');
const MOV_REG_MEM = new Instruction(0x12, 'MOV', 'MOVE Rx 0x**** -> 0x****');
const MOV_MEM_REG = new Instruction(0x13, 'MOV', 'MOVE 0x**** Rx -> Rx');
const ADD_REG_REG = new Instruction(0x14, 'ADD', 'ADD Rx Ry -> ACC');
const SUB_REG_REG = new Instruction(0x15, 'SUB', 'SUB Rx Ry -> ACC');
const JMP_EQ      = new Instruction(0x16, 'JMP', 'JMP WORD 0x****');
const JMP_NOT_EQ  = new Instruction(0x17, 'JNE', 'JNE WORD 0x****');
const PSH_LIT     = new Instruction(0x18, 'PUSH', 'PUSH WORD -> STACK');
const PSH_REG     = new Instruction(0x19, 'PUSH', 'PUSH Rx -> STACK');
const POP         = new Instruction(0x1A, 'POP', 'POP Rx <- STACK');
const JMP         = new Instruction(0x1B, 'JMP', 'JUMP WORD');

const UNKNOWN     = new Instruction(0xBC, 'UNKNOWN', 'UNKNOWN INSTRUCTION');

module.exports = {
    NOP,
    MOV_LIT_REG,
    MOV_REG_REG,
    MOV_REG_MEM,
    MOV_MEM_REG,
    ADD_REG_REG,
    SUB_REG_REG,
    JMP_EQ,
    JMP_NOT_EQ,
    PSH_LIT,
    PSH_REG,
    POP,
    JMP,
    UNKNOWN,
};
