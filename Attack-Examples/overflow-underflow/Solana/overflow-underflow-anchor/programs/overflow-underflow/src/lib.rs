use anchor_lang::prelude::*;

declare_id!("7Bce37n1XhVnk7Ei83mg9r2svVmwyZJiMBd86DqJJWr");

#[program]
pub mod overflow_underflow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.balance = 0;
        my_account.locktime = 0;
        msg!("Saved Timestamp: {}", my_account.locktime);
        Ok(())
    }

    pub fn lock_funds(ctx: Context<LockFunds>, funds: u32) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        let clock = Clock::get()?;
        my_account.locktime = u32::try_from(clock.unix_timestamp).ok().unwrap() + 604800; // 1 week in seconds 
        msg!("Chainged timestamp: {}", my_account.locktime);
        my_account.balance = funds;
        Ok(())

    }

    pub fn withdraw_funds(ctx: Context<LockFunds>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        let clock = Clock::get()?;
        if my_account.locktime > clock.unix_timestamp.try_into().unwrap() {
            msg!("Send back SOL {}", my_account.balance);
            Ok(())
        } else{
            msg!("Funds still locked");
            Ok(())
        }        
    }

    pub fn increment_locktime(ctx: Context<LockFunds>, increse_locktime: u32) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.locktime += increse_locktime;
        msg!("Chainged timestamp: {}", my_account.locktime);
        Ok(())
    }

}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct LockFunds<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[account]
pub struct MyAccount {
    pub balance: u32,
    pub locktime: u32
}