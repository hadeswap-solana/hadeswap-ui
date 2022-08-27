import { web3 } from '@project-serum/anchor';
import { createCustomAction } from 'typesafe-actions';

import { ServerError } from '../../../utils/state';
import { MarketInfo, MarketPair, Pair, WalletNft } from '../types';

export const fetchTypes = {
  FETCH_WALLET_NFTS: 'core/FETCH_WALLET_NFTS',
  FETCH_WALLET_NFTS__PENDING: 'core/FETCH_WALLET_NFTS__PENDING',
  FETCH_WALLET_NFTS__FULFILLED: 'core/FETCH_WALLET_NFTS__FULFILLED',
  FETCH_WALLET_NFTS__FAILED: 'core/FETCH_WALLET_NFTS__FAILED',

  FETCH_WALLET_PAIRS: 'core/FETCH_WALLET_PAIRS',
  FETCH_WALLET_PAIRS__PENDING: 'core/FETCH_WALLET_PAIRS__PENDING',
  FETCH_WALLET_PAIRS__FULFILLED: 'core/FETCH_WALLET_PAIRS__FULFILLED',
  FETCH_WALLET_PAIRS__FAILED: 'core/FETCH_WALLET_PAIRS__FAILED',

  FETCH_ALL_MARKETS: 'core/FETCH_ALL__MARKETS',
  FETCH_ALL_MARKETS__PENDING: 'core/FETCH_ALL__MARKETS__PENDING',
  FETCH_ALL_MARKETS__FULFILLED: 'core/FETCH_ALL__MARKETS__FULFILLED',
  FETCH_ALL_MARKETS__FAILED: 'core/FETCH_ALL__MARKETS__FAILED',

  FETCH_MARKET: 'core/FETCH_MARKET',
  FETCH_MARKET__PENDING: 'core/FETCH_MARKET__PENDING',
  FETCH_MARKET__FULFILLED: 'core/FETCH_MARKET__FULFILLED',
  FETCH_MARKET__FAILED: 'core/FETCH_MARKET__FAILED',

  FETCH_PAIR: 'core/FETCH_PAIR',
  FETCH_PAIR__PENDING: 'core/FETCH_PAIR__PENDING',
  FETCH_PAIR__FULFILLED: 'core/FETCH_PAIR__FULFILLED',
  FETCH_PAIR__FAILED: 'core/FETCH_PAIR__FAILED',

  FETCH_MARKET_PAIRS: 'core/FETCH_MARKET_PAIRS',
  FETCH_MARKET_PAIRS__PENDING: 'core/FETCH_MARKET_PAIRS__PENDING',
  FETCH_MARKET_PAIRS__FULFILLED: 'core/FETCH_MARKET_PAIRS__FULFILLED',
  FETCH_MARKET_PAIRS__FAILED: 'core/FETCH_MARKET_PAIRS__FAILED',
};

export const fetchActions = {
  //? fetchWalletNfts
  fetchWalletNfts: createCustomAction(
    fetchTypes.FETCH_WALLET_NFTS,
    (walletAddress: web3.PublicKey) => ({ payload: walletAddress }),
  ),
  fetchWalletNftsPending: createCustomAction(
    fetchTypes.FETCH_WALLET_NFTS__PENDING,
    () => null,
  ),
  fetchWalletNftsFulfilled: createCustomAction(
    fetchTypes.FETCH_WALLET_NFTS__FULFILLED,
    (walletNfts: WalletNft[]) => ({ payload: walletNfts }),
  ),
  fetchWalletNftsFailed: createCustomAction(
    fetchTypes.FETCH_WALLET_NFTS__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),

  //? fetchWalletPairs
  fetchWalletPairs: createCustomAction(
    fetchTypes.FETCH_WALLET_PAIRS,
    (walletAddress: web3.PublicKey) => ({ payload: walletAddress }),
  ),
  fetchWalletPairsPending: createCustomAction(
    fetchTypes.FETCH_WALLET_PAIRS__PENDING,
    () => null,
  ),
  fetchWalletPairsPairsFulfilled: createCustomAction(
    fetchTypes.FETCH_WALLET_PAIRS__FULFILLED,
    (marketPairs: MarketPair[]) => ({ payload: marketPairs }),
  ),
  fetchWalletPairsFailed: createCustomAction(
    fetchTypes.FETCH_WALLET_PAIRS__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),

  //? fetchAllMarkets
  fetchAllMarkets: createCustomAction(fetchTypes.FETCH_ALL_MARKETS, () => null),
  fetchAllMarketsPending: createCustomAction(
    fetchTypes.FETCH_ALL_MARKETS__PENDING,
    () => null,
  ),
  fetchAllMarketsFulfilled: createCustomAction(
    fetchTypes.FETCH_ALL_MARKETS__FULFILLED,
    (markets: MarketInfo[]) => ({ payload: markets }),
  ),
  fetchAllMarketsFailed: createCustomAction(
    fetchTypes.FETCH_ALL_MARKETS__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),

  //? fetchMarket
  fetchMarket: createCustomAction(
    fetchTypes.FETCH_MARKET,
    (marketPubkey: string) => ({ payload: marketPubkey }),
  ),
  fetchMarketPending: createCustomAction(
    fetchTypes.FETCH_MARKET__PENDING,
    (marketPubkey: string) => ({ payload: marketPubkey }),
  ),
  fetchMarketFulfilled: createCustomAction(
    fetchTypes.FETCH_MARKET__FULFILLED,
    (market: MarketInfo) => ({ payload: market }),
  ),
  fetchMarketFailed: createCustomAction(
    fetchTypes.FETCH_MARKET__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),

  //? fetchPair
  fetchPair: createCustomAction(
    fetchTypes.FETCH_PAIR,
    (pairPubkey: web3.PublicKey) => ({ payload: pairPubkey }),
  ),
  fetchPairPending: createCustomAction(
    fetchTypes.FETCH_PAIR__PENDING,
    () => null,
  ),
  fetchPairFulfilled: createCustomAction(
    fetchTypes.FETCH_PAIR__FULFILLED,
    (pair: Pair) => ({ payload: pair }),
  ),
  fetchPairFailed: createCustomAction(
    fetchTypes.FETCH_PAIR__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),

  //? fetchMarketPairs
  fetchMarketPairs: createCustomAction(
    fetchTypes.FETCH_MARKET_PAIRS,
    (marketPubkey: web3.PublicKey) => ({ payload: marketPubkey }),
  ),
  fetchMarketPairsPending: createCustomAction(
    fetchTypes.FETCH_MARKET_PAIRS__PENDING,
    () => null,
  ),
  fetchMarketPairsFulfilled: createCustomAction(
    fetchTypes.FETCH_MARKET_PAIRS__FULFILLED,
    (pairs: Pair[]) => ({ payload: pairs }),
  ),
  fetchMarketPairsFailed: createCustomAction(
    fetchTypes.FETCH_MARKET_PAIRS__FAILED,
    (error: ServerError) => ({ payload: error }),
  ),
};
