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
import { selectCertainMarket } from '../../../../state/core/selectors';
import { marketStatList } from './GeneralInfo.constants';

import styles from './styles.module.scss';

export const GeneralInfo = (): JSX.Element => {
  const market = useSelector(selectCertainMarket);

  return (
    <div className={styles.generalWrapper}>
      <div
        className={styles.generalInner}
        style={{
          backgroundImage: `url('${market.collectionImage}')`,
        }}
      >
        <div className={styles.general}>
          <div
            className={styles.imageHolder}
            style={{
              backgroundImage: `url('${market.collectionImage}')`,
            }}
          />
          <div className={styles.collectionInfo}>
            <h2 className={styles.collectionTitle}>{market.collectionName}</h2>
            <div className={styles.collectionDescriptionWrapper}>
              <p className={styles.collectionDescription}>
                blalallalal
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
              {marketStatList.map((item) => (
                <Plate key={item.key} className={styles.collectionStatItem}>
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
    </div>
  );
};
