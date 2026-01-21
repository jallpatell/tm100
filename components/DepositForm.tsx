'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { VAULT_ABI } from '@/lib/contracts';
import { sepolia } from 'wagmi/chains';
import confetti from 'canvas-confetti';
import { useETHBalance } from '@/hooks/useETHBalance';

interface DepositFormProps {
  vaultAddress: `0x${string}`;
  vaultName: string;
}

export function DepositForm({ vaultAddress, vaultName }: DepositFormProps) {
  const { address } = useAccount();
  const { balance: ethBalance } = useETHBalance();
  const [amount, setAmount] = useState('');
  const [estimatedShares, setEstimatedShares] = useState('0');
  
  const etherscanUrl = `https://sepolia.etherscan.io/address/${vaultAddress}`;
  
  const { writeContract: deposit, data: depositHash, error: depositError, isPending: isDepositing, reset: resetDeposit } = useWriteContract();
  
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  useEffect(() => {
    if (amount && Number(amount) > 0) {
      setEstimatedShares(amount);
    } else {
      setEstimatedShares('0');
    }
  }, [amount]);

  useEffect(() => {
    if (isDepositSuccess) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Show success toast
      (window as any).showToast?.('success', `Successfully deposited ${amount} ETH!`);
      
      // Add to recent activity
      if (depositHash) {
        (window as any).addActivity?.({
          type: 'deposit',
          amount,
          vault: vaultName,
          hash: depositHash
        });
      }
      
      setTimeout(() => {
        setAmount('');
        resetDeposit();
      }, 5000);
    }
  }, [isDepositSuccess, resetDeposit, amount, vaultName, depositHash]);

  const setPercentage = (percent: number) => {
    const balanceNum = parseFloat(ethBalance);
    const newAmount = (balanceNum * percent / 100).toFixed(6);
    setAmount(newAmount);
  };

  const handleDeposit = async () => {
    try {
      console.log('🔵 Starting ETH deposit...', {
        vaultAddress,
        amount,
        chainId: sepolia.id
      });
      
      (window as any).showToast?.('info', 'Transaction submitted to wallet...');
      
      if (navigator.vibrate) navigator.vibrate(50);
      resetDeposit();
      
      deposit({
        address: vaultAddress,
        abi: VAULT_ABI,
        functionName: 'deposit',
        value: parseUnits(amount, 18),
        chainId: sepolia.id,
        gas: 200000n,
      });
    } catch (error) {
      console.error('Deposit error:', error);
      (window as any).showToast?.('error', 'Transaction failed. Please try again.');
    }
  };

  const getErrorMessage = (error: Error | null) => {
    if (!error) return null;
    const message = error.message;
    
    console.error('Transaction Error:', message);
    
    if (message.includes('User rejected') || message.includes('User denied')) return 'You rejected the transaction';
    if (message.includes('insufficient funds')) return 'Insufficient funds for gas';
    if (message.includes('exceeds balance')) return 'Amount exceeds your balance';
    if (message.includes('reverted')) return 'Transaction reverted - check contract exists';
    if (message.includes('network')) return 'Network error - check you\'re on Sepolia';
    if (message.includes('CALL_EXCEPTION')) return 'Contract call failed - contract may not exist';
    return `Transaction failed: ${message.slice(0, 100)}`;
  };

  const errorMessage = getErrorMessage(depositError);

  if (!address) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-8 text-center shadow-xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-800/80">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Connect your wallet to deposit
        </p>
      </div>
    );
  }

  // Check if vault is deployed
  if (vaultAddress === '0x0000000000000000000000000000000000000000') {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-8 text-center shadow-xl backdrop-blur-xl dark:border-red-800 dark:bg-red-900/20">
        <div className="mb-4 text-4xl">⚠️</div>
        <h3 className="mb-2 text-xl font-bold text-red-900 dark:text-red-300">
          Vault Not Deployed
        </h3>
        <p className="mb-4 text-sm text-red-600 dark:text-red-400">
          You need to deploy the SimpleVault contract first.
        </p>
        <p className="text-xs text-red-500 dark:text-red-500">
          See DEPLOY_NOW.md for instructions
        </p>
      </div>
    );
  }

  if (isDepositSuccess && depositHash) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white/80 p-8 text-center shadow-xl backdrop-blur-xl dark:border-gray-800 dark:bg-gray-800/80">
        <div className="mb-4 text-5xl">🎉</div>
        <h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Deposit Successful!
        </h3>
        <p className="mb-4 text-gray-500 dark:text-gray-400">
          Your funds have been deposited to {vaultName}
        </p>
        <a
          href={`https://sepolia.etherscan.io/tx/${depositHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#0D76FE] hover:text-[#0D76FE]/80 dark:text-[#0D76FE] dark:hover:text-[#0D76FE]/80"
        >
          View transaction ↗
        </a>
      </div>
    );
  }

  return (
    <div className="backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-102 duration-500 delay-100 rounded-3xl p-6 bg-black/20 border-b border-white/10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-white bg-clip-text text-transparent">
          Deposit to {vaultName}
        </h2>
        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-blue-400 hover:text-blue-300"
        >
          Contract ↗
        </a>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-300">
            Amount (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full rounded-xl border-2 border-white/20 bg-white/10 px-4 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all focus:border-blue-400 focus:outline-none placeholder-gray-400"
            disabled={isDepositing || isDepositConfirming}
          />
          <p className="mt-2 text-xs font-medium text-gray-300">
            Available: {ethBalance} ETH
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => setPercentage(percent)}
              className="rounded-xl border-2 border-white/20 bg-white/10 px-3 py-2 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-blue-400 hover:bg-blue-500/20 active:scale-95"
              disabled={isDepositing || isDepositConfirming}
            >
              {percent === 100 ? 'MAX' : `${percent}%`}
            </button>
          ))}
        </div>

        {amount && Number(amount) > 0 && (
          <div className="rounded-xl bg-gray-50/80 p-4 backdrop-blur-sm dark:bg-gray-900/80">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">Estimated Shares</span>
              <span className="font-bold text-gray-900 dark:text-white">
                {estimatedShares}
              </span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-xl bg-red-50/80 p-4 shadow-md backdrop-blur-sm dark:bg-red-900/20">
            <p className="text-sm font-bold text-red-800 dark:text-red-200">{errorMessage}</p>
            <p className="mt-1 text-xs text-red-600 dark:text-red-300">Check browser console for details</p>
          </div>
        )}

        {/* Debug Info */}
        {process.env.NODE_ENV === 'development' && (
          <details className="rounded-xl bg-gray-100 p-3 text-xs dark:bg-gray-900">
            <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">Debug Info</summary>
            <div className="mt-2 space-y-1 text-gray-600 dark:text-gray-400">
              <div>Vault: {vaultAddress}</div>
              <div>ETH Balance: {ethBalance} ETH</div>
              <div>Chain: Sepolia ({sepolia.id})</div>
            </div>
          </details>
        )}



        {isDepositConfirming && depositHash && (
          <div className="rounded-xl bg-blue-500/20 border border-blue-400/30 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 rounded-full bg-blue-400 animate-pulse"></div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-white mb-2">
                Processing Transaction...
              </p>
              <p className="text-sm text-gray-300 mb-4">
                Please wait while your deposit is being confirmed on the blockchain
              </p>
              <a
                href={`https://sepolia.etherscan.io/tx/${depositHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View on Etherscan
              </a>
            </div>
          </div>
        )}

        <div>
          <button
            onClick={handleDeposit}
            disabled={!amount || isDepositing || isDepositConfirming || Number(amount) <= 0}
            className="w-full rounded-xl bg-[#0D76FE] px-4 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#0D76FE]/90 hover:shadow-xl active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDepositing || isDepositConfirming ? 'Depositing...' : 'Deposit ETH'}
          </button>
        </div>


      </div>
    </div>
  );
}
