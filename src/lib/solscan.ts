const BASE_URL = "https://api.solscan.io";
const API_KEY = process.env.NEXT_PUBLIC_SOLSCAN_API_KEY;

const HEADERS: Record<string, string> = {
  "Accept": "application/json",
  ...(API_KEY ? { "Token": API_KEY } : {}),
};

export interface TokenHolding {
  tokenAddress: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
  };
  tokenName: string;
  tokenSymbol: string;
  tokenIcon: string;
  tokenPrice: number;
  usdValue: number;
}

export interface AccountTransaction {
  signature: string;
  blockTime: number;
  slot: number;
  fee: number;
  status: 'success' | 'error';
  lamport: number;
  signer: string[];
  includeSPLTransfer: boolean;
  changeType: 'inc' | 'dec' | 'none';
}

export interface AccountInfo {
  account: string;
  lamports: number;
  ownerProgram: string;
  type: string;
  rentEpoch: number;
  tokens?: TokenHolding[];
  solBalance?: number;
}

export const fetchLatestTransactions = async (limit = 5) => {
  const res = await fetch(`${BASE_URL}/transaction/last?limit=${limit}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error("Failed to fetch transactions");
  const data = await res.json();
  return data.data || [];
};

export const fetchTrendingTokens = async () => {
  const res = await fetch(`${BASE_URL}/token/trending`, { headers: HEADERS });
  if (!res.ok) throw new Error("Failed to fetch trending tokens");
  const data = await res.json();
  return data.data || [];
};

export const fetchTokenInfo = async (address: string) => {
  const res = await fetch(`${BASE_URL}/token/meta?token=${address}`, {
    headers: HEADERS,
  });
  if (!res.ok) throw new Error("Failed to fetch token info");
  const data = await res.json();
  return data;
};

export const fetchAccountTokenHoldings = async (accountAddress: string): Promise<TokenHolding[]> => {
  const res = await fetch(
    `${BASE_URL}/account/tokens?address=${accountAddress}`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error("Failed to fetch account token holdings");
  const data = await res.json();
  return data.tokens || [];
};

export const fetchAccountTransactions = async (
  accountAddress: string,
  before?: number,
  limit: number = 25
): Promise<AccountTransaction[]> => {
  const url = new URL(`${BASE_URL}/account/transactions`);
  url.searchParams.append("account", accountAddress);
  url.searchParams.append("limit", limit.toString());
  if (before) url.searchParams.append("before", before.toString());

  const res = await fetch(url.toString(), { headers: HEADERS });
  if (!res.ok) throw new Error("Failed to fetch account transactions");
  const data = await res.json();
  return data.data || [];
};

export const fetchAccountInfo = async (accountAddress: string): Promise<AccountInfo> => {
  const res = await fetch(
    `${BASE_URL}/account?address=${accountAddress}`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error("Failed to fetch account info");
  const data = await res.json();
  return {
    ...data,
    solBalance: data.lamports / 1e9, // Convert lamports to SOL
  };
};

export const fetchBlockInfo = async (slot: string) => {
  const res = await fetch(
    `${BASE_URL}/block/transactions?slot=${slot}`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error("Failed to fetch block info");
  const data = await res.json();
  return data;
};

export const fetchTransactionInfo = async (signature: string) => {
  const res = await fetch(
    `${BASE_URL}/transaction?tx=${signature}`,
    { headers: HEADERS }
  );
  if (!res.ok) throw new Error("Failed to fetch transaction info");
  const data = await res.json();
  return data;
};

export const calculateInactivityPeriod = (lastTransaction: number): number => {
  const now = Date.now() / 1000; // Convert to seconds
  return Math.floor((now - lastTransaction) / (24 * 60 * 60)); // Convert to days
};

export const isWalletDormant = (
  lastTransaction: number,
  thresholdDays: number = 180 // 6 months by default
): boolean => {
  const inactiveDays = calculateInactivityPeriod(lastTransaction);
  return inactiveDays >= thresholdDays;
};

export const calculatePotentialMarketImpact = (
  solBalance: number,
  solPrice: number = 0 // You'll need to fetch current SOL price
): string => {
  const usdValue = solBalance * solPrice;
  if (usdValue > 1_000_000) return "VERY HIGH";
  if (usdValue > 500_000) return "HIGH";
  if (usdValue > 100_000) return "MEDIUM";
  return "LOW";
};

// Helper function to format wallet addresses
export const formatAddress = (address: string): string => {
  if (!address) return "";
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

// Helper function to format large numbers
export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2);
};

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  dex: string;
}

export async function fetchMarketList(): Promise<MarketData[]> {
  try {
    const response = await fetch('/api/market/list');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching market data:', error);
    throw error;
  }
}
