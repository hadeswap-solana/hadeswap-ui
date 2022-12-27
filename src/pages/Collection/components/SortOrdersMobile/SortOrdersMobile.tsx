import classNames from 'classnames';
import { FC, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { BlackButton } from '../../../../components/Buttons/BlackButton';
import { useOnClickOutside } from '../../../../hooks';
import {
  FilterFormInputsNames,
  OrderSortValue,
  SORT_VALUES_MOBILE,
} from '../CollectionTabs/useOrdersSort';
import styles from './styles.module.scss';

interface SortOrdersMobileProps {
  setValue: any;
  options?: OrderSortValue[];
  sort: OrderSortValue;
  control: Control<{ sort: OrderSortValue }>;
}

const SortOrdersMobile: FC<SortOrdersMobileProps> = ({
  setValue,
  options = SORT_VALUES_MOBILE,
  sort,
  control,
}) => {
  const [sortModalVisible, setSortModalVisible] = useState<boolean>(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setSortModalVisible(false));

  return (
    <div ref={ref}>
      <BlackButton
        className={styles.blackButton}
        onClick={() => setSortModalVisible(!sortModalVisible)}
      >
        {sort.label}
      </BlackButton>
      {sortModalVisible && (
        <Controller
          control={control}
          name={FilterFormInputsNames.SORT}
          render={() => (
            <div className={styles.sortModalMobile}>
              <div>sorting x</div>
              <div className={styles.sortButtons}>
                {options.map(({ value, label }) => {
                  return (
                    <>
                      <span className={styles.label}>{value}</span>
                      <div className={styles.row}>
                        <BlackButton
                          className={classNames(styles.sortButton, {
                            [styles.activeSortButton]: sort.value === value,
                          })}
                          onClick={() =>
                            setValue(FilterFormInputsNames.SORT, {
                              label,
                              value,
                            })
                          }
                        >
                          {label}
                        </BlackButton>
                        <BlackButton
                          className={classNames(styles.sortButton, {
                            [styles.activeSortButton]: sort.value === value,
                          })}
                          onClick={() =>
                            setValue(FilterFormInputsNames.SORT, {
                              label,
                              value,
                            })
                          }
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
    </div>
  );
};

export default SortOrdersMobile;
