# Deploy Simple Vault - WORKING VERSION

## Quick Deploy with Remix (5 minutes)

1. **Go to Remix**: https://remix.ethereum.org/
2. **Create new file**: `SimpleVault.sol`
3. **Copy contract** from `contracts/TestVault.sol`
4. **Compile**: 
   - Select Solidity 0.8.19+
   - Click "Compile SimpleVault.sol"
5. **Deploy to Sepolia**:
   - Switch to "Deploy & Run" tab
   - Select "Injected Provider - MetaMask"
   - Make sure you're on Sepolia network
   - Click "Deploy"
6. **Copy deployed address** and update `lib/contracts.ts`

## Update App Configuration

After deployment, update all vault addresses in `lib/contracts.ts`:

```typescript
export const VAULTS = [
  {
    id: 'stable',
    name: 'Stable Vault',
    address: 'YOUR_DEPLOYED_ADDRESS_HERE' as const,
    // ...
  },
  // Update all three vaults to use same address
];
```

## Test the App

1. **Get Sepolia USDC**: Use a faucet or bridge
2. **Connect wallet** to the app
3. **Try deposit**: Should work with real transactions!

## Current Status
The app has the correct ABI and will work once you deploy the SimpleVault contract.