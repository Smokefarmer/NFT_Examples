use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};

pub mod instruction;
use crate::instruction::LockInstruction;

/// Define the type of state stored in accounts
#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct FundsAccount {
    pub balance: u32,
}


// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey, 
    accounts: &[AccountInfo], 
    instruction_data: &[u8], 
) -> ProgramResult {
    msg!("Instruction data: {:?}", instruction_data);
    let instruction = LockInstruction::unpack(instruction_data)?;
    msg!("Instruction: {:?}", instruction);


    // Iterating accounts is safer than indexing
    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;

    // The account must be owned by the program in order to modify its data
    if account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Increment and store the number of times the account has been greeted
    
    let mut lock_funds = FundsAccount::try_from_slice(&account.data.borrow())?;
    msg!("Execute instruction:");
    match instruction {
        LockInstruction::Deposit(val) => {
         lock_funds.balance += val;
        },
        LockInstruction::Withdraw => {
         lock_funds.balance = 0;
        },
    }
    msg!("serialize data:");
    lock_funds.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Balance is: {} ", lock_funds.balance);

    Ok(())
}
