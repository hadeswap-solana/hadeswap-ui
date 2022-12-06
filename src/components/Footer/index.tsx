import { FC } from 'react';
import { DocsIcon } from '../../icons/DocsIcon';
import { DiscordIcon } from '../../icons/DiscordIcon';
import { TwitterIcon } from '../../icons/TwitterIcon';

import styles from './styles.module.scss';

export const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={styles.footerMain}>
      <div>
        <h5 className={styles.footerBlockTitle}>DOCUMENTATION</h5>
        <div className={styles.iconsWrapper}>
          <a
            href="https://docs.hadeswap.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DocsIcon />
          </a>
        </div>
      </div>
      <div>
        <h5 className={styles.footerBlockTitle}>CONTACT US</h5>
        <div className={styles.iconsWrapper}>
          <a
            href="https://discord.com/invite/hadeswap/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <DiscordIcon />
          </a>
          <a
            href="https://twitter.com/hadeswap/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon />
          </a>
        </div>
      </div>
    </div>
    <p className={styles.footerDisclaimer}>
      hadeswap is currently not audited and will be open sourced soon after the
      audit is conducted. use at your own risk
    </p>
  </footer>
);
