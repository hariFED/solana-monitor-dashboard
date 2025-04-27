"use client"

import React, { useState, useCallback } from 'react';
import { SleepingGiants } from '@/components/dashboard/SleepingGiants';
import { AlertHistory } from '@/components/dashboard/AlertHistory';
import { Settings } from '@/components/dashboard/Settings';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletAlert, sendNotification } from '@/lib/notifications';

export default function DashboardPage() {
  // State for alerts
  const [alerts, setAlerts] = useState<WalletAlert[]>([]);

  // State for settings
  const [minBalance, setMinBalance] = useState(10000); // 10K SOL
  const [minInactiveDays, setMinInactiveDays] = useState(180); // 6 months
  const [notificationSettings, setNotificationSettings] = useState({
    telegram: false,
    discord: false,
    email: false,
  });

  // Handler for notification settings updates
  const handleNotificationUpdate = (key: 'telegram' | 'discord' | 'email', value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handler for new alerts
  const handleAlert = useCallback(async (alert: WalletAlert) => {
    // Add alert to history
    setAlerts(prev => [alert, ...prev]);

    // Send notifications based on settings
    try {
      await sendNotification(alert, {
        emailEnabled: notificationSettings.email,
        emailAddress: process.env.NEXT_PUBLIC_ALERT_EMAIL,
        telegramEnabled: notificationSettings.telegram,
        telegramBotToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
        telegramChatId: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID,
        discordEnabled: notificationSettings.discord,
        discordWebhook: process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL,
        minBalance: minBalance,
        inactivityThreshold: minInactiveDays,
      });
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  }, [notificationSettings, minBalance, minInactiveDays]);

  return (
    <main className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Sleeping Giants Wallet Tracker</h1>
        <p className="text-muted-foreground">
          Monitor inactive but heavily loaded Solana wallets and get alerts when they wake up.
        </p>
      </div>

      <Tabs defaultValue="tracker" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tracker">💤 Tracker</TabsTrigger>
          <TabsTrigger value="alerts">⚠️ Alerts</TabsTrigger>
          <TabsTrigger value="settings">⚙️ Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <SleepingGiants
            onAlert={handleAlert}
            minBalance={minBalance}
            minInactiveDays={minInactiveDays}
          />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertHistory alerts={alerts} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Settings
            minBalance={minBalance}
            setMinBalance={setMinBalance}
            minInactiveDays={minInactiveDays}
            setMinInactiveDays={setMinInactiveDays}
            notificationSettings={notificationSettings}
            onUpdateNotifications={handleNotificationUpdate}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}