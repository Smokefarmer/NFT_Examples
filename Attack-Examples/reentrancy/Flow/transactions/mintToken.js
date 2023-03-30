export const mintToken = `
import TestToken from <TestToken Address>
import FungibleToken from 0xf233dcee88fe0abe

transaction(receiverAccount: Address) {

  prepare(acct: AuthAccount) {
    let minter = acct.borrow<&TestToken.Minter>(from: /storage/Minter)
                  ?? panic("Resource not found!")

    let newVault <- minter.mintToken(amount: 20.0)
    
    let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
                            .borrow<&TestToken.Vault{FungibleToken.Receiver}>()
                            ?? panic("Capability not found.")
    
    receiverVault.deposit(from: <- newVault)
  }

  execute {
    log("Succesfully deposited tokens into the receiveraccount")
  }
}
`
//https://play.flow.com/e9011cba-17ac-4d60-992a-f144468c5e62?type=script&id=9649172c-230e-4503-bc54-294ea919d243&storage=none
