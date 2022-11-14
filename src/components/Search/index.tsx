import { FC } from 'react';
import { SearchIcon } from '../../icons/SearchIcon';
import styles from './Search.module.scss';

const Search: FC = () => {
  return (
    <div className={styles.searchWrapper}>
      <SearchIcon className={styles.searchIcon} />
      <input placeholder="Search collections" />
    </div>
  );
};

export default Search;
