'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { VAULT_ABI, ERC20_ABI, USDC_ADDRESSES } from '@/lib/contracts';
import { sepolia } from 'wagmi/chains';
import confetti from 'canvas-confetti';

interface DepositFormProps {
  vaultAddress: `0x${string}`;
  vaultName: string;
}

export function DepositForm({ vaultAddress, vaultName }: DepositFormProps) {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [estimatedShares, setEstimatedShares] = useState('0');
  
  const usdcAddress = USDC_ADDRESSES[sepolia.id];
  const etherscanUrl = `https://sepolia.etherscan.io/address/${vaultAddress}`;
  
  const { data: tokenBalance, refetch: refetchTokenBalance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 10000,
    },
    chainId: sepolia.id,
  });

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: usdcAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, vaultAddress] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
    chainId: sepolia.id,
  });
  
  const { writeContract: approve, data: approveHash, error: approveError, isPending: isApproving, reset: resetApprove } = useWriteContract();
  const { writeContract: deposit, data: depositHash, error: depositError, isPending: isDepositing, reset: resetDeposit } = useWriteContract();
  
  const { isLoading: isApproveConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  
  const { isLoading: isDepositConfirming, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositHash,
  });

  const amountBigInt = amount ? parseUnits(amount, 6) : 0n;
  const needsApproval = amountBigInt > (allowance || 0n);
  const balance = tokenBalance ? formatUnits(tokenBalance, 6) : '0';

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
      refetchTokenBalance();
      setTimeout(() => {
        setAmount('');
        resetDeposit();
      }, 5000);
    }
  }, [isDepositSuccess, resetDeposit, refetchTokenBalance]);

  useEffect(() => {
    if (isApproveSuccess) {
      refetchAllowance();
    }
  }, [isApproveSuccess, refetchAllowance]);

  const setPercentage = (percent: number) => {
    const balanceNum = parseFloat(balance);
    const newAmount = (balanceNum * percent / 100).toFixed(6);
    setAmount(newAmount);
  };

  const handleApprove = async () => {
    if (navigator.vibrate) navigator.vibrate(50);
    resetApprove();
    approve({
      address: usdcAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [vaultAddress, amountBigInt],
      chainId: sepolia.id,
    });
  };

  const handleDeposit = async () => {
    if (navigator.vibrate) navigator.vibrate(50);
    resetDeposit();
    deposit({
      address: vaultAddress,
      abi: VAULT_ABI,
      functionName: 'deposit',
      args: [amountBigInt],
      chainId: sepolia.id,
    });
  };

  const getErrorMessage = (error: Error | null) => {
    if (!error) return null;
    const message = error.message;
    if (message.includes('User rejected') || message.includes('User denied')) return 'You rejected the transaction';
    if (message.includes('insufficient funds')) return 'Insufficient funds for gas';
    if (message.includes('exceeds balance')) return 'Amount exceeds your balance';
    if (message.includes('reverted')) return 'Transaction reverted';
    return 'Transaction failed';
  };

  const currentError = approveError || depositError;
  const errorMessage = getErrorMessage(currentError);

  if (!address) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Connect your wallet to deposit
        </p>
      </div>
    );
  }

  if (isDepositSuccess && depositHash) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900 dark:bg-green-950">
        <div className="mb-4 text-5xl">🎉</div>
        <h3 className="mb-2 text-xl font-semibold text-green-900 dark:text-green-50">
          Deposit Successful!
        </h3>
        <p className="mb-4 text-green-700 dark:text-green-300">
          Your funds have been deposited to {vaultName}
        </p>
        <a
          href={`https://sepolia.etherscan.io/tx/${depositHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-green-800 hover:text-green-900 dark:text-green-200 dark:hover:text-green-100"
        >
          View transaction ↗
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Deposit to {vaultName}
        </h2>
        <a
          href={etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Contract ↗
        </a>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Amount (USDC)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-lg text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            disabled={isApproving || isDepositing || isApproveConfirming || isDepositConfirming}
          />
          <p className="mt-1 text-xs text-zinc-500">
            Available: {balance} USDC
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => setPercentage(percent)}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              disabled={isApproving || isDepositing || isApproveConfirming || isDepositConfirming}
            >
              {percent === 100 ? 'MAX' : `${percent}%`}
            </button>
          ))}
        </div>

        {amount && Number(amount) > 0 && (
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
            <div className="flex justify-between text-sm">
              <span className="text-blue-700 dark:text-blue-300">Estimated Shares</span>
              <span className="font-semibold text-blue-900 dark:text-blue-100">
                {estimatedShares}
              </span>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{errorMessage}</p>
          </div>
        )}

        {isApproveConfirming && approveHash && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Confirming approval...
              </p>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${approveHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              View transaction ↗
            </a>
          </div>
        )}

        {isDepositConfirming && depositHash && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
            <div className="mb-2 flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Confirming deposit...
              </p>
            </div>
            <a
              href={`https://sepolia.etherscan.io/tx/${depositHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200"
            >
              View transaction ↗
            </a>
          </div>
        )}

        <div>
          {needsApproval ? (
            <button
              onClick={handleApprove}
              disabled={!amount || isApproving || isApproveConfirming || Number(amount) <= 0}
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isApproving || isApproveConfirming ? 'Approving...' : 'Approve USDC'}
            </button>
          ) : (
            <button
              onClick={handleDeposit}
              disabled={!amount || isDepositing || isDepositConfirming || Number(amount) <= 0}
              className="w-full rounded-lg bg-zinc-900 px-4 py-3 font-semibold text-white transition-all hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isDepositing || isDepositConfirming ? 'Depositing...' : 'Deposit'}
            </button>
          )}
        </div>

        {needsApproval && amount && (
          <p className="text-center text-xs text-zinc-500">
            Step 1 of 2: Approve the vault to spend your USDC
          </p>
        )}
        {!needsApproval && amount && Number(amount) > 0 && (
          <p className="text-center text-xs text-zinc-500">
            Step 2 of 2: Confirm deposit transaction
          </p>
        )}
      </div>
    </div>
  );
}
