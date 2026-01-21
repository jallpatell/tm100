// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * Simple vault that accepts USDC deposits
 * Minimal implementation for demo purposes
 */
contract SimpleVault is ERC20 {
    IERC20 public constant USDC = IERC20(0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238);
    
    constructor() ERC20("Simple Vault Token", "SVT") {}
    
    function deposit(uint256 amount) external {
        require(amount > 0, "Cannot deposit 0");
        
        // Transfer USDC from user to vault
        USDC.transferFrom(msg.sender, address(this), amount);
        
        // Mint vault tokens 1:1 with USDC (scaled for decimals)
        _mint(msg.sender, amount);
    }
    
    function decimals() public pure override returns (uint8) {
        return 6; // Match USDC decimals
    }
}