import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { fetchAccountTokenHoldings } from '@/lib/solscan';

interface TokenHolding {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
  };
  tokenPrice: number;
  tokenValue: number;
}

export function AccountTokenHoldings() {
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const fetchTokenHoldings = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await fetchAccountTokenHoldings(address);
      setHoldings(response.data);
    } catch (error) {
      console.error('Error fetching token holdings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>👤 Account Token Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter wallet address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={fetchTokenHoldings}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {loading ? (
          <div>Loading token holdings...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.tokenAddress}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span>{holding.tokenSymbol}</span>
                      <span className="text-muted-foreground">{holding.tokenName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{holding.tokenAmount.uiAmount.toLocaleString()}</TableCell>
                  <TableCell>${holding.tokenPrice.toFixed(4)}</TableCell>
                  <TableCell>${holding.tokenValue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 