import React from 'react';
import { Alert, Severity } from '@/store/alertsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AlertItemProps {
    alert: Alert;
}

const getSeverityBadgeVariant = (severity: Severity): 'destructive' | 'secondary' | 'outline' | 'default' => {
    switch (severity) {
        case 'Critical': return 'destructive';
        case 'High': return 'secondary';
        case 'Medium': return 'outline';
        case 'Low': return 'default';
        default: return 'default';
    }
};

function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
    return (
        <Card className="mb-4 break-inside-avoid">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-1">
                    <CardTitle className="text-base font-semibold">{alert.title}</CardTitle>
                    <Badge variant={getSeverityBadgeVariant(alert.severity)}>{alert.severity}</Badge>
                </div>
                <CardDescription className="text-sm">{alert.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-2">
                    <Progress value={alert.intensity} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{alert.intensity}% Intensity</p>
                </div>
                <p className="text-xs text-muted-foreground">{timeAgo(alert.timestamp)}</p>
            </CardContent>
        </Card>
    );
};

export default AlertItem;
