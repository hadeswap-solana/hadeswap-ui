import React, { useState } from 'react';
import { useDebounce } from '../../hooks';

export const useSearch = (): {
  searchStr: string;
  handleSearch: (event: React.BaseSyntheticEvent<Event>) => void;
} => {
  const [searchStr, setSearchStr] = useState<string>('');

  const setSearch = useDebounce((search: string): void => {
    setSearchStr(search.toUpperCase());
  }, 300);

  const handleSearch = (event) => setSearch(event.target.value || '');

  return {
    searchStr,
    handleSearch,
  };
};
