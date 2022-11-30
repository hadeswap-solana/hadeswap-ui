import React, { FC } from 'react';
import classNames from 'classnames';
import { SearchIcon } from '../../icons/SearchIcon';
import styles from './Search.module.scss';

interface SearchProps {
  className?: string;
  placeholder?: string;
  onChange: (event: React.BaseSyntheticEvent<Event>) => void;
}

export const Search: FC<SearchProps> = ({
  className,
  placeholder = 'Search collections',
  onChange,
}) => {
  return (
    <div className={classNames(styles.searchWrapper, className)}>
      <div className={styles.searchInner}>
        <SearchIcon className={styles.searchIcon} />
        <input onChange={onChange} placeholder={placeholder} />
      </div>
    </div>
  );
};
