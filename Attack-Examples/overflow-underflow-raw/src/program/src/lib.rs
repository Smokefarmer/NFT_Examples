use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo}, 
    entrypoint, 
    entrypoint::ProgramResult, 
    msg, 
    program_error::ProgramError,
    pubkey::Pubkey,
};
use crate::calculator::CalculatorInstructions;

mod calculator;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct LockFunds {
    pub balance: u32,
    pub locktime: u32,
}


entrypoint!(process_instruction);


fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    // Directly from Solana Hello World example:
    //
    // Iterating accounts is safer than indexing
    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;

    // The account must be owned by the program in order to modify its data
    if account.owner != program_id {
        msg!("Account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    msg!("Adding 1 to sum")

    let mut calc = Calculator::try_from_slice(&account.data.borrow())?;
    cals.balance += 1;
    calc.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Value is now: {}", calc.value);

    Ok(())
}