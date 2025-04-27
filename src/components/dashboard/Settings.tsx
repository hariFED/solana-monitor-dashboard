import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { NotificationConfig, DEFAULT_CONFIG } from '@/lib/notifications';

interface SettingsProps {
  settings: NotificationConfig;
  onSettingsChange: (settings: NotificationConfig) => void;
}

export function Settings({ settings = DEFAULT_CONFIG, onSettingsChange }: SettingsProps) {
  const [localSettings, setLocalSettings] = useState<NotificationConfig>(settings);

  const handleChange = (key: keyof NotificationConfig, value: NotificationConfig[keyof NotificationConfig]) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(localSettings));
    onSettingsChange(localSettings);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you want to receive alerts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailEnabled">Email Notifications</Label>
              <Switch
                id="emailEnabled"
                checked={localSettings.emailEnabled}
                onCheckedChange={(checked) => handleChange('emailEnabled', checked)}
              />
            </div>
            {localSettings.emailEnabled && (
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={localSettings.emailAddress || ''}
                  onChange={(e) => handleChange('emailAddress', e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            )}
          </div>

          {/* Telegram Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="telegramEnabled">Telegram Notifications</Label>
              <Switch
                id="telegramEnabled"
                checked={localSettings.telegramEnabled}
                onCheckedChange={(checked) => handleChange('telegramEnabled', checked)}
              />
            </div>
            {localSettings.telegramEnabled && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="telegramBotToken">Bot Token</Label>
                  <Input
                    id="telegramBotToken"
                    type="password"
                    value={localSettings.telegramBotToken || ''}
                    onChange={(e) => handleChange('telegramBotToken', e.target.value)}
                    placeholder="Enter your Telegram bot token"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telegramChatId">Chat ID</Label>
                  <Input
                    id="telegramChatId"
                    value={localSettings.telegramChatId || ''}
                    onChange={(e) => handleChange('telegramChatId', e.target.value)}
                    placeholder="Enter your Telegram chat ID"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Discord Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="discordEnabled">Discord Notifications</Label>
              <Switch
                id="discordEnabled"
                checked={localSettings.discordEnabled}
                onCheckedChange={(checked) => handleChange('discordEnabled', checked)}
              />
            </div>
            {localSettings.discordEnabled && (
              <div className="space-y-2">
                <Label htmlFor="discordWebhook">Webhook URL</Label>
                <Input
                  id="discordWebhook"
                  type="password"
                  value={localSettings.discordWebhook || ''}
                  onChange={(e) => handleChange('discordWebhook', e.target.value)}
                  placeholder="Enter your Discord webhook URL"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
          <CardDescription>Configure alert thresholds</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="minBalance">Minimum Balance Alert (SOL)</Label>
            <Input
              id="minBalance"
              type="number"
              value={localSettings.minBalance}
              onChange={(e) => handleChange('minBalance', parseFloat(e.target.value))}
              placeholder="Enter minimum balance threshold"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inactivityThreshold">Inactivity Alert (days)</Label>
            <Input
              id="inactivityThreshold"
              type="number"
              value={localSettings.inactivityThreshold}
              onChange={(e) => handleChange('inactivityThreshold', parseInt(e.target.value))}
              placeholder="Enter inactivity threshold in days"
            />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full">
        Save Settings
      </Button>
    </div>
  );
} 