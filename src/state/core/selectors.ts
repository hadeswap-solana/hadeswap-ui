import BN from 'bn.js';
import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { formatBNToString } from '../../utils';
import { MarketInfo, Pair, PairSellOrder, WalletNft } from './types';

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
          new BN(pair?.fundsSolOrTokenBalance),
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

interface PairSellOrderWithPrice extends PairSellOrder {
  price: string;
}

export const selectAllSellOrdersForMarket = createSelector(
  selectMarketPairs,
  (pairs) => {
    return pairs.reduce((orders: PairSellOrderWithPrice[], pair) => {
      const ordersWithPrice: PairSellOrderWithPrice[] = (
        pair?.sellOrders || []
      ).map((order) => ({
        ...order,
        price: formatBNToString(new BN(pair.spotPrice).add(new BN(pair.delta))),
      }));

      return [...orders, ...ordersWithPrice];
    }, []);
  },
);

interface NftWithPrice {
  mint: string;
  imageUrl: string;
  name: string;
  market: string;
  price: string | null;
}

export const selectAllWalletNfts = createSelector(
  (store: any) => (store?.core?.walletNfts?.data as WalletNft[]) || [],
  (walletNfts: WalletNft[]) => {
    return walletNfts.map((nft) => {
      const pairsSorted = [...nft.pairs].sort(
        (a, b) => b.spotPrice - a.spotPrice,
      );
      const bestPrice = pairsSorted?.[0]?.spotPrice || 0;

      return {
        mint: nft.mint,
        imageUrl: nft.imageUrl,
        name: nft.name,
        price: formatBNToString(new BN(bestPrice)),
        market: nft.market,
      } as NftWithPrice;
    });
  },
);

export const selectMarketWalletNfts = createSelector(
  selectAllWalletNfts,
  (_: never, marketPubkey: string) => marketPubkey,
  (walletNfts: NftWithPrice[], marketPubkey: string) =>
    walletNfts.filter((nft) => nft.market === marketPubkey),
);
