'use client';

import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useUSDCBalance } from '@/hooks/useUSDCBalance';
import { useETHBalance } from '@/hooks/useETHBalance';
import { truncateAddress, formatBalance } from '@/lib/utils';

export function WalletInfo() {
  const { address, isConnected } = useAccount();
  const { balance: usdcBalance, isLoading: usdcLoading } = useUSDCBalance();
  const { balance: ethBalance, isLoading: ethLoading } = useETHBalance();

  if (!isConnected || !address) {
    return <ConnectButton />;
  }

  return <ConnectButton />;
}
