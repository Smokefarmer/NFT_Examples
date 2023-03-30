import FungibleToken from 0xf233dcee88fe0abe

pub contract TestToken: FungibleToken  {

  pub var totalSupply: UFix64
  /// The event that is emitted when the contract is created
  pub event TokensInitialized(initialSupply: UFix64)

  /// The event that is emitted when tokens are withdrawn from a Vault
  pub event TokensWithdrawn(amount: UFix64, from: Address?)

  /// The event that is emitted when tokens are deposited into a Vault
  pub event TokensDeposited(amount: UFix64, to: Address?)
  
  

  pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance{
    pub var balance: UFix64

    pub fun deposit(from: @FungibleToken.Vault){
      let vault <- from as! @TestToken.Vault
      emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
      self.balance = self.balance + vault.balance
      
      vault.balance = 0.0
      destroy vault 
    }

    pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
      self.balance = self.balance - amount
      emit TokensWithdrawn(amount: amount, from: self.owner?.address)
      return <- create Vault(balance: amount)
    }

    init(balance: UFix64){
      self.balance = balance
      emit TokensInitialized(initialSupply: balance)
    }

    destroy() {
      TestToken.totalSupply = TestToken.totalSupply - self.balance
    }

  }

  pub fun createEmptyVault(): @FungibleToken.Vault {
    return <- create Vault(balance: 0.0)
  }

  pub resource Minter {
    pub fun mintToken(amount: UFix64): @FungibleToken.Vault{
      TestToken.totalSupply = TestToken.totalSupply + amount
      return <- create Vault(balance: amount)
    }
  }

  init(){
    self.totalSupply = 0.0
    self.account.save(<- create Minter(), to: /storage/Minter)
  }

  
}
