export type Transaction = {
  id: string;
  transactionType: 'buy' | 'sell';
  tokenId: string;
  tokenName: string;
  tokenAmount: number;
  hypeAmount: number;
  transactionHash: string;
  userWallet: string;
  createdAt: Date;
};
