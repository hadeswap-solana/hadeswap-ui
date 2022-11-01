import React, { FC } from 'react';
import styles from './Sorting.module.scss';

interface ButtonProps {
  setIsSortingVisible: (arg: (value) => boolean) => void;
}

export const OpenSortButton: FC<ButtonProps> = ({
  setIsSortingVisible,
}): JSX.Element => (
  <button
    className={styles.sortingBtn}
    onClick={() => setIsSortingVisible((value: boolean) => !value)}
  >
    sorting
  </button>
);
