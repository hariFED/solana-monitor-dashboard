import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  dex: string;
}

export function MarketMonitor() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/market/list');
        const data = await response.json();
        setMarkets(data);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarkets();
  }, []);

  if (loading) {
    return <div>Loading market data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 Market Monitor</CardTitle>
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
              <TableHead>Liquidity</TableHead>
              <TableHead>DEX</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markets.map((market) => (
              <TableRow key={market.symbol}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{market.symbol}</span>
                    <span className="text-muted-foreground">{market.name}</span>
                  </div>
                </TableCell>
                <TableCell>${market.price.toFixed(4)}</TableCell>
                <TableCell>
                  <Badge
                    variant={market.priceChange24h >= 0 ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {market.priceChange24h >= 0 ? (
                      <ArrowUp className="h-4 w-4" />
                    ) : (
                      <ArrowDown className="h-4 w-4" />
                    )}
                    {Math.abs(market.priceChange24h).toFixed(2)}%
                  </Badge>
                </TableCell>
                <TableCell>${market.volume24h.toLocaleString()}</TableCell>
                <TableCell>${market.marketCap.toLocaleString()}</TableCell>
                <TableCell>${market.liquidity.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{market.dex}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 