export interface WalletAlert {
  id: string;
  timestamp: Date;
  walletAddress: string;
  type: 'balance' | 'activity' | 'transaction';
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface NotificationConfig {
  // Email settings
  emailEnabled: boolean;
  emailAddress?: string;

  // Telegram settings
  telegramEnabled: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;

  // Discord settings
  discordEnabled: boolean;
  discordWebhook?: string;

  // Alert thresholds
  minBalance: number;  // in SOL
  inactivityThreshold: number;  // in days
}

export const DEFAULT_CONFIG: NotificationConfig = {
  emailEnabled: false,
  telegramEnabled: false,
  discordEnabled: false,
  minBalance: 1000,
  inactivityThreshold: 30,
};

export function loadSettings(): NotificationConfig {
  const savedSettings = localStorage.getItem('notificationSettings');
  if (savedSettings) {
    try {
      return JSON.parse(savedSettings);
    } catch (e) {
      console.error('Failed to parse saved settings:', e);
    }
  }
  return DEFAULT_CONFIG;
}

export async function sendNotification(alert: WalletAlert, config: NotificationConfig) {
  const message = formatAlertMessage(alert);

  if (config.emailEnabled && config.emailAddress) {
    await sendEmailNotification(config.emailAddress, message);
  }

  if (config.telegramEnabled && config.telegramBotToken && config.telegramChatId) {
    await sendTelegramNotification(config.telegramBotToken, config.telegramChatId, message);
  }

  if (config.discordEnabled && config.discordWebhook) {
    await sendDiscordNotification(config.discordWebhook, message);
  }
}

function formatAlertMessage(alert: WalletAlert): string {
  const timestamp = alert.timestamp.toLocaleString();
  const emoji = alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
  
  return `${emoji} ${alert.type.toUpperCase()} Alert\n` +
    `Time: ${timestamp}\n` +
    `Wallet: ${alert.walletAddress}\n` +
    `Details: ${alert.details}\n` +
    `Severity: ${alert.severity}`;
}

async function sendEmailNotification(email: string, message: string) {
  // TODO: Implement email notification using your preferred email service
  console.log('Sending email to:', email, message);
}

async function sendTelegramNotification(botToken: string, chatId: string, message: string) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

async function sendDiscordNotification(webhookUrl: string, message: string) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Failed to send Discord notification:', error);
  }
} 