import { fetchAccountInfo, fetchAccountTransactions, fetchAccountTokenHoldings, AccountTransaction } from './solscan';
import { Connection, PublicKey } from '@solana/web3.js';

export interface DetectedWallet {
  address: string;
  solBalance: number;
  lastActivity: number;
  inactiveDays: number;
  tokenHoldings: {
    symbol: string;
    amount: number;
    usdValue: number;
  }[];
  totalValue: number;
}

// Function to check if a wallet meets our criteria
export const isGiantWallet = (
  solBalance: number,
  totalValue: number,
  inactiveDays: number,
  minBalance: number = 10000,
  minInactiveDays: number = 180
): boolean => {
  return (solBalance >= minBalance || totalValue >= minBalance * 20) && inactiveDays >= minInactiveDays;
};

// Function to calculate inactivity period
export const calculateInactivityDays = (lastActivityTimestamp: number): number => {
  const now = Date.now() / 1000;
  return Math.floor((now - lastActivityTimestamp) / (24 * 60 * 60));
};

// Function to get top wallets by balance
export const getTopWalletsByBalance = async (
  connection: Connection,
  limit: number = 1000
): Promise<string[]> => {
  try {
    // Get the current epoch's stake accounts
    const stakeAccounts = await connection.getProgramAccounts(
      new PublicKey('Stake11111111111111111111111111111111111111'),
      {
        filters: [
          {
            dataSize: 200, // Size of a stake account
          },
        ],
      }
    );

    // Get the current epoch's vote accounts
    const voteAccounts = await connection.getProgramAccounts(
      new PublicKey('Vote111111111111111111111111111111111111111'),
      {
        filters: [
          {
            dataSize: 3732, // Size of a vote account
          },
        ],
      }
    );

    // Combine all accounts and sort by balance
    const allAccounts = [...stakeAccounts, ...voteAccounts];
    const sortedAccounts = allAccounts.sort((a, b) => {
      const balanceA = a.account.lamports;
      const balanceB = b.account.lamports;
      return balanceB - balanceA;
    });

    // Return the top wallets
    return sortedAccounts.slice(0, limit).map(account => account.pubkey.toString());
  } catch (error) {
    console.error('Error getting top wallets:', error);
    return [];
  }
};

// Function to detect giant wallets from the entire blockchain
export const detectGiantWallets = async (
  addresses: string[] = [],
  minBalance: number = 10000,
  minInactiveDays: number = 180
): Promise<DetectedWallet[]> => {
  const giants: DetectedWallet[] = [];
  
  // If no addresses provided, get top wallets from the blockchain
  const addressesToCheck = addresses.length > 0 
    ? addresses 
    : await getTopWalletsByBalance(new Connection('https://api.mainnet-beta.solana.com'));

  for (const address of addressesToCheck) {
    try {
      // Fetch wallet info in parallel
      const [accountInfo, transactions, holdings] = await Promise.all([
        fetchAccountInfo(address),
        fetchAccountTransactions(address, undefined, 1),
        fetchAccountTokenHoldings(address),
      ]);

      const lastActivity = transactions[0]?.blockTime || 0;
      const inactiveDays = calculateInactivityDays(lastActivity);
      const solBalance = accountInfo.solBalance || 0;

      // Calculate total value including tokens
      const tokenHoldings = holdings.map(token => ({
        symbol: token.tokenSymbol,
        amount: token.tokenAmount.uiAmount,
        usdValue: token.usdValue || 0,
      }));

      const totalValue = tokenHoldings.reduce((sum, token) => sum + token.usdValue, 0) + solBalance * 0; // TODO: Add SOL price

      // Check if wallet meets criteria
      if (isGiantWallet(solBalance, totalValue, inactiveDays, minBalance, minInactiveDays)) {
        giants.push({
          address,
          solBalance,
          lastActivity,
          inactiveDays,
          tokenHoldings,
          totalValue,
        });
      }
    } catch (error) {
      console.error(`Error processing wallet ${address}:`, error);
    }
  }

  // Sort giants by balance and return top 10
  return giants
    .sort((a, b) => b.solBalance - a.solBalance)
    .slice(0, 10);
};

// Function to monitor wallet movements
export const monitorWalletMovements = async (
  address: string,
  lastKnownTransaction?: string
): Promise<{
  hasNewActivity: boolean;
  newTransactions: AccountTransaction[];
}> => {
  try {
    const transactions = await fetchAccountTransactions(address, undefined, 5);
    
    if (!transactions.length) return { hasNewActivity: false, newTransactions: [] };

    // If we don't have a last known transaction, just return false but save the latest
    if (!lastKnownTransaction) {
      return { hasNewActivity: false, newTransactions: [] };
    }

    // Find index of last known transaction
    const lastKnownIndex = transactions.findIndex(tx => tx.signature === lastKnownTransaction);

    // If we can't find the last known transaction, something has happened
    if (lastKnownIndex === -1) {
      return { hasNewActivity: true, newTransactions: transactions };
    }

    // Return any transactions that happened after our last known one
    const newTransactions = transactions.slice(0, lastKnownIndex);
    return {
      hasNewActivity: newTransactions.length > 0,
      newTransactions,
    };
  } catch (error) {
    console.error(`Error monitoring wallet ${address}:`, error);
    return { hasNewActivity: false, newTransactions: [] };
  }
}; 