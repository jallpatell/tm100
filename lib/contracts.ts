export const VAULTS = [
  {
    id: 'stable',
    name: 'Stable Vault',
    address: '0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98' as const,
    risk: 'Low' as const,
    apyMin: 3,
    apyMax: 5,
    description: 'Conservative strategy with stable returns',
  },
  {
    id: 'growth',
    name: 'Growth Vault',
    address: '0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98' as const,
    risk: 'Medium' as const,
    apyMin: 8,
    apyMax: 12,
    description: 'Balanced risk-reward strategy',
  },
  {
    id: 'turbo',
    name: 'Turbo Vault',
    address: '0x41FF192bC04DC850bf361b2Ad7e2a4F4B97a9E98' as const,
    risk: 'High' as const,
    apyMin: 15,
    apyMax: 25,
    description: 'Aggressive strategy for maximum returns',
  },
] as const;

export type RiskLevel = 'Low' | 'Medium' | 'High';

export const VAULT_ADDRESS = VAULTS[0].address;

// USDC addresses by chain
export const USDC_ADDRESSES = {
  1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // Mainnet
  11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238', // Sepolia
} as const;

export const VAULT_ABI = [
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'asset',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
