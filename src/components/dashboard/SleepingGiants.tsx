import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Bell, AlertTriangle } from 'lucide-react';
import {
  detectGiantWallets,
  monitorWalletMovements,
  type DetectedWallet,
} from '@/lib/walletDetector';
import { formatAddress, formatNumber } from '@/lib/solscan';
import { WalletAlert } from '@/lib/notifications';

interface SleepingGiantsProps {
  onAlert: (alert: WalletAlert) => void;
  minBalance?: number;
  minInactiveDays?: number;
}

export function SleepingGiants({
  onAlert,
  minBalance = 10000,
  minInactiveDays = 180,
}: SleepingGiantsProps) {
  const [giants, setGiants] = useState<DetectedWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [trackedWallets, setTrackedWallets] = useState<Set<string>>(new Set());
  const [lastKnownTransactions, setLastKnownTransactions] = useState<Record<string, string>>({});

  // Function to add a custom wallet
  const addWallet = async (address: string) => {
    try {
      setLoading(true);
      const detected = await detectGiantWallets([address], minBalance, minInactiveDays);
      
      if (detected.length === 0) {
        alert('Wallet does not meet criteria for a Sleeping Giant');
        return;
      }

      setGiants(prev => [...prev, ...detected]);
      setTrackedWallets(prev => new Set([...prev, address]));
    } catch (error) {
      console.error('Error adding wallet:', error);
      alert('Failed to add wallet. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle wallet tracking
  const toggleTracking = (address: string) => {
    setTrackedWallets(prev => {
      const next = new Set(prev);
      if (next.has(address)) {
        next.delete(address);
      } else {
        next.add(address);
      }
      return next;
    });
  };

  // Monitor tracked wallets for movements
  useEffect(() => {
    if (trackedWallets.size === 0) return;

    const monitorInterval = setInterval(async () => {
      for (const address of trackedWallets) {
        try {
          const { hasNewActivity, newTransactions } = await monitorWalletMovements(
            address,
            lastKnownTransactions[address]
          );

          if (hasNewActivity && newTransactions.length > 0) {
            // Update last known transaction
            setLastKnownTransactions(prev => ({
              ...prev,
              [address]: newTransactions[0].signature,
            }));

            // Find the giant's details
            const giant = giants.find(g => g.address === address);
            if (!giant) continue;

            // Create and emit alert
            const alert: WalletAlert = {
              walletAddress: address,
              type: 'transfer', // You might want to detect the actual type
              details: {
                amount: newTransactions[0].amount,
                token: 'SOL', // You might want to detect the actual token
                destination: newTransactions[0].destination,
                description: `Sleeping giant with ${formatNumber(giant.solBalance)} SOL has awakened!`,
              },
              severity: giant.solBalance > 100000 ? 'high' : giant.solBalance > 50000 ? 'medium' : 'low',
              timestamp: Math.floor(Date.now() / 1000),
            };

            onAlert(alert);
          }
        } catch (error) {
          console.error(`Error monitoring wallet ${address}:`, error);
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(monitorInterval);
  }, [trackedWallets, lastKnownTransactions, giants, onAlert]);

  // Auto-detect giants periodically
  useEffect(() => {
    const detectInterval = setInterval(async () => {
      try {
        setLoading(true);
        // TODO: Implement a way to get a list of potential addresses to check
        const potentialAddresses: string[] = [];
        const detected = await detectGiantWallets(potentialAddresses, minBalance, minInactiveDays);
        
        setGiants(prev => {
          const existing = new Set(prev.map(g => g.address));
          const newGiants = detected.filter(g => !existing.has(g.address));
          return [...prev, ...newGiants];
        });
      } catch (error) {
        console.error('Error detecting giants:', error);
      } finally {
        setLoading(false);
      }
    }, 3600000); // Check every hour

    return () => clearInterval(detectInterval);
  }, [minBalance, minInactiveDays]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>💤 Sleeping Giants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter wallet address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
          <Button onClick={() => addWallet(searchAddress)} disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            Add Wallet
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>SOL Balance</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead>Inactive Days</TableHead>
              <TableHead>Token Holdings</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {giants.map((giant) => (
              <TableRow key={giant.address}>
                <TableCell className="font-mono">
                  {formatAddress(giant.address)}
                </TableCell>
                <TableCell>{formatNumber(giant.solBalance)} SOL</TableCell>
                <TableCell>
                  {new Date(giant.lastActivity * 1000).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant={giant.inactiveDays > 365 ? 'destructive' : 'default'}>
                    {giant.inactiveDays} days
                  </Badge>
                </TableCell>
                <TableCell>{giant.tokenHoldings.length} tokens</TableCell>
                <TableCell>${formatNumber(giant.totalValue)}</TableCell>
                <TableCell>
                  <Button
                    variant={trackedWallets.has(giant.address) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleTracking(giant.address)}
                  >
                    {trackedWallets.has(giant.address) ? (
                      <>
                        <Bell className="h-4 w-4 mr-2" />
                        Tracking
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Track
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {giants.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  {loading ? 'Detecting sleeping giants...' : 'No sleeping giants found yet.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 