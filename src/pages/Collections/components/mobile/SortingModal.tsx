import React, { FC, Fragment, memo } from 'react';
import classNames from 'classnames';
import { COLUMNS, SORT_ORDER } from '../../Collections.constants';
import Modal from '../../../../components/Modal/Mobile/Modal';
import ArrowIcon from '../../../../icons/ArrowIcon';
import ChevronIcon from '../../../../icons/ChevronIcon';
import styles from './CollectionsList.module.scss';

interface SortingButtonProps {
  className?: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  dataValue: string;
}

interface SortingModalProps {
  setIsModalVisible: (arg: (value) => boolean) => void;
  handleSort: (e: React.MouseEvent<HTMLElement>) => void;
  sortValue: string;
}

const SortingButton: FC<SortingButtonProps> = ({
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

const SortingModal: FC<SortingModalProps> = ({
  setIsModalVisible,
  handleSort,
  sortValue,
}) => (
  <Modal className={styles.modalInner} closeModal={setIsModalVisible} >
    <div className={styles.sortingHeader}>
      <h3>Sorting</h3>
      <div onClick={() => setIsModalVisible((value: boolean) => !value)}>
        <ChevronIcon />
      </div>
    </div>
    <div className={styles.sortingBody}>
      {COLUMNS.map(item => (
        <Fragment key={item.key}>
          <div className={styles.sortTitle}>{item.title}</div>
          <div className={styles.sortButtonsWrapper}>
            <SortingButton
              dataValue={`${item.key}_${SORT_ORDER.ASC}`}
              onClick={handleSort}
              className={classNames(styles.leftSortBtn, {
                [styles.active]: sortValue === `${item.key}_${SORT_ORDER.ASC}`,
              })}
            />
            <SortingButton
              dataValue={`${item.key}_${SORT_ORDER.DESC}`}
              onClick={handleSort}
              className={classNames({
                [styles.active]: sortValue === `${item.key}_${SORT_ORDER.DESC}`,
              })}
            />
          </div>
        </Fragment>
      ))}
    </div>
  </Modal>
);

export default memo(SortingModal);
