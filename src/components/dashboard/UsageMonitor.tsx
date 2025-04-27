import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface UsageStats {
  totalRequests: number;
  requestsToday: number;
  dailyLimit: number;
  endpoints: {
    path: string;
    requests: number;
    successRate: number;
    avgResponseTime: number;
  }[];
}

export function UsageMonitor() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/monitor/usage');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching usage statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageStats();
  }, []);

  if (loading) {
    return <div>Loading usage statistics...</div>;
  }

  if (!stats) {
    return <div>No usage statistics available</div>;
  }

  const usagePercentage = (stats.requestsToday / stats.dailyLimit) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>📊 API Usage Monitor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Requests Today</p>
            <p className="text-2xl font-bold">{stats.requestsToday.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Daily Limit</p>
            <p className="text-2xl font-bold">{stats.dailyLimit.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">Daily Usage</p>
            <p className="text-sm font-medium">{Math.round(usagePercentage)}%</p>
          </div>
          <Progress value={usagePercentage} className="h-2" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Endpoint</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Avg Response Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.endpoints.map((endpoint) => (
              <TableRow key={endpoint.path}>
                <TableCell className="font-mono text-sm">{endpoint.path}</TableCell>
                <TableCell>{endpoint.requests.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      endpoint.successRate >= 95
                        ? 'default'
                        : endpoint.successRate >= 80
                        ? 'secondary'
                        : 'destructive'
                    }
                  >
                    {endpoint.successRate.toFixed(1)}%
                  </Badge>
                </TableCell>
                <TableCell>{endpoint.avgResponseTime.toFixed(2)}ms</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 