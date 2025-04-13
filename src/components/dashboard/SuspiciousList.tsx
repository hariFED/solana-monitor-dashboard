// src/components/dashboard/SuspiciousList.tsx
"use client"; // Needed because we use the Zustand hook

import React from 'react';
import { useAlertStore } from '@/store/alertsStore';
import AlertItem from './AlertItem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


const SuspiciousList = () => {
    const alerts = useAlertStore((state) => state.alerts);

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-3"> {/* Span across columns */}
            <CardHeader>
                <CardTitle>Suspicious Activity Alerts</CardTitle>
                <CardDescription>Recent potentially risky activities detected on the network.</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Responsive multi-column layout for alerts */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                    {alerts.length === 0 ? (
                        <p className="text-muted-foreground">No alerts found.</p>
                    ) : (
                        alerts.map((alert) => (
                            <AlertItem key={alert.id} alert={alert} />
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default SuspiciousList;