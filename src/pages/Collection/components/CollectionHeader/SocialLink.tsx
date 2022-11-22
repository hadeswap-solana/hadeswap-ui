import { FC } from 'react';

import styles from './styles.module.scss';

interface SocialLinkProps {
  icon: JSX.Element;
  href: string;
}

export const SocialLink: FC<SocialLinkProps> = ({ icon, href }) => (
  <a
    className={styles.socialLink}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
  >
    {icon}
  </a>
);
