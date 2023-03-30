export const transferToken = `
mport TestToken from 0x03
import FungibleToken from 0x01

transaction(receiverAccount: Address, amount: UFix64) {

  prepare(acct: AuthAccount) {
    let signerVault = acct.borrow<&TestToken.Vault>(from: /storage/Vault)
                            ??panic("Vault not found.")

    let receiverVault = getAccount(receiverAccount).getCapability(/public/Vault)
                            .borrow<&TestToken.Vault{FungibleToken.Receiver}>()
                            ?? panic("Capability not found.")
    
    receiverVault.deposit(from: <- signerVault.withdraw(amount: amount))
  }

  execute {
    log("Transferd funds.")
  }
}
`
//https://play.flow.com/e9011cba-17ac-4d60-992a-f144468c5e62?type=script&id=9649172c-230e-4503-bc54-294ea919d243&storage=none