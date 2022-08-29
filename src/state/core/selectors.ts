import BN from 'bn.js';
import { identity } from 'ramda';
import { createSelector } from 'reselect';
import { formatBNToString } from '../../utils';
import { SellOrder } from './actions/cartActions';
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

export const selectBuyItemsInCartByPair = createSelector(
  (store: any) => (store?.core?.cart?.buy as Dictionary<SellOrder[]>) || {},
  identity<Dictionary<SellOrder[]>>,
);

export const selectAllSellOrdersForMarket = createSelector(
  [selectMarketPairs, selectBuyItemsInCartByPair],
  (pairs, buyItemsInCartByPair) => {
    return pairs
      .reduce((orders: SellOrder[], pair) => {
        const buyItemsCart: SellOrder[] =
          buyItemsInCartByPair[pair.pairPubkey] || [];
        const buyItemsCartMints = buyItemsCart.map(({ mint }) => mint);

        const sellOrders = (pair?.sellOrders || []).map((order) => {
          const isSelectedIndex = buyItemsCartMints.indexOf(order.mint);

          const price =
            isSelectedIndex !== -1
              ? pair.spotPrice + pair.delta * (isSelectedIndex + 1)
              : pair.spotPrice + pair.delta * (buyItemsCartMints.length + 1);

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
          };
        });

        return [...orders, ...sellOrders];
      }, [])
      .sort((a, b) => a.price - b.price) as SellOrder[];
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
