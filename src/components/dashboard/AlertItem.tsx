// src/components/dashboard/AlertItem.tsx
import React from 'react';
import { Alert, Severity } from '@/store/alertsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils'; // Import cn utility

interface AlertItemProps {
    alert: Alert;
}

const getSeverityBadgeVariant = (severity: Severity): 'destructive' | 'secondary' | 'outline' | 'default' => {
    switch (severity) {
        case 'Critical': return 'destructive';
        case 'High': return 'secondary'; // You might want a custom 'warning' variant
        case 'Medium': return 'outline';
        case 'Low': return 'default'; // Or a less prominent variant
        default: return 'default';
    }
};

// Helper function to format time ago
function timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000; // years
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000; // months
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400; // days
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600; // hours
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60; // minutes
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}


const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
    return (
        <Card className="mb-4 break-inside-avoid"> {/* break-inside-avoid helps with multi-column layouts */}
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

                <p className="text-xs text-muted-foreground">
                    {timeAgo(alert.timestamp)}
                </p>
            </CardContent>
        </Card>
    );
};

export default AlertItem;