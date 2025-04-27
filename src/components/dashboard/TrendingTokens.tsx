import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TrendingToken {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
}

export function TrendingTokens() {
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingTokens = async () => {
      try {
        const response = await fetch('/api/token/trending');
        const data = await response.json();
        setTokens(data);
      } catch (error) {
        console.error('Error fetching trending tokens:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTokens();
  }, []);

  if (loading) {
    return <div>Loading trending tokens...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📈 Trending Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>Volume</TableHead>
              <TableHead>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.symbol}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{token.symbol}</span>
                    <span className="text-muted-foreground">{token.name}</span>
                  </div>
                </TableCell>
                <TableCell>${token.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={token.priceChange24h >= 0 ? 'success' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {token.priceChange24h >= 0 ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    {Math.abs(token.priceChange24h).toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell>${token.volume24h.toLocaleString()}</TableCell>
                <TableCell>${token.marketCap.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 