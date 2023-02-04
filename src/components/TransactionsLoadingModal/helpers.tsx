import { ReactNode } from 'react';
import { CartOrder, Nft, OrderType } from '../../state/core/types';
import { IxCard, IxCardImage, IxCardText, SolAmount } from './components';
import { IX_TYPE } from './types';

const makeBuyOrSellNftIxCard = (order: CartOrder): ReactNode => {
  const { imageUrl, name, type, price } = order;
  return (
    <IxCard>
      <IxCardImage src={imageUrl} alt={name} />
      <IxCardText>
        {type === OrderType.BUY ? 'buy ' : 'sell '}
        <strong>{name}</strong>
        {' for '}
        <SolAmount solAmount={price} />
      </IxCardText>
    </IxCard>
  );
};

const makeCreateEmptyPoolIxCard = (): ReactNode => (
  <IxCard>
    <IxCardText>create new pool</IxCardText>
  </IxCard>
);

const makeEditPoolIxCard = (): ReactNode => (
  <IxCard>
    <IxCardText>edit pool</IxCardText>
  </IxCard>
);

const makeClosePoolIxCard = (): ReactNode => (
  <IxCard>
    <IxCardText>close pool</IxCardText>
  </IxCard>
);

const makeAddOrRemoveSolFromPoolIxCard = (
  solAmount: number,
  isRemove = false,
): ReactNode => (
  <IxCard>
    <IxCardText>
      {isRemove ? 'remove ' : 'add '} <SolAmount solAmount={solAmount} />{' '}
      {isRemove ? 'from ' : 'into '}
      pool
    </IxCardText>
  </IxCard>
);

const makeAddOrRemoveNftFromPoolIxCard = (
  nft: Nft,
  isRemove = false,
): ReactNode => {
  const { imageUrl, name } = nft;
  return (
    <IxCard>
      <IxCardImage src={imageUrl} alt={name} />
      <IxCardText>
        {isRemove ? 'remove ' : 'add '}
        <strong>{name}</strong> {isRemove ? 'from ' : 'into '} pool
      </IxCardText>
    </IxCard>
  );
};

const makeAddOrRemoveLiquidityFromPoolIxCard = (
  nft: Nft,
  solAmount: number,
  isRemove = false,
): ReactNode => {
  return (
    <IxCard>
      <IxCardImage src={nft?.imageUrl} alt={nft?.name} />
      <IxCardText>
        {isRemove ? 'remove ' : 'add '}
        <strong>{nft?.name}</strong> and <SolAmount solAmount={solAmount} />{' '}
        {isRemove ? 'from ' : 'into '} pool
      </IxCardText>
    </IxCard>
  );
};

const removeBuyOrdersFromPoolIxCard = (amount: number): ReactNode => {
  return (
    <IxCard>
      <IxCardText>remove {amount} buy orders</IxCardText>
    </IxCard>
  );
};

const removeBuyOrdersNoSolAmountFromPoolIxCard = (): ReactNode => {
  return (
    <IxCard>
      <IxCardText>remove buy orders</IxCardText>
    </IxCard>
  );
};

const addBuyOrdersNoSolAmountToPoolIxCard = (): ReactNode => {
  return (
    <IxCard>
      <IxCardText>add buy orders</IxCardText>
    </IxCard>
  );
};

const makeUnkonwIxCard = (): ReactNode => (
  <IxCard>
    <IxCardText>unknown instruction</IxCardText>
  </IxCard>
);

const makeWithdrawFeesIxCard = (solAmount?: number): ReactNode => (
  <IxCard>
    <IxCardText>
      withdraw fees {solAmount && <SolAmount solAmount={solAmount} />}
    </IxCardText>
  </IxCard>
);

export const createIxCardFuncs = {
  [IX_TYPE.CREATE_EMPTY_POOL]: makeCreateEmptyPoolIxCard,
  [IX_TYPE.EDIT_POOL]: makeEditPoolIxCard,
  [IX_TYPE.CLOSE_POOL]: makeClosePoolIxCard,
  [IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL]: makeAddOrRemoveSolFromPoolIxCard,
  [IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL]: makeAddOrRemoveNftFromPoolIxCard,
  [IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL]: removeBuyOrdersFromPoolIxCard,
  [IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL_NO_SOL_AMOUNT]:
    removeBuyOrdersNoSolAmountFromPoolIxCard,
  [IX_TYPE.ADD_BUY_ORDERS_TO_POOL_NO_SOL_AMOUNT]:
    addBuyOrdersNoSolAmountToPoolIxCard,

  [IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL]:
    makeAddOrRemoveLiquidityFromPoolIxCard,
  [IX_TYPE.COMPLETE_ORDER]: makeBuyOrSellNftIxCard,
  [IX_TYPE.WITHDRAW_FEES]: makeWithdrawFeesIxCard,
  DEFAULT: makeUnkonwIxCard,
};
