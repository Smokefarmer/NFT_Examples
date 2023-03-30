import {
    establishConnection,
    establishPayer,
    checkProgram,
    sendInstructionDeposit,
    sendInstructionDepositOverflow,
    logs,
  } from './LockFunds';
  
  async function main() {
    console.log("Let's say hello to a Solana account...");
  
    // Establish connection to the cluster
    await establishConnection();
  
    // Determine who pays for the fees
    await establishPayer();
  
    // Check if the program has been deployed
    await checkProgram();
  
    await sendInstructionDeposit();
    await logs();
    await sendInstructionDepositOverflow();
    // Find out how many times that account has been greeted
    await logs();
  
    console.log('Success');
  }
  
  main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );
  