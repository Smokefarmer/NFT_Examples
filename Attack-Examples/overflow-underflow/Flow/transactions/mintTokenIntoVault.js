export const mintTokenIntoVault = `
import TestToken from 0x03

transaction {

  prepare(acct: AuthAccount) {
    let minter = acct.borrow<&TestToken.Minter>(from: /storage/Minter)
                  ?? panic("Resource not found!")
    let newVault <- minter.mintToken(amount: 20.0)
    log(newVault.balance)
    destroy newVault
  }

  execute {

  }
}
`
//https://play.flow.com/e9011cba-17ac-4d60-992a-f144468c5e62?type=script&id=9649172c-230e-4503-bc54-294ea919d243&storage=none