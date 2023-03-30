export const createVaultWithoutCapabilities = `
import TestToken from 0x03
import FungibleToken from 0x01

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- TestToken.createEmptyVault(), to: /storage/Vault)
    acct.link<&TestToken.Vault{FungibleToken.Balance, FungibleToken.Receiver, FungibleToken.Provider}>(/public/Vault, target: /storage/Vault)
  }

  execute {
    log("Vault Created!")
  }
}
`
//https://play.flow.com/e9011cba-17ac-4d60-992a-f144468c5e62?type=script&id=9649172c-230e-4503-bc54-294ea919d243&storage=none
