import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Cart } from './Cart';
import { SolPrice } from '../../../../components/SolPrice/SolPrice';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { CreatePoolButton } from '../../../../components/CreatePoolButton/CreatePoolButton';
import { TokensMenu } from './TokensMenu';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
} from '../../../../state/core/selectors';
import { marketStatList } from './CollectionHeader.constants';
import Button from '../../../../components/Buttons/Button';
import { useCreateOfferModal } from '../../../../components/CreateOfferModal/hooks';
import CreateOfferModal from '../../../../components/CreateOfferModal/CreateOfferModal';

import styles from './styles.module.scss';

export const CollectionHeader: FC = () => {
  const market = useSelector(selectCertainMarket);
  const isLoading = useSelector(selectCertainMarketLoading);

  const {
    visible: createOfferModalVisible,
    open: openCreateOfferModal,
    close: closeCreateOfferModal,
  } = useCreateOfferModal();

  return (
    <div className={styles.headerWrapper}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.coverImageContainer}>
            <div
              className={styles.coverImage}
              style={{ backgroundImage: `url('${market.collectionImage}')` }}
            />
            <div className={styles.coverImageDecorator} />
          </div>
          <div className={styles.headerMain}>
            <div
              className={styles.imageHolder}
              style={{
                backgroundImage: `url('${market.collectionImage}')`,
              }}
            />
            <div className={styles.collectionInfo}>
              <h2 className={styles.collectionTitle}>
                {market.collectionName}
              </h2>
              <TokensMenu />
              <div className={styles.collectionStatWrapper}>
                {marketStatList.map((item, index) => (
                  <Cart key={index} className={styles.collectionStatItem}>
                    <span className={styles.collectionStatTitle}>
                      {item.title}
                    </span>
                    {item.price ? (
                      <SolPrice
                        className={styles.collectionStatValue}
                        price={parseFloat(market[item.key])}
                        rightIcon
                      />
                    ) : (
                      <span className={styles.collectionStatValue}>
                        {market[item.key]}
                      </span>
                    )}
                  </Cart>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.buttonsWrapper}>
            <CreatePoolButton />
            <Button
              className={styles.limitOrder}
              onClick={openCreateOfferModal}
              outlined
            >
              <span>buy/sell</span>
            </Button>
          </div>
        </>
      )}
      <CreateOfferModal
        visible={createOfferModalVisible}
        onCancel={closeCreateOfferModal}
      />
    </div>
  );
};
