# TM100 Vault DApp - Setup & Debugging Guide

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` file:

```env
# Required: Get from https://cloud.walletconnect.com/
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Optional but recommended: Get from https://www.alchemy.com/
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Debugging Transaction Issues

### Check Browser Console

The app now logs detailed information:

1. **Contract Data** - Shows USDC balance, allowance, and any errors
2. **Transaction Attempts** - Shows when approve/deposit is triggered
3. **Errors** - Shows detailed error messages

### Common Issues & Solutions

#### Issue: "No API requests hitting"

**Cause**: Missing or invalid WalletConnect Project ID

**Solution**:
1. Go to https://cloud.walletconnect.com/
2. Create a free account
3. Create a new project
4. Copy the Project ID
5. Add to `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
6. Restart dev server

#### Issue: "Transactions fail despite having balance"

**Possible causes**:

1. **Wrong Network**
   - Make sure you're connected to Sepolia testnet
   - Check the network indicator in your wallet

2. **Contract doesn't exist**
   - The vault contract at `0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98` may not exist
   - Check on Sepolia Etherscan: https://sepolia.etherscan.io/address/0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98

3. **No USDC balance**
   - You need Sepolia USDC at `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
   - Get testnet USDC from a faucet

4. **Insufficient gas (ETH)**
   - You need Sepolia ETH for gas fees
   - Get from: https://sepoliafaucet.com/

#### Issue: "Balance shows 0 but I have USDC"

**Check**:
1. Are you on Sepolia network?
2. Is the USDC contract address correct?
3. Check browser console for error messages

---

## Testing the App

### Step 1: Get Testnet Assets

1. **Get Sepolia ETH** (for gas):
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia

2. **Get Sepolia USDC**:
   - Contract: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
   - You may need to find a faucet or swap for it

### Step 2: Connect Wallet

1. Click "Connect Wallet"
2. Select your wallet (MetaMask, Coinbase, etc.)
3. Approve the connection
4. Make sure you're on Sepolia network

### Step 3: Test Deposit

1. Select a vault
2. Enter an amount (or use 25%/50%/75%/MAX buttons)
3. Click "Approve USDC"
4. Confirm in wallet
5. Wait for confirmation
6. Click "Deposit"
7. Confirm in wallet
8. Wait for success message with confetti!

---

## Contract Addresses (Sepolia)

- **USDC**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- **Vault**: `0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98`

**Note**: These contracts may or may not exist. If transactions fail, you may need to:
1. Deploy your own test contracts
2. Use different contract addresses
3. Switch to a different testnet

---

## Next Steps to Make It Production-Ready

1. **Deploy Real Contracts**
   - Deploy ERC4626 vaults to Sepolia
   - Deploy mock USDC if needed
   - Update addresses in `lib/contracts.ts`

2. **Add Withdraw Functionality**
   - Implement withdraw flow
   - Add withdraw button to vault cards
   - Handle share burning

3. **Improve Error Handling**
   - Add toast notifications (sonner)
   - Better error messages
   - Retry logic for failed requests

4. **Add Real-Time Updates**
   - WebSocket for balance updates
   - Auto-refresh every 30 seconds
   - Manual refresh button

5. **Polish UI/UX**
   - Loading skeletons
   - Animations (framer-motion)
   - Mobile optimization
   - Dark mode improvements

---

## Troubleshooting

### Still not working?

1. **Check browser console** for errors
2. **Check network** - must be Sepolia
3. **Check wallet** - must have ETH for gas
4. **Check contract** - verify it exists on Etherscan
5. **Try different RPC** - add Alchemy API key to `.env.local`

### Need help?

Open browser DevTools (F12) and check:
- Console tab for errors
- Network tab for failed requests
- Application tab > Local Storage for persisted data
