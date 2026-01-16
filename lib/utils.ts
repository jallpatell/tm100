export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatBalance(balance: string, decimals: number = 2): string {
  const num = parseFloat(balance);
  if (num === 0) return '0.00';
  if (num < 0.01) return '< 0.01';
  return num.toFixed(decimals);
}
