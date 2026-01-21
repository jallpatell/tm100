'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

interface Activity {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: string;
  vault: string;
  hash: string;
  timestamp: number;
}

export function RecentActivity() {
  const { address } = useAccount();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!address) return;
    
    // Load activities from localStorage
    const stored = localStorage.getItem(`activities_${address}`);
    if (stored) {
      setActivities(JSON.parse(stored));
    }
  }, [address]);

  // Expose addActivity globally
  useEffect(() => {
    (window as any).addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
      const newActivity: Activity = {
        ...activity,
        id: Date.now().toString(),
        timestamp: Date.now()
      };
      
      setActivities(prev => {
        const updated = [newActivity, ...prev].slice(0, 5); // Keep only 5 recent
        if (address) {
          localStorage.setItem(`activities_${address}`, JSON.stringify(updated));
        }
        return updated;
      });
    };
  }, [address]);

  if (!address || activities.length === 0) return null;

  return (
    <div className="mb-8 backdrop-blur-lg hover:backdrop-blur-md border-1 transition hover:scale-102 duration-500 delay-100 rounded-3xl p-6 bg-black/20 border-b border-white/10">
      <h2 className="mb-4 text-2xl font-bold bg-white bg-clip-text text-transparent">
        Recent Activity
      </h2>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between rounded-xl bg-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${activity.type === 'deposit' ? 'bg-green-400' : 'bg-red-400'}`} />
              <div>
                <p className="text-white font-medium">
                  {activity.type === 'deposit' ? 'Deposited' : 'Withdrew'} {activity.amount} ETH
                </p>
                <p className="text-gray-300 text-sm">{activity.vault}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-xs">
                {new Date(activity.timestamp).toLocaleDateString()}
              </p>
              <a
                href={`https://sepolia.etherscan.io/tx/${activity.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-xs"
              >
                View →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}