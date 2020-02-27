# JSVM
![Node.js CI](https://github.com/VitalyTartynov/jsvm/workflows/Linter/badge.svg)
![Node.js CI](https://github.com/VitalyTartynov/jsvm/workflows/Tests/badge.svg)

16 bit js virtual machine implementation

## Register set
Actual information can be found [here](./src/core/register.constant.js).
 * IP - Instruction pointer. Register value contains memory address of next command for executing.
 * AC - Accumulator.
 * SP - Stack pointer. Register value contains memory address of stack head.
 * Rx - some of general purpose registers. 

## Instruction set
Actual information can be found [here](./src/core/instruction.constant.js).

| Opcode | Command | Arguments    | Sample        | Description                         |
| ------ | ------- | ------------ | ------------- | ----------------------------------- |
| 0x00   | `NOP`   |              |               | No operation                        |
| 0x??   | `PUSH`  | `0x????`     | `PUSH 0x1234` | Push 16 bit constant to stack       |
| 0x??   | `PUSH`  | `Rx`         | `PUSH R4`     | Push register value to stack        |
| 0x??   | `POP`   | `Rx`         | `POP R1`      | Pop value from stack to register    |
| 0xFF   | `HLT`   |              |               | Halt                                |

## Memory model

## Stack
