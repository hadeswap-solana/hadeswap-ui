import React, { FC } from 'react';
import classNames from 'classnames';
import ArrowIcon from '../../../icons/ArrowIcon';
import styles from './Sorting.module.scss';

interface SortingButtonProps {
  className?: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  dataValue: string;
}

export const SortingButton: FC<SortingButtonProps> = ({
  className,
  onClick,
  dataValue,
}) => (
  <div
    className={classNames(styles.sortButton, { [className]: className })}
    onClick={onClick}
    data-value={dataValue}
  >
    <ArrowIcon className={styles.arrowIcon} />
  </div>
);
