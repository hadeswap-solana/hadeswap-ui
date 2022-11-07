import { FC } from 'react';
import { SearchIcon } from '../../icons/SearchIcon';
import styles from './Search.module.scss';

const Index: FC = () => {
  return (
    <div className={styles.searchWrapper}>
      <SearchIcon className={styles.searchIcon} />
      <input placeholder="Search collections" />
    </div>
  );
};

export default Index;
