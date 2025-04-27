import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchAccountInfo } from '@/lib/solscan';

interface WalletProfile {
  address: string;
  balance: number;
  riskScore: number;
  suspiciousActivities: {
    type: string;
    count: number;
    lastSeen: number;
  }[];
  associatedTokens: {
    address: string;
    symbol: string;
    amount: number;
  }[];
}

export function SuspiciousWalletProfile() {
  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const fetchWalletProfile = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await fetchAccountInfo(address);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching wallet profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔍 Suspicious Wallet Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={fetchWalletProfile}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {loading ? (
          <div>Loading wallet profile...</div>
        ) : profile ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-mono text-sm break-all">{profile.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance</p>
                <p className="font-medium">{profile.balance.toLocaleString()} SOL</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Risk Score</p>
              <p className={`text-2xl font-bold ${getRiskColor(profile.riskScore)}`}>
                {profile.riskScore}
              </p>
            </div>
            
            {profile.suspiciousActivities.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Suspicious Activities</p>
                <div className="space-y-2">
                  {profile.suspiciousActivities.map((activity) => (
                    <div key={activity.type} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Last seen: {new Date(activity.lastSeen * 1000).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="destructive">{activity.count} occurrences</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {profile.associatedTokens.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Associated Tokens</p>
                <div className="space-y-2">
                  {profile.associatedTokens.map((token) => (
                    <div key={token.address} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{token.symbol}</p>
                        <p className="text-sm text-muted-foreground break-all">{token.address}</p>
                      </div>
                      <p className="font-medium">{token.amount.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Enter a wallet address to view its profile
          </div>
        )}
      </CardContent>
    </Card>
  );
} 