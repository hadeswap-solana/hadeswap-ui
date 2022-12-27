import classNames from 'classnames';
import { FC, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

import { BlackButton } from '../../../../components/Buttons/BlackButton';
import { useOnClickOutside } from '../../../../hooks';
import {
  FilterFormInputsNames,
  OrderSortValue,
  SORT_VALUES,
} from '../CollectionTabs/useOrdersSort';
import styles from './styles.module.scss';

interface SortOrdersProps {
  setValue: any;
  options?: OrderSortValue[];
  sort: OrderSortValue;
  control: Control<{ sort: OrderSortValue }>;
}

const SortOrders: FC<SortOrdersProps> = ({
  control,
  setValue,
  options = SORT_VALUES,
  sort,
}) => {
  const [sortModalVisible, setSortModalVisible] = useState<boolean>(false);

  const ref = useRef();
  useOnClickOutside(ref, () => setSortModalVisible(false));

  return (
    <div className={styles.sortContainer} ref={ref}>
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
            <div className={styles.sortContent}>
              {options.map(({ value, label }, idx) => (
                <BlackButton
                  key={idx}
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
              ))}
            </div>
          )}
        />
      )}
    </div>
  );
};

export default SortOrders;
