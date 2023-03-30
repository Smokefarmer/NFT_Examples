/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Keypair,
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import fs from 'mz/fs';
import path from 'path';
import * as borsh from 'borsh';

import * as BufferLayout from "@solana/buffer-layout";
import {Buffer} from 'buffer';

import {getPayer, getRpcUrl, createKeypairFromFile} from './util';




//Connection to the network
let connection: Connection;

//Keypair associated to the fees' payer
let payer: Keypair;

let programId: PublicKey;

//The public key of the user account
let userPubkey: PublicKey;

//Path to program files
const PROGRAM_PATH = path.resolve(__dirname, '../../dist/program');
const PROGRAM_SO_PATH = path.join(PROGRAM_PATH, 'program.so');
const PROGRAM_KEYPAIR_PATH = path.join(PROGRAM_PATH, 'program-keypair.json');

//The state of the contract account 
class FundsAccount {
  balance = 0;
  constructor(fields: {balance: number} | undefined = undefined) {
    if (fields) {
      this.balance = fields.balance;
    }
  }
}

//Borsh schema definition for the account
const AccountSchema = new Map([
  [FundsAccount, {kind: 'struct', fields: [
    ['balance', 'u32'],
  ]}],
]);

//The expected size of each account.
const ACCOUNT_SIZE = borsh.serialize(
  AccountSchema,
  new FundsAccount(),
).length;

//Establish a connection to the cluster
export async function establishConnection(): Promise<void> {
  const rpcUrl = await getRpcUrl();
  connection = new Connection(rpcUrl, 'confirmed');
  console.log('Connection to cluster established:', rpcUrl);
}

/**
 * Establish an account to pay for everything
 */
export async function establishPayer(): Promise<void> {
  if (!payer) {
    payer = await getPayer();
  }
}

//Check if the contract has been deployed
export async function checkProgram(): Promise<void> {
  // Read program id from keypair file
  try {
    const programKeypair = await createKeypairFromFile(PROGRAM_KEYPAIR_PATH);
    programId = programKeypair.publicKey;
  } catch (err) {
    const errMsg = (err as Error).message;
    throw new Error(
      `Failed to read program keypair at '${PROGRAM_KEYPAIR_PATH}' due to error: ${errMsg}. Program may need to be deployed with \`solana program deploy dist/program/helloworld.so\``,
    );
  }

  // Check if the program has been deployed
  const programInfo = await connection.getAccountInfo(programId);
  if (programInfo === null) {
    if (fs.existsSync(PROGRAM_SO_PATH)) {
      throw new Error(
        'Program needs to be deployed with `solana program deploy dist/program/helloworld.so`',
      );
    } else {
      throw new Error('Program needs to be built and deployed');
    }
  } else if (!programInfo.executable) {
    throw new Error(`Program is not executable`);
  }
  console.log(`Program verified`);

  // Derive the address (public key) of a account from the program so that it's easy to find later.
  const USER_SEED = 'user';
  userPubkey = await PublicKey.createWithSeed(
    payer.publicKey,
    USER_SEED,
    programId,
  );

  // Check if the greeting account has already been created
  const userAccount = await connection.getAccountInfo(userPubkey);
  if (userAccount === null) {
    console.log('Account created');
    const lamports = await connection.getMinimumBalanceForRentExemption(
      ACCOUNT_SIZE,
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccountWithSeed({
        fromPubkey: payer.publicKey,
        basePubkey: payer.publicKey,
        seed: USER_SEED,
        newAccountPubkey: userPubkey,
        lamports,
        space: ACCOUNT_SIZE,
        programId,
      }),
    );
    await sendAndConfirmTransaction(connection, transaction, [payer]);
  }
}


interface SettingsWithParameter {
  instruction: number,
  value: number
}

function depositInstrction(balance:number): Buffer {
  const layout = BufferLayout.struct<SettingsWithParameter>([
    BufferLayout.u8('instruction'),
    BufferLayout.u32('value')
  ]);
  const data = Buffer.alloc(layout.span);
  layout.encode({instruction:0, value: balance}, data);
  return data;
}


export async function sendInstructionDeposit(): Promise<void> {
  console.log('Sending Instruction');
  const instruction = new TransactionInstruction({
    keys: [{pubkey: userPubkey, isSigner: false, isWritable: true}],
    programId,
    data: depositInstrction(100),
  });
  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payer],
  );
}

export async function sendInstructionDepositOverflow(): Promise<void> {
  console.log('Sending Instruction');
  const accountInfo = await connection.getAccountInfo(userPubkey);
  if (accountInfo === null) {
    throw 'Error: cannot find the greeted account';
  }
  const user = borsh.deserialize(
    AccountSchema,
    FundsAccount,
    accountInfo.data,
  );
  let overflow = Math.pow(2,32) - user.balance;
  const instruction = new TransactionInstruction({
    keys: [{pubkey: userPubkey, isSigner: false, isWritable: true}],
    programId,
    data: depositInstrction(overflow),
  });
  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(instruction),
    [payer],
  );
}

/**
 * Report the number of times the greeted account has been said hello to
 */
export async function logs(): Promise<void> {
  const accountInfo = await connection.getAccountInfo(userPubkey);
  if (accountInfo === null) {
    throw 'Error: cannot find the greeted account';
  }
  const user = borsh.deserialize(
    AccountSchema,
    FundsAccount,
    accountInfo.data,
  );
  console.log(
    'The balance is',
    user.balance,
  );
}
