import React, { FC, Fragment } from 'react';
import classNames from 'classnames';
import { SORT_ORDER } from '../../../constants/common';
import { PairButtons } from '../../Buttons/PairButtons';
import ChevronIcon from '../../../icons/ChevronIcon';
import ArrowIcon from '../../../icons/ArrowIcon';
import Modal from '../../Modal/mobile/Modal';
import { ColumnsType } from 'antd/es/table';

import styles from './Sorting.module.scss';

interface SortingProps {
  setIsSortingVisible: (arg: (value) => boolean) => void;
  sortValue: string;
  setSortValue: (arg: string) => void;
  data: ColumnsType;
}

const Sorting: FC<SortingProps> = ({
  setIsSortingVisible,
  sortValue,
  setSortValue,
  data,
}) => {
  const handleSort = (value: string) => {
    if (sortValue !== value) {
      setSortValue(value);
    } else {
      setSortValue('');
    }
  };

  return (
    <Modal>
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
            <PairButtons
              onClickLeft={() => handleSort(`${item.key}_${SORT_ORDER.ASC}`)}
              onClickRight={() => handleSort(`${item.key}_${SORT_ORDER.DESC}`)}
              valueButtonLeft={
                <ArrowIcon
                  className={classNames(styles.arrowIcon, styles.arrowIconLeft)}
                />
              }
              valueButtonRight={<ArrowIcon className={styles.arrowIcon} />}
              isActiveLeft={sortValue === `${item.key}_${SORT_ORDER.ASC}`}
              isActiveRight={sortValue === `${item.key}_${SORT_ORDER.DESC}`}
            />
          </Fragment>
        ))}
      </div>
    </Modal>
  );
};

export default Sorting;
