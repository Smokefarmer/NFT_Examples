export const getVaultBalance = `
import TestToken from 0x03
import FungibleToken from 0x01


pub fun main(account: Address){
  let publicVault = getAccount(account).getCapability(/public/Vault)
                        .borrow<&TestToken.Vault{FungibleToken.Balance, TestToken.LockTimer}>()
                        ?? panic("Vault not found.")
  log(publicVault.balance)
  log(publicVault.lockTime)
}
`
//https://play.flow.com/e9011cba-17ac-4d60-992a-f144468c5e62?type=script&id=9649172c-230e-4503-bc54-294ea919d243&storage=none