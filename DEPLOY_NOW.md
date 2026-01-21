# URGENT: Deploy Vault Contract

## The Problem
You're trying to call `deposit()` on USDC contract, but USDC doesn't have a deposit function. You need to deploy the actual vault contract first.

## Quick Fix (2 minutes with Remix)

1. **Go to Remix**: https://remix.ethereum.org/
2. **Create file**: `SimpleVault.sol`
3. **Copy this code**:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleVault is ERC20 {
    IERC20 public constant USDC = IERC20(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238);
    
    constructor() ERC20("Simple Vault Token", "SVT") {}
    
    function deposit(uint256 amount) external {
        require(amount > 0, "Cannot deposit 0");
        USDC.transferFrom(msg.sender, address(this), amount);
        _mint(msg.sender, amount);
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
```

4. **Compile & Deploy**:
   - Compile with Solidity 0.8.19+
   - Deploy to Sepolia
   - Copy the deployed address

5. **Update App**:
   Replace all vault addresses in `lib/contracts.ts`:
   ```typescript
   address: 'YOUR_DEPLOYED_ADDRESS' as const,
   ```

## Then Test
- App will work with real vault contract
- Deposit function will execute properly
- No more "function not found" errors

**Current Status**: Vault addresses are set to 0x000... until you deploy the contract.