import { FC } from 'react';
import { useSelector } from 'react-redux';

import { Cart } from './Cart';
// import { SocialLink } from './SocialLink';
// import { GlobeIcon } from '../../../../icons/GlobeIcon';
// import { DiscordIcon } from '../../../../icons/DiscordIcon';
// import { TwitterIcon } from '../../../../icons/TwitterIcon';
// import { ShareIcon } from '../../../../icons/ShareIcon';
// import { BellThinIcon } from '../../../../icons/BellThinIcon';
import { SolPrice } from '../../../../components/SolPrice/SolPrice';
import { Spinner } from '../../../../components/Spinner/Spinner';
import { CreatePoolButton } from '../../../../components/CreatePoolButton/CreatePoolButton';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
} from '../../../../state/core/selectors';
import { marketStatList } from './CollectionHeader.constants';

import styles from './styles.module.scss';
import Button from '../../../../components/Buttons/Button';
import { useCreateOfferModal } from '../../../../components/CreateOfferModal/hooks';
import CreateOfferModal from '../../../../components/CreateOfferModal/CreateOfferModal';

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
              {/* <div className={styles.collectionDescriptionWrapper}>
                <p className={styles.collectionDescription}>
                  {mockData.collectionDescription}
                </p>
                <div className={styles.collectionDescriptionSocial}>
                  <Plate>
                    <SocialLink
                      icon={<DiscordIcon />}
                      href={'https://discord.gg/hadeswap'}
                    />
                    <SocialLink
                      icon={<TwitterIcon />}
                      href={'https://discord.gg/hadeswap'}
                    />
                    <SocialLink
                      icon={<GlobeIcon />}
                      href={'https://discord.gg/hadeswap'}
                    />
                    <SocialLink
                      icon={<ShareIcon />}
                      href={'https://discord.gg/hadeswap'}
                    />
                  </Plate>
                  <Plate
                    onClick={() => null}
                    className={styles.collectionSubscribe}
                  >
                    <div className={styles.collectionSubscribeInner}>
                      <BellThinIcon />
                      <span>subscribe</span>
                    </div>
                  </Plate>
                </div>
              </div> */}
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
            <Button onClick={openCreateOfferModal} outlined>
              <span>oneprice order</span>
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
