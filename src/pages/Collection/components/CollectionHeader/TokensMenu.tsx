import { FC, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Cart } from './Cart';
import { Search } from '../../../../components/Search';
import RoundIconButton from '../../../../components/Buttons/RoundIconButton';
import ChevronIcon from '../../../../icons/ChevronIcon';
import { TokensValues } from '../../../../types';
import { tokenExchangeActions } from '../../../../state/tokenExchange/actions';
import { tokensList, TokenItem } from '../../../../constants/tokens';
import { selectTokenExchange } from '../../../../state/tokenExchange/selectors';

import styles from './styles.module.scss';

export const TokensMenu: FC = () => {
  const dispatch = useDispatch();

  const selectedToken = useSelector(selectTokenExchange);
  const displayTokenValue = !selectedToken
    ? TokensValues.SOL
    : selectedToken.value;
  const displayToken = tokensList.find(
    (token) => token.value === displayTokenValue,
  );

  const [list, setList] = useState<TokenItem[]>(tokensList);
  const [listVisible, setListVisible] = useState<boolean>(false);

  const onSetToken = (value: TokensValues) => {
    const token =
      value === TokensValues.SOL
        ? null
        : tokensList.find((token) => token.value === value);
    dispatch(tokenExchangeActions.setToken(token));
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
    if (e.target.closest('#item') || !e.target.closest('#tokens-menu')) {
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
          <div className={styles.displayTokenLogoWrapper}>
            <img
              className={styles.displayTokenLogoImage}
              src={displayToken.image}
              alt={displayToken.label}
            />
          </div>
          <div className={styles.textWrapper}>
            <p className={styles.selectorTitle}>pay in {displayToken.label}</p>
            <p className={styles.selectorSubtitle}>
              and in {tokensList.length - 1} other tokens
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
                  id="item"
                  className={styles.listItem}
                  onClick={() => onSetToken(token.value)}
                >
                  <img
                    className={styles.listImage}
                    src={token.image}
                    alt={token.label}
                  />
                  <span>{token.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Cart>
  );
};
