import * as borsh from 'borsh';
import * as math from './main';



// --------------------------------------------------------

/*
Account Data
*/

class LockFunds {
  balance = 0;
  locktime = 0;
  constructor(fields: {balance: number, locktime: number} | undefined = undefined) {
    if (fields) {
      this.balance = fields.balance;
      this.balance = fields.balance;
    }
  }
}

const LockFundsSchema = new Map([
  [LockFunds, {kind: 'struct', fields: [
    ['balance', 'u32'],
    ['locktime', 'u32']
    ]}],
]);

const CALCULATOR_SIZE = borsh.serialize(
    LockFundsSchema,
  new LockFunds(),
).length;


// --------------------------------------------------------

/*
Instruction Data
*/

export class Instructions {
  operation = 0;
  operating_value = 0;
  constructor(fields: {operation: number, operating_value: number} | undefined = undefined) {
    if (fields) {
      this.operation = fields.operation;
      this.operating_value = fields.operating_value;
    }
  }
}

export const CalculatorInstructionsSchema = new Map([
  [Instructions, {kind: 'struct', fields: [
    ['operation', 'u32'], ['operating_value', 'u32']
  ]}],
]);

export const CALCULATOR_INSTRUCTIONS_SIZE = borsh.serialize(
  CalculatorInstructionsSchema,
  new Instructions(),
).length;



// --------------------------------------------------------

/*
Main
*/

async function main() {
  await math.example(CALCULATOR_SIZE);
}


main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );