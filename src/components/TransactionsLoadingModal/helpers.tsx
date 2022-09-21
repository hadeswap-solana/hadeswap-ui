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
        {type === OrderType.BUY ? 'Buy ' : 'Sell '}
        <strong>{name}</strong>
        {' for '}
        <SolAmount solAmount={price} />
      </IxCardText>
    </IxCard>
  );
};

const makeCreateEmptyPoolIxCard = (): ReactNode => (
  <IxCard>
    <IxCardText>Create new pool</IxCardText>
  </IxCard>
);

const makeEditPoolIxCard = (): ReactNode => (
  <IxCard>
    <IxCardText>Edit pool</IxCardText>
  </IxCard>
);

const makeAddOrRemoveSolFromPoolIxCard = (
  solAmount: number,
  isRemove = false,
): ReactNode => (
  <IxCard>
    <IxCardText>
      {isRemove ? 'Remove ' : 'Add '} <SolAmount solAmount={solAmount} />{' '}
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
        {isRemove ? 'Remove ' : 'Add '}
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
  const { imageUrl, name } = nft;
  return (
    <IxCard>
      <IxCardImage src={imageUrl} alt={name} />
      <IxCardText>
        {isRemove ? 'Remove ' : 'Add '}
        <strong>{name}</strong> and <SolAmount solAmount={solAmount} />{' '}
        {isRemove ? 'from ' : 'into '} pool
      </IxCardText>
    </IxCard>
  );
};

const removeBuyOrdersFromPoolIxCard = (amount: number): ReactNode => {
  return (
    <IxCard>
      <IxCardText>Remove {amount} buy orders</IxCardText>
    </IxCard>
  );
};

const makeUnkonwIxCard = (): ReactNode => (
  <IxCard>
    <IxCardText>Unknown instruction</IxCardText>
  </IxCard>
);

export const createIxCardFuncs = {
  [IX_TYPE.CREATE_EMPTY_POOL]: makeCreateEmptyPoolIxCard,
  [IX_TYPE.EDIT_POOL]: makeEditPoolIxCard,
  [IX_TYPE.ADD_OR_REMOVE_SOL_FROM_POOL]: makeAddOrRemoveSolFromPoolIxCard,
  [IX_TYPE.ADD_OR_REMOVE_NFT_FROM_POOL]: makeAddOrRemoveNftFromPoolIxCard,
  [IX_TYPE.REMOVE_BUY_ORDERS_FROM_POOL]: removeBuyOrdersFromPoolIxCard,
  [IX_TYPE.ADD_OR_REMOVE_LIQUIDITY_FROM_POOL]:
    makeAddOrRemoveLiquidityFromPoolIxCard,
  [IX_TYPE.COMPLETE_ORDER]: makeBuyOrSellNftIxCard,
  DEFAULT: makeUnkonwIxCard,
};
