import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';

import { BlackButton } from '../../../../components/Buttons/BlackButton';
import {
  FilterFormInputsNames,
  OrderSortValue,
  SORT_VALUES_MOBILE,
} from './hooks/useOrdersSort';
import styles from './styles.module.scss';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CloseOutlined,
} from '@ant-design/icons';

interface SortOrdersMobileProps {
  onChange: (label: JSX.Element, value: string) => void;
  options?: OrderSortValue[];
  sort: OrderSortValue;
  control: Control<{ sort: OrderSortValue }>;
  close: () => void;
  toggle: () => void;
  visible: boolean;
}

const SortOrdersMobile: FC<SortOrdersMobileProps> = ({
  onChange,
  options = SORT_VALUES_MOBILE,
  sort,
  control,
  visible,
  close,
  toggle,
}) => {
  const isDescSort = sort.value.split('_')[1] === 'desc';

  return (
    <>
      <BlackButton className={styles.blackButton} onClick={toggle}>
        <span className={(styles.label, isDescSort && styles.rotate)}>
          {sort.label}
        </span>
      </BlackButton>
      {visible && (
        <Controller
          control={control}
          name={FilterFormInputsNames.SORT}
          render={() => (
            <div className={styles.sortModalMobile}>
              <div className={styles.sortModalClose} onClick={close}>
                sorting <CloseOutlined />
              </div>
              <div className={styles.sortMobileButtons}>
                {options.map(({ value, label }) => {
                  const ASC_SORT = value + '_asc';
                  const DESC_SORT = value + '_desc';

                  const isActiveASC = sort.value === ASC_SORT;
                  const isActiveDESC = sort.value === DESC_SORT;

                  return (
                    <>
                      <span className={styles.label}>{value}</span>
                      <div className={styles.row}>
                        <BlackButton
                          className={classNames(styles.sortButtonAsc, {
                            [styles.activeSortMobileButton]: isActiveASC,
                          })}
                          onClick={() => onChange(label, ASC_SORT)}
                        >
                          {label}
                        </BlackButton>
                        <BlackButton
                          className={classNames(styles.sortButtonDesc, {
                            [styles.activeSortMobileButton]: isActiveDESC,
                          })}
                          onClick={() => onChange(label, DESC_SORT)}
                        >
                          {label}
                        </BlackButton>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          )}
        />
      )}
    </>
  );
};

export default SortOrdersMobile;
