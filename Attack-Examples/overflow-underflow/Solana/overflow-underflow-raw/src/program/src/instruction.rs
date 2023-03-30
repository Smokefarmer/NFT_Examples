use solana_program::{program_error::ProgramError, instruction::Instruction};
use std::convert::TryInto;

#[derive(Debug)]
pub enum LockInstruction {
    Deposit(u32),
    Withdraw,
}

impl LockInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        match tag {
            0 => {
                if rest.len() != 4 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let val: Result<[u8;4], _> = rest[..4].try_into();
                match val {
                    Ok(i) => {
                        return Ok(LockInstruction::Deposit(u32::from_le_bytes(i)))
                    },
                    _ => return Err(ProgramError::InvalidInstructionData)
                }

            },
            1 => return Ok(LockInstruction::Withdraw),
            _ => return Err(ProgramError::InvalidInstructionData)
        }
    }
}