import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { fetchLatestTransactions, fetchBlockInfo } from '@/lib/solscan';

interface Transaction {
  signature: string;
  blockTime: number;
  slot: number;
  status: 'success' | 'error';
  fee: number;
  postBalance: number;
  preBalance: number;
}

interface BlockTransaction {
  signature: string;
  slot: number;
  err: null | { [key: string]: unknown };
  fee: number;
  success: boolean;
}

interface Block {
  slot: number;
  blockTime: number;
  transactions: number;
  leader: string;
  parentSlot: number;
}

interface BlockDetail extends Block {
  signatures: string[];
  rewards: {
    pubkey: string;
    lamports: number;
  }[];
}

interface BlockInfoResponse {
  blockTime: number;
  transactions: BlockTransaction[];
  leader: string;
  parentSlot: number;
  rewards: {
    pubkey: string;
    lamports: number;
  }[];
}

export function BlockMonitor() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSlot, setSearchSlot] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<BlockDetail | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const transactions = await fetchLatestTransactions(10);
        // Convert transactions to blocks by grouping by slot
        const blocksMap = new Map<number, Block>();
        transactions.forEach((tx: Transaction) => {
          if (!blocksMap.has(tx.slot)) {
            blocksMap.set(tx.slot, {
              slot: tx.slot,
              blockTime: tx.blockTime,
              transactions: 1,
              leader: '', // This would need to be fetched from a different endpoint
              parentSlot: tx.slot - 1,
            });
          } else {
            const block = blocksMap.get(tx.slot)!;
            block.transactions += 1;
          }
        });
        setBlocks(Array.from(blocksMap.values()));
      } catch (error) {
        console.error('Error fetching blocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const fetchBlockDetails = async (slot: string) => {
    try {
      setLoading(true);
      const data = await fetchBlockInfo(slot) as BlockInfoResponse;
      if (data) {
        const blockDetail: BlockDetail = {
          slot: parseInt(slot),
          blockTime: data.blockTime || 0,
          transactions: data.transactions?.length || 0,
          leader: data.leader || '',
          parentSlot: data.parentSlot || parseInt(slot) - 1,
          signatures: data.transactions?.map((tx: BlockTransaction) => tx.signature) || [],
          rewards: data.rewards || [],
        };
        setSelectedBlock(blockDetail);
      }
    } catch (error) {
      console.error('Error fetching block details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading blocks...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🔗 Block Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by block slot"
            value={searchSlot}
            onChange={(e) => setSearchSlot(e.target.value)}
          />
          <Button onClick={() => fetchBlockDetails(searchSlot)}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {selectedBlock ? (
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Block Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBlock(null)}
              >
                Back to List
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Slot</p>
                <p className="font-medium">{selectedBlock.slot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">
                  {selectedBlock.blockTime ? new Date(selectedBlock.blockTime * 1000).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="font-medium">{selectedBlock.transactions}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Leader</p>
                <p className="font-mono text-sm break-all">{selectedBlock.leader || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Parent Slot</p>
                <p className="font-medium">{selectedBlock.parentSlot}</p>
              </div>
            </div>

            {selectedBlock.signatures.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Signatures</p>
                <div className="space-y-2">
                  {selectedBlock.signatures.map((signature) => (
                    <p key={signature} className="font-mono text-sm break-all">
                      {signature}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {selectedBlock.rewards?.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Rewards</p>
                <div className="space-y-2">
                  {selectedBlock.rewards.map((reward) => (
                    <div key={reward.pubkey} className="flex justify-between">
                      <p className="font-mono text-sm break-all">{reward.pubkey}</p>
                      <p className="font-medium">{reward.lamports / 1e9} SOL</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slot</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Parent Slot</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.map((block) => (
                <TableRow key={block.slot}>
                  <TableCell>
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => fetchBlockDetails(block.slot.toString())}
                    >
                      {block.slot}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {block.blockTime ? new Date(block.blockTime * 1000).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell>{block.transactions}</TableCell>
                  <TableCell className="font-mono text-sm break-all">
                    {block.leader || 'N/A'}
                  </TableCell>
                  <TableCell>{block.parentSlot}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 