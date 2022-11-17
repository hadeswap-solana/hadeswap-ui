import { useSelector } from 'react-redux';
import { mockData } from '../../mockData';
import { Plate } from './Plate';
import { SocialLink } from './SocialLink';
import { GlobeIcon } from '../../../../icons/GlobeIcon';
import { DiscordIcon } from '../../../../icons/DiscordIcon';
import { TwitterIcon } from '../../../../icons/TwitterIcon';
import { ShareIcon } from '../../../../icons/ShareIcon';
import { BellThinIcon } from '../../../../icons/BellThinIcon';
import { SolPrice } from '../../../../components/SolPrice/SolPrice';
import { Spinner } from '../../../../components/Spinner/Spinner';
import {
  selectCertainMarket,
  selectCertainMarketLoading,
} from '../../../../state/core/selectors';
import { marketStatList } from './CollectionInfo.constants';

import styles from './styles.module.scss';

export const GeneralInfo = (): JSX.Element => {
  const market = useSelector(selectCertainMarket);
  const isLoading = useSelector(selectCertainMarketLoading);

  return (
    <div className={styles.headerWrapper}>
      {isLoading ? (
        <Spinner />
      ) : (
        <div
          className={styles.headerInner}
          style={{
            backgroundImage: `url('${market.collectionImage}')`,
          }}
        >
          <div className={styles.infoWrapper}>
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
              <div className={styles.collectionDescriptionWrapper}>
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
              </div>
              <div className={styles.collectionStatWrapper}>
                {marketStatList.map((item, index) => (
                  <Plate key={index} className={styles.collectionStatItem}>
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
                  </Plate>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
