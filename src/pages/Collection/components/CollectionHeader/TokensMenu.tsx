import { FC, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Cart } from './Cart';
import { Search } from '../../../../components/Search';
import RoundIconButton from '../../../../components/Buttons/RoundIconButton';
import ChevronIcon from '../../../../icons/ChevronIcon';
import { SolanaLogo } from '../../../../icons/SolanaLogo';
import { Tokens } from '../../../../types';
import { coreActions } from '../../../../state/core/actions';
import { tokensList, TokensList } from './constants';

import styles from './styles.module.scss';

export const TokensMenu: FC = () => {
  const dispatch = useDispatch();

  const [list, setList] = useState<TokensList[]>(tokensList);
  const [listVisible, setListVisible] = useState<boolean>(false);

  const changeTokenHandler = (value: Tokens) => {
    dispatch(coreActions.exchangeToken(value));
  };

  const onSearch = (e) => {
    const query: string = e.nativeEvent.target.value.toLowerCase();
    setList(
      tokensList.filter((token) => {
        const tokenTitle = token.label.toLowerCase();
        return tokenTitle.includes(query);
      }),
    );
  };

  const clickListener = (e) => {
    if (!e.target.closest('#tokens-menu')) {
      setListVisible(false);
    }
  };

  useEffect(() => {
    if (listVisible) {
      document.addEventListener('click', clickListener);
    }
    return () => document.removeEventListener('click', clickListener);
  }, [listVisible]);

  return (
    <Cart className={styles.tokensSelectorWrapper}>
      <div className={styles.dPdMenuWrapper}>
        <div className={styles.tokensSelectorInner}>
          <SolanaLogo className={styles.solanaIcon} />
          <div className={styles.textWrapper}>
            <p className={styles.selectorTitle}>pay in SOL</p>
            <p className={styles.selectorSubtitle}>
              and in {tokensList.length} other tokens
            </p>
          </div>
          <RoundIconButton
            className={classNames(styles.button, {
              [styles.activeButton]: listVisible,
            })}
            onClick={() => setListVisible((prev) => !prev)}
          >
            <ChevronIcon />
          </RoundIconButton>
        </div>
        <div
          id="tokens-menu"
          className={classNames(styles.dPdMenu, {
            [styles.dPdMenuActive]: listVisible,
          })}
        >
          <div className={styles.dPdMenuInner}>
            <Search
              className={styles.searchBlock}
              onChange={onSearch}
              placeholder="search token by name"
            />
            <div className={styles.listHeader}>
              <span className={styles.listTitle}>token name</span>
            </div>
            <ul className={styles.listItemsWrapper}>
              {list.map((token) => (
                <li
                  key={token.label}
                  className={styles.listItem}
                  onClick={() => changeTokenHandler(token.value)}
                >
                  {token.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Cart>
  );
};
