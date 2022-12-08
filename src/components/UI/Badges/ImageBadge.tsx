import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface ImageBadgeProps {
  src: string;
  name: string;
}

export const ImageBadge: FC<ImageBadgeProps> = ({ src, name }) => (
  <img
    className={classNames(styles.imageBadge, styles.root)}
    src={src}
    alt={name}
  />
);
