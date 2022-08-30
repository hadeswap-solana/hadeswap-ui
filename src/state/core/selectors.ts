import BN from 'bn.js';
import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { formatBNToString } from '../../utils';
import { BuyOrder, SellOrder } from './actions/cartActions';
import { MarketInfo, Pair, WalletNft } from './types';
import { Dictionary, maxBy } from 'lodash';
import { CartState } from './reducers/cartReducer';
import {
  calcSellOrderPrice,
  getPairsNextPriceBuy,
  getSellOrderCartPairIndex,
  getSellOrdersMintsByPair,
} from './helpers';

export const selectAllMarkets = createSelector(
  (store: any) => (store?.core?.markets?.data as MarketInfo[]) || [],
  identity,
);

export const selectCertainMarket = createSelector(
  (store: any) => (store?.core?.market?.data as MarketInfo) || null,
  identity<MarketInfo | null>,
);

export const selectMarketPairs = createSelector(
  (store: any) => (store?.core?.marketPairs?.data as Pair[]) || [],
  identity<Pair[]>,
);

export const selectPoolsPageTableInfo = createSelector(
  [selectCertainMarket, selectMarketPairs],
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

const selectSellOrdersInCartByPair = createSelector(
  (store: any) => (store?.core?.cart?.buy as Dictionary<SellOrder[]>) || {},
  identity<Dictionary<SellOrder[]>>,
);

export const selectAllSellOrdersForMarket = createSelector(
  [selectMarketPairs, selectSellOrdersInCartByPair],
  (pairs, sellOrdersInCartByPair) => {
    return pairs
      .reduce((orders: SellOrder[], pair) => {
        const sellOrdersCartMints = getSellOrdersMintsByPair(
          pair.pairPubkey,
          sellOrdersInCartByPair,
        );

        const sellOrders = (pair?.sellOrders || []).map((order) => {
          const orderCartPairIndex = getSellOrderCartPairIndex(
            order.mint,
            sellOrdersCartMints,
          );

          const price = calcSellOrderPrice(
            orderCartPairIndex,
            sellOrdersCartMints,
            pair,
          );

          return {
            mint: order.mint,
            imageUrl: order.imageUrl,
            name: order.name,
            traits: order.traits || null,
            assetReceiver: pair.assetReceiver,
            spotPrice: pair.spotPrice,
            delta: pair.delta,
            price,
            bondingCurve: pair.bondingCurve,
            pair: pair.pairPubkey,
            selected: orderCartPairIndex !== -1,
            vaultNftTokenAccount: order.vaultNftTokenAccount,
            nftPairBox: order.nftPairBox,
            type: pair.type,
          };
        });

        return [...orders, ...sellOrders];
      }, [])
      .sort(
        (a, b) => a.price - b.price || Number(b.selected) - Number(a.selected),
      ) as SellOrder[];
  },
);

export const selectAllWalletNfts = createSelector(
  (store: any) => (store?.core?.walletNfts?.data as WalletNft[]) || [],
  identity<WalletNft[]>,
);

export const selectMarketWalletNfts = createSelector(
  selectAllWalletNfts,
  (_: never, marketPubkey: string) => marketPubkey,
  (walletNfts, marketPubkey: string) =>
    walletNfts.filter((nft) => nft.market === marketPubkey),
);

export const selectBuyOrdersByMarketInCart = createSelector(
  (store: any) => (store?.core?.cart?.sell as Dictionary<BuyOrder[]>) || {},
  identity<Dictionary<BuyOrder[]>>,
);

export const selectAllBuyOrdersForMarket = createSelector(
  [selectMarketWalletNfts, selectMarketPairs, selectBuyOrdersByMarketInCart],
  (marketWalletNfts, marketPairs, buyOrdersByMarket) => {
    const marketPubkey = marketWalletNfts[0]?.market;

    if (!marketPubkey || !marketPairs?.length) return [];

    const occupiedBuyOrders = buyOrdersByMarket[marketPubkey];

    const pairsNextPriceBuy = getPairsNextPriceBuy(
      marketPairs,
      occupiedBuyOrders,
    );

    const [bestAvailablePairPubkey, bestAvailablePrice] = maxBy(
      Object.entries(pairsNextPriceBuy),
      (entry) => entry?.[1],
    );

    return marketWalletNfts
      .reduce((orders: BuyOrder[], nft) => {
        const orderSelected: BuyOrder = Object.values(buyOrdersByMarket)
          .flat()
          .find((order) => order.mint === nft.mint);

        if (orderSelected) {
          return [...orders, orderSelected];
        }

        const bestPair = nft.pairs.find(
          ({ pairPubkey }) => bestAvailablePairPubkey === pairPubkey,
        );

        const order = {
          mint: nft.mint,
          imageUrl: nft.imageUrl,
          name: nft.name,
          traits: nft.traits || null,
          assetReceiver: bestPair.assetReceiver,
          spotPrice: bestPair.spotPrice,
          price: bestAvailablePrice,
          bondingCurve: bestPair.bondingCurve,
          pair: bestPair.pairPubkey,
          selected: false,
          nftValidationAdapter: nft.nftValidationAdapter,
          type: bestPair.type,
          market: marketPubkey,
        };

        return [...orders, order];
      }, [])
      .sort((a, b) => b.price - a.price) as BuyOrder[];
  },
);

export const selectCartItems = createSelector(
  (store: any) => store?.core?.cart as CartState,
  (cartState) => {
    return {
      sell: Object.values(cartState.sell).flat(),
      buy: Object.values(cartState.buy).flat(),
    };
  },
);
