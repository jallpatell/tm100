// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract QuickVault {
    mapping(address => uint256) public balances;
    uint256 public totalSupply;
    
    function deposit(uint256) external {
        // Simple deposit that just tracks balance
        balances[msg.sender] += 1000000; // Add 1 USDC worth
        totalSupply += 1000000;
    }
    
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
    
    function decimals() external pure returns (uint8) {
        return 6;
    }
}