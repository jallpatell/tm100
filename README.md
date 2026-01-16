# TM100 Vault DApp

A Next.js decentralized application for depositing USDC into ERC-4626 vaults with comprehensive error handling and user-friendly blockchain interactions.

## Features

- 🔐 Wallet connection via RainbowKit (MetaMask, Coinbase Wallet, WalletConnect)
- 📊 Real-time vault data from Sepolia blockchain
- 💰 Two-step deposit flow (Approve → Deposit)
- ⚠️ Comprehensive error handling for all edge cases
- ⏳ Clear loading states for async blockchain operations
- 🌐 Network detection and switching
- 📱 Responsive design for mobile and desktop
- 🎉 Success animations with confetti
- 📈 Portfolio view showing positions across all vaults

## Setup

### Prerequisites
- Node.js 18+ and npm
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH for gas fees
- Sepolia USDC for deposits (get from faucet)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repo-url>
cd tm100web
npm install
```

2. **Configure WalletConnect Project ID:**

Get a free Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

Update `app/providers.tsx`:
```typescript
projectId: 'YOUR_PROJECT_ID',
```

3. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

No `.env` file required. Configuration is in code:

- **Vault Contract**: `lib/contracts.ts` - `0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98` (Sepolia)
- **Network**: Sepolia testnet (chainId: 11155111)
- **USDC Address**: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238` (Sepolia)

## Architecture

### Tech Stack
- **Next.js 16** - React framework with App Router
- **Wagmi v2** - React hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **RainbowKit** - Wallet connection UI
- **TanStack Query** - Async state management
- **Tailwind CSS** - Styling

### Project Structure
```
app/
  ├── page.tsx          # Main page with vault grid
  ├── layout.tsx        # Root layout with Web3Provider
  └── providers.tsx     # Wagmi + RainbowKit configuration

components/
  ├── VaultCard.tsx     # Individual vault display
  ├── VaultGrid.tsx     # Grid of all vaults
  ├── DepositForm.tsx   # Approve & deposit flow
  ├── Portfolio.tsx     # User's positions summary
  └── NetworkGuard.tsx  # Wrong network detection

hooks/
  ├── useVault.ts       # Fetch vault data (TVL, balance)
  └── useUSDCBalance.ts # Fetch user's USDC balance

lib/
  ├── contracts.ts      # ABIs and addresses
  └── utils.ts          # Helper functions
```

### State Management & Error Handling

#### Async Transaction Handling
- **Wagmi hooks** manage transaction lifecycle:
  - `useWriteContract` - Initiate transactions
  - `useWaitForTransactionReceipt` - Wait for confirmations
  - `useReadContract` - Fetch blockchain data with polling

- **Loading states**:
  - `isPending` - Transaction submitted to wallet
  - `isLoading` - Waiting for block confirmation
  - `isSuccess` - Transaction confirmed

- **Auto-refresh**: Data polls every 5-10 seconds for real-time updates

#### Error Handling Strategy
1. **User rejection**: Clear message "You rejected the transaction"
2. **Transaction revert**: "Transaction reverted" with context
3. **Insufficient funds**: "Insufficient funds for gas"
4. **Wrong network**: NetworkGuard blocks UI, prompts switch
5. **Contract errors**: Graceful fallback with mock data for demo

#### Approve → Deposit Flow Logic
```typescript
const needsApproval = amountBigInt > allowance;

if (needsApproval) {
  // Show "Approve USDC" button
  // After approval succeeds → refetch allowance
  // Button automatically changes to "Deposit"
} else {
  // Show "Deposit" button
}
```

### Key Components

**VaultCard** - Displays vault info with real-time data
- TVL from `vault.totalAssets()`
- User balance from `vault.balanceOf(address)`
- Etherscan link for contract verification

**DepositForm** - Two-step transaction flow
- Amount input with 25%, 50%, 75%, MAX buttons
- Estimated shares calculation
- Approve USDC → Deposit sequence
- Transaction hash links to Etherscan
- Confetti animation on success

**NetworkGuard** - Network validation
- Detects if user is on wrong network
- Shows warning with "Switch to Sepolia" button
- Blocks vault access until correct network

**Portfolio** - User's positions
- Total USD value across all vaults
- Individual vault breakdown
- Only shows if user has deposits

## What I Did Myself vs What AI Helped With

### I Did Myself
- ✅ Project architecture and component structure
- ✅ State management strategy for async transactions
- ✅ Error handling patterns and edge cases
- ✅ User flow design (approve → deposit)
- ✅ Network handling logic
- ✅ Real-time polling configuration
- ✅ Testing and debugging blockchain interactions

### AI Helped With
- ✅ Boilerplate code generation (ABIs, types)
- ✅ Tailwind CSS styling and responsive design
- ✅ TypeScript type definitions
- ✅ Documentation and README structure
- ✅ Code formatting and consistency

### Core Logic (100% Manual)
- Transaction flow state machine
- Error message mapping
- Allowance checking logic
- Network detection and switching
- Portfolio calculation
- Real-time data polling strategy

## Testing

### Happy Path
1. Connect wallet on Sepolia
2. View vault cards with real TVL data
3. Click "Deposit" on any vault
4. Enter amount (e.g., 10 USDC)
5. Click "Approve USDC" → Confirm in MetaMask
6. Wait for confirmation → Button changes to "Deposit"
7. Click "Deposit" → Confirm in MetaMask
8. See confetti animation and success message
9. View transaction on Etherscan

### Error Scenarios
1. **User rejection**: Click approve/deposit → Reject in MetaMask → See "You rejected the transaction"
2. **Wrong network**: Connect on Mainnet → See orange warning → Click "Switch to Sepolia"
3. **Insufficient balance**: Enter amount > balance → See error message
4. **No wallet**: Visit site without wallet → See "Connect your wallet" prompt

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Deploy to Vercel/Railway
1. Push to GitHub
2. Connect repository to Vercel/Railway
3. Deploy automatically
4. Set `projectId` environment variable if needed

## Contract Details

**Vault Contract**: ERC-4626 compliant vault on Sepolia
- Address: `0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98`
- Standard: OpenZeppelin ERC-4626
- Network: Sepolia testnet
- [View on Etherscan](https://sepolia.etherscan.io/address/0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98)

**USDC Token**: Mock USDC on Sepolia
- Address: `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`
- Decimals: 6
- Get from Sepolia faucet

## Future Enhancements

- [ ] Withdraw flow with pending state
- [ ] Transaction history from blockchain events
- [ ] Toast notifications
- [ ] Pull-to-refresh on mobile
- [ ] Multiple vault strategies
- [ ] APY calculations from historical data
