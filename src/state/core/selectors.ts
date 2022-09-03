import BN from 'bn.js';
import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { formatBNToString } from '../../utils';
import {
  CartPair,
  MarketInfo,
  OrderType,
  Pair,
  CartOrder,
  Nft,
  MarketOrder,
} from './types';
import { Dictionary } from 'lodash';
import { CartState } from './reducers/cartReducer';
import { calcNextSpotPrice, convertCartPairToMarketPair } from './helpers';
import { RequestStatus } from '../../utils/state';

export const selectAllMarkets = createSelector(
  (store: any) => (store?.core?.markets?.data as MarketInfo[]) || [],
  identity,
);

export const selectAllMarketsLoading = createSelector(
  (store: any) => (store?.core?.markets?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);

export const selectCertainMarket = createSelector(
  (store: any) => (store?.core?.market?.data as MarketInfo) || null,
  identity<MarketInfo | null>,
);

export const selectCertainMarketLoading = createSelector(
  (store: any) => (store?.core?.market?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);

export const selectCartState = createSelector(
  (store: any) => (store?.core?.cart as CartState) || {},
  identity<CartState>,
);

export const selectCartPairs = createSelector(
  selectCartState,
  (cart: CartState) => (cart?.pairs as Dictionary<CartPair>) || {},
);

export const selectCartFinishedOrdersMints = createSelector(
  selectCartState,
  (cart: CartState) => (cart?.finishedOrdersMints as string[]) || [],
);

export const selectCartPendingOrders = createSelector(
  selectCartState,
  (cart: CartState) => {
    const { pendingOrders, finishedOrdersMints } = cart;
    const filteredPendingOrders = Object.fromEntries(
      Object.entries(pendingOrders).map(([pairPubkey, orders]) => [
        pairPubkey,
        orders.filter(({ mint }) => !finishedOrdersMints.includes(mint)),
      ]),
    );

    return (filteredPendingOrders as Dictionary<CartOrder[]>) || {};
  },
);

const selectRawMarketPairs = createSelector(
  (store: any) => (store?.core?.marketPairs?.data as Pair[]) || [],
  identity<Pair[]>,
);

export const selectMarketPairs = createSelector(
  [selectCartPairs, selectRawMarketPairs],
  (cartPairs, rawMarketPairs): Pair[] => {
    return rawMarketPairs.map((rawPair) => {
      const cartPair = cartPairs[rawPair.pairPubkey];
      return cartPair ? convertCartPairToMarketPair(cartPair) : rawPair;
    });
  },
);

export const selectMarketPairsLoading = createSelector(
  (store: any) => (store?.core?.marketPairs?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);

export const selectPoolsPageTableInfo = createSelector(
  [selectCertainMarket, selectRawMarketPairs],
  (marketInfo, pairs) =>
    pairs.map((pair) => {
      return {
        pairPubkey: pair?.pairPubkey,
        ownerPublicKey: pair?.assetReceiver,
        collectionName: marketInfo?.collectionName || 'Untitled Collection',
        collectionImage: marketInfo?.collectionImage || '',
        type: pair?.type,
        fundsSolOrTokenBalance: formatBNToString(
          new BN(pair?.fundsSolOrTokenBalance || '0'),
        ),
        nftsCount: pair?.nftsCount,
        currentPrice: pair?.spotPrice,
        bondingCurve: pair?.bondingCurve,
        delta: formatBNToString(new BN(pair?.delta)),
      };
    }),
);

export const selectMarketInfoAndPairs = createSelector(
  [selectCertainMarket, selectMarketPairs],
  (marketInfo, pairs) => {
    return {
      marketInfo,
      pairs,
    };
  },
);

export const selectAllBuyOrdersForMarket = createSelector(
  [selectMarketPairs, selectCartPairs, selectCartPendingOrders],
  (marketPairs, cartPairs, cartOrders) => {
    const buyOrders = marketPairs
      .reduce((orders: MarketOrder[], pair) => {
        const selectedPairOrders: MarketOrder[] =
          cartOrders[pair.pairPubkey]
            ?.filter(({ type }) => type === OrderType.BUY)
            ?.map((order) => ({
              ...order,
              selected: true,
            })) || [];

        const cartPair = cartPairs[pair.pairPubkey];

        const freePairOrders: MarketOrder[] =
          pair?.sellOrders?.map((sellOrder) => ({
            ...sellOrder,
            type: OrderType.BUY,
            targetPairPukey: pair.pairPubkey,
            price: calcNextSpotPrice(cartPair || pair, OrderType.BUY),
            selected: false,
          })) || [];

        return [...orders, ...selectedPairOrders, ...freePairOrders];
      }, [])
      .sort(
        (a: MarketOrder, b: MarketOrder) =>
          a.price - b.price || a?.name?.localeCompare(b?.name),
      ) as MarketOrder[];

    return buyOrders;
  },
);

export const selectAllWalletNfts = createSelector(
  (store: any) => (store?.core?.walletNfts?.data as Nft[]) || [],
  identity<Nft[]>,
);

export const selectWalletPairs = createSelector(
  (store: any) => (store?.core?.walletPairs?.data as Pair[]) || [],
  identity<Pair[]>,
);

export const selectWalletPair =
  createSelector(
    [selectWalletPairs, (_, pairPubkey: string) => pairPubkey],
    (pairs, pairPubkey) =>
      pairs.find((pair) => pairPubkey === pair.pairPubkey) as Pair,
  ) || {};

export const selectMarketWalletNfts = createSelector(
  (store: any) => (store?.core?.marketWalletNfts?.data as Nft[]) || [],
  identity<Nft[]>,
);

export const selectMarketWalletNftsLoading = createSelector(
  (store: any) =>
    (store?.core?.marketWalletNfts?.status as RequestStatus) || '',
  (status: RequestStatus) => status === RequestStatus.PENDING,
);

export const selectAllSellOrdersForMarket = createSelector(
  [
    selectMarketPairs,
    selectCartPendingOrders,
    selectCartFinishedOrdersMints,
    selectMarketWalletNfts,
    (_, marketPublicKey: string) => marketPublicKey,
  ],
  (
    marketPairs,
    cartOrders,
    cartFinishedOrdersMints,
    marketWalletNfts,
    marketPublicKey,
  ) => {
    const pairs = marketPairs
      .filter(({ type }) => type !== 'nftForToken')
      .filter(({ buyOrdersAmount }) => buyOrdersAmount > 0)
      .sort((a, b) => a.spotPrice - b.spotPrice);

    const bestPair = pairs.at(-1);

    const cartSellOrders: MarketOrder[] = Object.values(cartOrders)
      .flat()
      .filter(({ type }) => type === OrderType.SELL)
      .map((order) => ({ ...order, selected: true }))
      .filter(({ market }) => market === marketPublicKey);

    const sellOrders: MarketOrder[] =
      marketWalletNfts
        .filter(
          ({ mint }) =>
            !cartSellOrders.find(({ mint: cartMint }) => cartMint === mint),
        )
        .map((nft) => {
          return {
            ...nft,
            type: OrderType.SELL,
            targetPairPukey:
              bestPair?.pairPubkey || '11111111111111111111111111111111',
            price: bestPair?.spotPrice || -1,
            selected: false,
          };
        })
        .filter(({ mint }) => !cartFinishedOrdersMints.includes(mint)) || [];

    return [...cartSellOrders, ...sellOrders].sort(
      (a: MarketOrder, b: MarketOrder) =>
        b.price - a.price || a?.name?.localeCompare(b?.name),
    ) as MarketOrder[];
  },
);

export const selectCartItems = createSelector(
  selectCartPendingOrders,
  (pendingOrders): { buy: CartOrder[]; sell: CartOrder[] } => {
    const allOrders = Object.values(pendingOrders).flat();
    return {
      buy: allOrders
        .filter(({ type }) => type === OrderType.BUY)
        .sort((a: CartOrder, b: CartOrder) => a.price - b.price) as CartOrder[],
      sell: allOrders.filter(({ type }) => type === OrderType.SELL),
    };
  },
);
