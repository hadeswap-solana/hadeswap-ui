import BN from 'bn.js';
import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { formatBNToString } from '../../utils';
import { BuyOrder, SellOrder } from './actions/cartActions';
import { MarketInfo, Pair, WalletNft } from './types';
import { Dictionary } from 'lodash';

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
        const sellOrdersCart: SellOrder[] =
          sellOrdersInCartByPair[pair.pairPubkey] || [];
        const sellOrdersCartMints = sellOrdersCart.map(({ mint }) => mint);

        const sellOrders = (pair?.sellOrders || []).map((order) => {
          const isSelectedIndex = sellOrdersCartMints.indexOf(order.mint);

          const price =
            isSelectedIndex !== -1
              ? pair.spotPrice + pair.delta * (isSelectedIndex + 1)
              : pair.spotPrice + pair.delta * (sellOrdersCartMints.length + 1);

          return {
            mint: order.mint,
            imageUrl: order.imageUrl,
            name: order.name,
            traits: order.traits || null,
            assetReceiver: pair.assetReceiver,
            spotPrice: pair.spotPrice,
            price,
            bondingCurve: pair.bondingCurve,
            pair: pair.pairPubkey,
            selected: isSelectedIndex !== -1,
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

export const selectBuyOrdersInCartByPair = createSelector(
  (store: any) => (store?.core?.cart?.sell as Dictionary<BuyOrder[]>) || {},
  identity<Dictionary<BuyOrder[]>>,
);

const getBestOfferFromNftPairs = (
  pairs: Pair[] = [],
  buyItemsInCartByPair: Dictionary<BuyOrder[]> = {},
) =>
  pairs
    .filter((pair) => pair.type !== 'nftForToken')
    .map((pair) => {
      const pairCartOccurrences =
        buyItemsInCartByPair?.[pair.pairPubkey]?.length || 0;

      if (pairCartOccurrences < pair.buyOrdersAmount) {
        return {
          ...pair,
          price: pair.spotPrice + pair.delta * pairCartOccurrences,
        };
      }

      return null;
    })
    .filter((v) => v)
    .sort((a, b) => a.price - b.price)[0] || null;

export const selectAllBuyOrdersForMarket = createSelector(
  [selectMarketWalletNfts, selectBuyOrdersInCartByPair],
  (walletNfts, buyItemsInCartByPair) => {
    return walletNfts
      .reduce((orders: BuyOrder[], nft) => {
        const selectedOrder = Object.values(buyItemsInCartByPair)
          .flat()
          .find((order) => order.mint === nft.mint);

        if (selectedOrder) {
          return [...orders, selectedOrder];
        }

        const bestOffer = getBestOfferFromNftPairs(
          nft?.pairs,
          buyItemsInCartByPair,
        );

        const buyOrder = {
          mint: nft.mint,
          imageUrl: nft.imageUrl,
          name: nft.name,
          traits: nft.traits || null,
          assetReceiver: bestOffer.assetReceiver,
          spotPrice: bestOffer.spotPrice,
          price: bestOffer.price,
          bondingCurve: bestOffer.bondingCurve,
          pair: bestOffer.pairPubkey,
          selected: false,
          nftValidationAdapter: nft.nftValidationAdapter,
          type: bestOffer.type,
        };

        return [...orders, buyOrder];
      }, [])
      .sort((a, b) => a.price - b.price) as BuyOrder[];
  },
);
