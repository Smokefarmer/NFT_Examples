export const createVaultWithoutCapabilities = `
import TestToken from <TestToken Address>
import FungibleToken from 0xf233dcee88fe0abe

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- TestToken.createEmptyVault(), to: /storage/Vault)
  }

  execute {
    log("Vault Created!")
  }
}
`
//https://play.flow.com/e9011cba-17ac-4d60-992a-f144468c5e62?type=script&id=9649172c-230e-4503-bc54-294ea919d243&storage=none