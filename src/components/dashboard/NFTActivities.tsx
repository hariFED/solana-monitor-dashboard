import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NFTActivity {
  type: string;
  collection: string;
  price: number;
  from: string;
  to: string;
  timestamp: string;
  signature: string;
}

interface NFTNews {
  title: string;
  description: string;
  source: string;
  url: string;
  timestamp: string;
  collection?: string;
}

export function NFTActivities() {
  const [activities, setActivities] = useState<NFTActivity[]>([]);
  const [news, setNews] = useState<NFTNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [activitiesRes, newsRes] = await Promise.all([
          fetch('/api/nft/activities'),
          fetch('/api/nft/news')
        ]);
        
        const activitiesData = await activitiesRes.json();
        const newsData = await newsRes.json();
        
        setActivities(activitiesData);
        setNews(newsData);
      } catch (error) {
        console.error('Error fetching NFT data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading NFT data...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>🖼️ NFT Activities & News</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activities">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activities">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge variant="outline">{activity.type}</Badge>
                    </TableCell>
                    <TableCell>{activity.collection}</TableCell>
                    <TableCell>{activity.price.toLocaleString()} SOL</TableCell>
                    <TableCell className="font-mono text-sm">{activity.from}</TableCell>
                    <TableCell className="font-mono text-sm">{activity.to}</TableCell>
                    <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="news">
            <div className="space-y-4">
              {news.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <Badge variant="outline">{item.source}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{item.description}</p>
                  {item.collection && (
                    <Badge variant="secondary" className="mb-2">
                      {item.collection}
                    </Badge>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 