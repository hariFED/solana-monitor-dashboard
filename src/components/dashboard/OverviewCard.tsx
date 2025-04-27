import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

const OverviewCard = () => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Monitored Volume / Activity
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$1,234,567</div>
                <p className="text-xs text-muted-foreground">
                    +5.2% from last 24 hours
                </p>
                <div className="mt-4 h-20 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
                    Chart Placeholder
                </div>
            </CardContent>
        </Card>
    );
};

export default OverviewCard;
