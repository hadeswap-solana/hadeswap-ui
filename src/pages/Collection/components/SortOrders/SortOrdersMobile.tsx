import React, { FC, Fragment } from 'react';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';
import { BlackButton } from '../../../../components/Buttons/BlackButton';
import Modal from '../../../../components/Modal/mobile/Modal';
import { PairButtons } from '../../../../components/Buttons/PairButtons';
import ArrowIcon from '../../../../icons/ArrowIcon';
import ChevronIcon from '../../../../icons/ChevronIcon';
import { FilterFormInputsNames, OrderSortValue } from './hooks/useOrdersSort';
import { SORT_ORDER } from '../../../../types';

import localStyles from './styles.module.scss';
import styles from '../../../../components/Sorting/mobile/Sorting.module.scss';

interface SortOrdersMobileProps {
  onChange: (label: JSX.Element | string, value: string) => void;
  options?: OrderSortValue[];
  sort: OrderSortValue;
  control: Control<{ sort: OrderSortValue }>;
  close: () => void;
  toggle: () => void;
  visible: boolean;
}

const SortOrdersMobile: FC<SortOrdersMobileProps> = ({
  onChange,
  options,
  sort,
  control,
  visible,
  close,
  toggle,
}) => {
  const sortOrder = sort.value.split('_')[1] || SORT_ORDER.ASC;
  const sortValue = sort.value.split('_')[1]
    ? sort.value
    : `${sort.value}_${sortOrder}`;

  return (
    <>
      <BlackButton className={localStyles.blackButton} onClick={toggle}>
        <div>
          <span style={{ marginRight: '12px' }}>{sort.label}</span>
          <ArrowIcon
            className={classNames(styles.arrowIcon, {
              [styles.arrowIconLeft]: sortOrder === SORT_ORDER.ASC,
            })}
          />
        </div>
      </BlackButton>
      {visible && (
        <Modal>
          <div className={styles.sortingHeader}>
            <h3>sorting</h3>
            <div onClick={close}>
              <ChevronIcon />
            </div>
          </div>
          <Controller
            control={control}
            name={FilterFormInputsNames.SORT}
            render={() => (
              <div className={styles.sortingBody}>
                {options.map(({ value, label, isDisabled }, index) => {
                  return (
                    <Fragment key={index}>
                      <div className={styles.sortTitle}>{label}</div>
                      <PairButtons
                        onClickLeft={() =>
                          isDisabled ? null : onChange(label, value + '_asc')
                        }
                        onClickRight={() =>
                          isDisabled ? null : onChange(label, value + '_desc')
                        }
                        valueButtonLeft={
                          <ArrowIcon
                            className={classNames(
                              styles.arrowIcon,
                              styles.arrowIconLeft,
                            )}
                          />
                        }
                        valueButtonRight={
                          <ArrowIcon className={styles.arrowIcon} />
                        }
                        isActiveLeft={
                          `${value}_${SORT_ORDER.ASC}` === sortValue
                        }
                        isActiveRight={
                          `${value}_${SORT_ORDER.DESC}` === sortValue
                        }
                      />
                    </Fragment>
                  );
                })}
              </div>
            )}
          />
        </Modal>
      )}
    </>
  );
};

export default SortOrdersMobile;
