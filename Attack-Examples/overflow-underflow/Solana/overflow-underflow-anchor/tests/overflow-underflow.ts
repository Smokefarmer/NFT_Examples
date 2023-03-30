import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { OverflowUnderflow } from "../target/types/overflow_underflow";
const { SystemProgram } = anchor.web3;

describe("overflow-underflow", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.OverflowUnderflow as Program<OverflowUnderflow>;

  // The Account to create.


  it("Test overflow", async () => {

    const myAccount = anchor.web3.Keypair.generate();
    // Create the new account and initialize it with the program.

    console.log(`Initialize Account`);
    await program.methods.initialize()
      .accounts({
        myAccount: myAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([myAccount])
      .rpc();
    
    let account = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log(`Account Info:`);
    console.log(`Balance: ${account.balance}`);
    console.log(`Locktime: ${account.locktime}`);

    console.log(`Lock Funds`);
    await program.methods.lockFunds(100)
    .accounts({
      myAccount: myAccount.publicKey,
    })
    .rpc();
    account = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log(`Account Info:`);
    console.log(`Balance: ${account.balance}`);
    console.log(`Locktime: ${account.locktime}`);
   /*
    console.log(`Withdraw Funds too early`);
    await program.methods.withdrawFunds()
    .accounts({
      myAccount: myAccount.publicKey,
    })
    .rpc();
    account = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log(`Account Info:`);
    console.log(`Balance: ${account.balance}`);
    console.log(`Locktime: ${account.locktime}`);
*/


    console.log(`Increase Locktime to overflow Integer`);
    account = await program.account.myAccount.fetch(myAccount.publicKey);
    let increase = Math.pow(2, 32) + 1 - account.locktime ; // max to send
    console.log(`Increase: ${increase}`);
    await program.methods.incrementLocktime(increase)
    .accounts({
      myAccount: myAccount.publicKey,
    })
    .rpc();




    
  });
});
