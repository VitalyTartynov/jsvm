class Instruction {
    /**
     * CPU instruction instance
     * @param opcode Operation code.
     * @param command Assemble command.
     * @param description Some description about instruction and operands.
     */
    constructor(opcode, command, description) {
        this.command = command;
        this.opcode = opcode;
        this.description = description;
    }
}

module.exports = Instruction;
