'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { fetchLatestTransactions } from '@/lib/solscan';


interface Transaction {
    signature: string;
    blockTime: number;
    slot: number;
}

const LatestTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const txs = await fetchLatestTransactions(5);
                setTransactions(txs || []);
            } catch (error) {
                console.error('Error fetching transactions', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
                <CardTitle>Latest Transactions</CardTitle>
                <CardDescription>Live feed from Solana network</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {loading ? (
                    <p className="text-sm text-muted-foreground">Loading...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No transactions found.</p>
                ) : (
                    <ul className="space-y-2">
                        {transactions.map((tx) => (
                            <li key={tx.signature} className="text-xs break-all border-b pb-1">
                                <strong>Slot:</strong> {tx.slot}<br />
                                <strong>Signature:</strong> {tx.signature}<br />
                                <strong>Time:</strong> {new Date(tx.blockTime * 1000).toLocaleString()}
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
};

export default LatestTransactions;
