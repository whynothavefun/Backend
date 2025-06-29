export interface Token {
  tokenId: string;
  userWallet: string;
  tokenName: string;
  tokenSymbol: string;
  artwork: string;
  createdAt: Date;
}

export enum TokenSortField {
  MCAP = 'mcap',
  VOLUME_24H = 'volume_24h',
  PRICE_CHANGE_24H = 'price_change_24h',
  CREATED_AT = 'createdAt',
}

export interface ThreadMessageWithReplies {
  threadMessageId: string;
  tokenId: string;
  userWallet: string;
  message: string;
  parentId: string | null;
  replies: ThreadMessageWithReplies[];
  likeCount: number;
  createdAt: Date;
}
