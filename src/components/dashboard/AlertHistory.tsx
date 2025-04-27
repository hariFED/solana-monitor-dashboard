import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatAddress } from '@/lib/solscan';
import { WalletAlert } from '@/lib/notifications';

interface AlertHistoryProps {
  alerts: WalletAlert[];
}

export function AlertHistory({ alerts }: AlertHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>⚠️ Alert History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert, index) => (
              <TableRow key={`${alert.walletAddress}-${alert.timestamp}-${index}`}>
                <TableCell>
                  {new Date(alert.timestamp * 1000).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono">
                  {formatAddress(alert.walletAddress)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{alert.type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-[300px] truncate">
                    {alert.details.description}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      alert.severity === 'high'
                        ? 'destructive'
                        : alert.severity === 'medium'
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {alert.severity}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
            {alerts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No alerts yet. They will appear here when sleeping giants wake up.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 