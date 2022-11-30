import { FC } from 'react';

import styles from './styles.module.scss';

interface ImageBadgeProps {
  src: string;
  name: string;
}

export const ImageBadge: FC<ImageBadgeProps> = ({ src, name }) => (
  <img className={styles.imageBadge} src={src} alt={name} />
);
