import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { fetchTokenInfo } from '@/lib/solscan';

interface TokenMetadata {
  mint: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: number;
  description: string;
  website: string;
  social: {
    twitter?: string;
    discord?: string;
    telegram?: string;
  };
  tags: string[];
}

export function TokenMetadataView() {
  const [metadata, setMetadata] = useState<TokenMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState('');

  const fetchTokenMetadata = async () => {
    if (!mintAddress) return;
    
    try {
      setLoading(true);
      const data = await fetchTokenInfo(mintAddress);
      setMetadata(data);
    } catch (error) {
      console.error('Error fetching token metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>🧪 Token Metadata View</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Enter token mint address"
            value={mintAddress}
            onChange={(e) => setMintAddress(e.target.value)}
          />
          <Button onClick={fetchTokenMetadata}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        
        {loading ? (
          <div>Loading token metadata...</div>
        ) : metadata ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold">{metadata.name}</h3>
                <p className="text-muted-foreground">{metadata.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Mint Address</p>
                <p className="font-mono text-sm">{metadata.mint}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Decimals</p>
                <p>{metadata.decimals}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Supply</p>
                <p>{metadata.totalSupply.toLocaleString()}</p>
              </div>
            </div>

            {metadata.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p>{metadata.description}</p>
              </div>
            )}

            {metadata.website && (
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <a href={metadata.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {metadata.website}
                </a>
              </div>
            )}

            {metadata.social && Object.keys(metadata.social).length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Social Links</p>
                <div className="flex gap-2">
                  {metadata.social.twitter && (
                    <a href={metadata.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Twitter
                    </a>
                  )}
                  {metadata.social.discord && (
                    <a href={metadata.social.discord} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Discord
                    </a>
                  )}
                  {metadata.social.telegram && (
                    <a href={metadata.social.telegram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      Telegram
                    </a>
                  )}
                </div>
              </div>
            )}

            {metadata.tags && metadata.tags.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {metadata.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Enter a token mint address to view its metadata
          </div>
        )}
      </CardContent>
    </Card>
  );
} 