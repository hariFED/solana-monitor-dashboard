import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { fetchLatestTransactions, fetchTransactionInfo } from '@/lib/solscan';

interface Transaction {
  signature: string;
  blockTime: number;
  slot: number;
  status: 'success' | 'error';
  fee: number;
  postBalance: number;
  preBalance: number;
}

interface TransactionDetail extends Transaction {
  parsedInstruction?: {
    program: string;
    type: string;
    params: { [key: string]: unknown };
  }[];
  tokenTransfers?: {
    source: string;
    destination: string;
    amount: number;
    token: string;
    symbol: string;
  }[];
}

export function TransactionMonitor() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSignature, setSearchSignature] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionDetail | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await fetchLatestTransactions(10);
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const fetchTransactionDetails = async (signature: string) => {
    try {
      setLoading(true);
      const data = await fetchTransactionInfo(signature);
      if (data) {
        const txDetail: TransactionDetail = {
          signature: data.signature,
          blockTime: data.blockTime,
          slot: data.slot,
          status: data.status?.ok ? 'success' : 'error',
          fee: data.fee,
          postBalance: data.postBalance,
          preBalance: data.preBalance,
          parsedInstruction: data.parsedInstruction,
          tokenTransfers: data.tokenTransfers,
        };
        setSelectedTransaction(txDetail);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>📝 Transaction Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by transaction signature"
            value={searchSignature}
            onChange={(e) => setSearchSignature(e.target.value)}
          />
          <Button onClick={() => fetchTransactionDetails(searchSignature)}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {selectedTransaction ? (
          <div className="space-y-4 mb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Transaction Details</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTransaction(null)}
              >
                Back to List
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Signature</p>
                <p className="font-mono text-sm break-all">{selectedTransaction.signature}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{selectedTransaction.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Slot</p>
                <p className="font-medium">{selectedTransaction.slot}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium">
                  {new Date(selectedTransaction.blockTime * 1000).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fee</p>
                <p className="font-medium">{selectedTransaction.fee} SOL</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Balance Change</p>
                <p className="font-medium">
                  {selectedTransaction.postBalance - selectedTransaction.preBalance} SOL
                </p>
              </div>
            </div>

            {selectedTransaction.parsedInstruction && (
              <div>
                <p className="text-sm text-muted-foreground">Instructions</p>
                <div className="space-y-2">
                  {selectedTransaction.parsedInstruction.map((instruction, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{instruction.program}</p>
                        <p className="text-sm text-muted-foreground">{instruction.type}</p>
                      </div>
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(instruction.params, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTransaction.tokenTransfers && selectedTransaction.tokenTransfers.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground">Token Transfers</p>
                <div className="space-y-2">
                  {selectedTransaction.tokenTransfers.map((transfer, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{transfer.symbol}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <p className="font-mono">{transfer.source.slice(0, 4)}...{transfer.source.slice(-4)}</p>
                          <span>→</span>
                          <p className="font-mono">{transfer.destination.slice(0, 4)}...{transfer.destination.slice(-4)}</p>
                        </div>
                      </div>
                      <p className="font-medium">{transfer.amount.toLocaleString()} {transfer.symbol}</p>
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
                <TableHead>Signature</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Fee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.signature}>
                  <TableCell className="font-mono text-sm">
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => fetchTransactionDetails(tx.signature)}
                    >
                      {tx.signature.slice(0, 8)}...{tx.signature.slice(-8)}
                    </Button>
                  </TableCell>
                  <TableCell>{tx.status}</TableCell>
                  <TableCell>{tx.slot}</TableCell>
                  <TableCell>
                    {new Date(tx.blockTime * 1000).toLocaleString()}
                  </TableCell>
                  <TableCell>{tx.fee} SOL</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
} 