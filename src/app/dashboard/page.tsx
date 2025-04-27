"use client"

import { TrendingTokens } from '@/components/dashboard/TrendingTokens';
import { AccountTokenHoldings } from '@/components/dashboard/AccountTokenHoldings';
import { TokenMetadataView } from '@/components/dashboard/TokenMetadataView';
import { SuspiciousWalletProfile } from '@/components/dashboard/SuspiciousWalletProfile';
import { NFTActivities } from '@/components/dashboard/NFTActivities';
import { TransactionMonitor } from '@/components/dashboard/TransactionMonitor';
import { BlockMonitor } from '@/components/dashboard/BlockMonitor';
import { MarketMonitor } from '@/components/dashboard/MarketMonitor';
import { UsageMonitor } from '@/components/dashboard/UsageMonitor';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendingTokens />
        <AccountTokenHoldings />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TokenMetadataView />
        <SuspiciousWalletProfile />
      </div>

      <NFTActivities />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionMonitor />
        <BlockMonitor />
      </div>

      <MarketMonitor />
      <UsageMonitor />
    </div>
  );
} 