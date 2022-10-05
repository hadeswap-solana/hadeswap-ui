import React, { FC, Fragment, memo } from "react";
import classNames from "classnames";
import { COLUMNS, SORT_ORDER } from "../../Collections.constants";
import Modal from "../../../../components/Mobile/Modal/Modal";
import { ShevronIcon, Arrow } from "../../../../components/svg";
import styles from '../../Collections.module.scss';

interface SortingButtonProps {
  className?: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  dataValue: string;
}

interface SortingModalProps {
  isModalVisible: boolean;
  setIsModalVisible: (arg: boolean) => void;
  sortValue: string;
  setSortValue: (arg: string | null) => void;
}

const SortingButton: FC<SortingButtonProps> = ({ className, onClick, dataValue }) => (
  <div
    className={classNames(styles.button, { [className]: className })}
    onClick={onClick}
    data-value={dataValue}
  >
    {Arrow}
  </div>
);

const SortingModal: FC<SortingModalProps> = ({ isModalVisible, setIsModalVisible, sortValue, setSortValue }) => {
  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    if (sortValue !== e.currentTarget.dataset.value) {
      setSortValue(e.currentTarget.dataset.value);
    } else {
      setSortValue(null);
    }
  };

  return (
    <Modal
      isVisible={isModalVisible}
      className={styles.modalInner}
    >
      <div className={styles.sortingHeader}>
        <h3>Sorting</h3>
        <div onClick={() => setIsModalVisible(false)}>
          {ShevronIcon}
        </div>
      </div>
      <div className={styles.sortingBody}>
        {COLUMNS.map(item => (
          <Fragment key={item.key}>
            <div className={styles.sortTitle}>{item.title}</div>
            <div className={styles.buttonsWrapper}>
              <SortingButton
                dataValue={`${item.key}_${SORT_ORDER.ASC}`}
                onClick={onClick}
                className={classNames(styles.leftSortBtn,
                  { [styles.active]: sortValue === `${item.key}_${SORT_ORDER.ASC}` }
                )}
              />
              <SortingButton
                dataValue={`${item.key}_${SORT_ORDER.DESC}`}
                onClick={onClick}
                className={classNames(
                  { [styles.active]: sortValue === `${item.key}_${SORT_ORDER.DESC}` }
                )}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </Modal>
  )
};

export default memo(SortingModal);
