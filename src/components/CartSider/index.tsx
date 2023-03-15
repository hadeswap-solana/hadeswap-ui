import { FC, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectExchangeModalVisible,
  selectScreeMode,
} from '../../state/common/selectors';
import CartSiderDesktop from './CartSider';
import CartSiderMobile from './mobile/CartSider';
import { useCartSider, useSwap, CrossMintConfig } from './hooks';
import { ScreenTypes } from '../../state/common/types';
import { CartOrder } from '../../state/core/types';
import { coreActions } from '../../state/core/actions';
import { web3 } from 'hadeswap-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'react-router-dom';
import { fetchMarketWalletNfts } from '../../requests/wallet/requests';

export interface CartSiderProps {
  createOnDeselectHandler: (arg: CartOrder) => () => void;
  onDeselectBulkHandler: (arg: CartOrder[]) => void;
  swap: () => Promise<void>;
  isSwapButtonDisabled: boolean;
  isCartEmpty: boolean;
  cartOpened?: boolean;
  cartItems: {
    buy: CartOrder[];
    sell: CartOrder[];
  };
  invalidItems: CartOrder[];
  itemsAmount: number;
  totalBuy: number;
  totalSell: number;
  isExchangeMode?: boolean;
  isOneBuyNft: boolean;
  crossmintConfig: CrossMintConfig;
}

const CartSider: FC = () => {
  const dispatch = useDispatch();

  const { publicKey }: { publicKey: web3.PublicKey } = useWallet();
  const walletPubkey: string = publicKey?.toBase58();
  const { publicKey: marketPubkey } = useParams<{ publicKey: string }>();

  const screenMode = useSelector(selectScreeMode);
  const exchangeModalVisible = useSelector(selectExchangeModalVisible);

  const {
    cartItems,
    cartOpened,
    isCartEmpty,
    invalidItems,
    itemsAmount,
    totalBuy,
    totalSell,
    isOneBuyNft,
    crossmintConfig,
  } = useCartSider();

  const isSwapButtonDisabled = !itemsAmount;

  const { swap } = useSwap({
    onAfterTxn: async () => {
      const nfts = await fetchMarketWalletNfts({ walletPubkey, marketPubkey });
      dispatch(
        coreActions.setMarketWalletNfts({ data: nfts, isLoading: false }),
      );
    },
  });

  const createOnDeselectHandler = (order: CartOrder) => () => {
    dispatch(coreActions.removeOrderFromCart(order.mint));
  };

  const onDeselectBulkHandler = (data) => {
    data.forEach((item) =>
      dispatch(coreActions.removeOrderFromCart(item.mint)),
    );
  };

  return screenMode === ScreenTypes.TABLET ? (
    <CartSiderMobile
      createOnDeselectHandler={createOnDeselectHandler}
      onDeselectBulkHandler={onDeselectBulkHandler}
      swap={swap}
      isSwapButtonDisabled={isSwapButtonDisabled}
      isCartEmpty={isCartEmpty}
      cartItems={cartItems}
      invalidItems={invalidItems}
      itemsAmount={itemsAmount}
      totalBuy={totalBuy}
      totalSell={totalSell}
      isOneBuyNft={isOneBuyNft}
      crossmintConfig={crossmintConfig}
    />
  ) : (
    <CartSiderDesktop
      createOnDeselectHandler={createOnDeselectHandler}
      onDeselectBulkHandler={onDeselectBulkHandler}
      swap={swap}
      isSwapButtonDisabled={isSwapButtonDisabled}
      isCartEmpty={isCartEmpty}
      cartOpened={cartOpened}
      cartItems={cartItems}
      invalidItems={invalidItems}
      itemsAmount={itemsAmount}
      totalBuy={totalBuy}
      totalSell={totalSell}
      isExchangeMode={exchangeModalVisible}
      isOneBuyNft={isOneBuyNft}
      crossmintConfig={crossmintConfig}
    />
  );
};

export default memo(CartSider);
