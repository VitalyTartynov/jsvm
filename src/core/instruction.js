class Instruction {
    constructor(opcode, command, description) {
        this.command = command;
        this.opcode = opcode;
        this.description = description;
    }
}

module.exports = Instruction;
