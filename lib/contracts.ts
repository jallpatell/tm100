export const VAULTS = [
  {
    id: 'stable',
    name: 'Stable Vault',
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9' as const, // Sepolia WETH for testing
    risk: 'Low' as const,
    apyMin: 3,
    apyMax: 5,
    description: 'Testing with WETH contract (has deposit function)',
  },
  {
    id: 'growth',
    name: 'Growth Vault',
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9' as const,
    risk: 'Medium' as const,
    apyMin: 8,
    apyMax: 12,
    description: 'Testing with WETH contract (has deposit function)',
  },
  {
    id: 'turbo',
    name: 'Turbo Vault',
    address: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9' as const,
    risk: 'High' as const,
    apyMin: 15,
    apyMax: 25,
    description: 'Testing with WETH contract (has deposit function)',
  },
] as const;

export type RiskLevel = 'Low' | 'Medium' | 'High';

export const VAULT_ADDRESS = VAULTS[0].address;

// USDC address on Sepolia
export const USDC_ADDRESS = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238' as const;

// WETH addresses by chain
export const WETH_ADDRESSES = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // Mainnet
  11155111: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9', // Sepolia
} as const;

export const VAULT_ABI = [
  // WETH ABI for testing - has working deposit function
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
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
    name: 'totalSupply',
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
