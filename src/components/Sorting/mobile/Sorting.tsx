import React, { FC, Fragment } from 'react';
import classNames from 'classnames';
import { SORT_ORDER } from '../../../constants/common';
import { SortingButton } from './SortingButton';
import ChevronIcon from '../../../icons/ChevronIcon';
import withModal from '../../Modal/mobile/Modal';
import styles from './Sorting.module.scss';
import { createPoolTableRow } from '../../../state/core/helpers';
import { MarketInfo } from '../../../state/core/types';

interface SortingProps {
  setIsSortingVisible: (arg: (value) => boolean) => void;
  sortValue: string;
  setSortValue: (arg: React.MouseEvent<HTMLElement> | string) => void;
  data: ReturnType<typeof createPoolTableRow>[] | MarketInfo[];
}

const Sorting: FC<SortingProps> = ({
  setIsSortingVisible,
  sortValue,
  setSortValue,
  data,
}) => {
  const handleSort = (e: React.MouseEvent<HTMLElement>) => {
    if (sortValue !== e.currentTarget.dataset.value) {
      setSortValue(e.currentTarget.dataset.value);
    } else {
      setSortValue('');
    }
  };

  return (
    <>
      <div className={styles.sortingHeader}>
        <h3>sorting</h3>
        <div onClick={() => setIsSortingVisible((value: boolean) => !value)}>
          <ChevronIcon />
        </div>
      </div>
      <div className={styles.sortingBody}>
        {data.map((item) => (
          <Fragment key={item.key}>
            <div className={styles.sortTitle}>{item.title}</div>
            <div className={styles.sortButtonsWrapper}>
              <SortingButton
                dataValue={`${item.key}_${SORT_ORDER.ASC}`}
                onClick={handleSort}
                className={classNames(styles.leftSortBtn, {
                  [styles.active]:
                    sortValue === `${item.key}_${SORT_ORDER.ASC}`,
                })}
              />
              <SortingButton
                dataValue={`${item.key}_${SORT_ORDER.DESC}`}
                onClick={handleSort}
                className={classNames({
                  [styles.active]:
                    sortValue === `${item.key}_${SORT_ORDER.DESC}`,
                })}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default withModal(Sorting);
