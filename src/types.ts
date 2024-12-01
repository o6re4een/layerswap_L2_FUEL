export enum Chains {
  "ARBITRUM" = "ARBITRUM_MAINNET",
  "OPTIMISM" = "OPTIMISM_MAINNET",
  "BASE" = "BASE_MAINNET",
  "SCROLL" = "SCROLL_MAINNET",
}

export interface AutoAccount {
  privateKey: string;
  destinationAddress: string;
  sourceAddress: string;
}

export interface LayerSwapQuote {
  type: "manual_transfer";
  to_address: string;
  amount: number;
  order: number;
  amount_in_base_units: string;
  network: Network;
  token: Token;
  fee_token: Token;
  call_data: string | null;
}

export interface SwapData {
  to_address: string;
  amount: number;
  amount_in_base_units: string;
  chainId: string;
}

/**
 * Интерфейс для описания сети.
 */
interface Network {
  name: string;
  display_name: string;
  logo: string;
  chain_id: string;
  node_url: string;
  type: string;
  transaction_explorer_template: string;
  account_explorer_template: string;
  token: Token;
  metadata: Metadata;
  deposit_methods: string[];
}

/**
 * Интерфейс для описания токена.
 */
interface Token {
  symbol: string;
  display_asset: string;
  logo: string;
  contract: string | null;
  decimals: number;
  price_in_usd: number;
  precision: number;
  listing_date: string;
  source_rank: number;
  destination_rank: number;
}

/**
 * Интерфейс для описания метаданных сети.
 */
interface Metadata {
  listing_date: string;
  evm_multicall_contract: string;
}
