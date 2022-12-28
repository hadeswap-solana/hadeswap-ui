import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';

import { BlackButton } from '../../../../components/Buttons/BlackButton';
import {
  FilterFormInputsNames,
  OrderSortValue,
  SORT_VALUES,
} from './hooks/useOrdersSort';
import styles from './styles.module.scss';

interface SortOrdersProps {
  onChange: (label: JSX.Element, value: string) => void;
  control: Control<{ sort: OrderSortValue }>;
  options?: OrderSortValue[];
  sort: OrderSortValue;
  toggle: () => void;
  visible: boolean;
}

const SortOrders: FC<SortOrdersProps> = ({
  onChange,
  options = SORT_VALUES,
  sort,
  control,
  visible,
  toggle,
}) => {
  return (
    <>
      <BlackButton className={styles.blackButton} onClick={toggle}>
        {sort.label}
      </BlackButton>
      {visible && (
        <Controller
          control={control}
          name={FilterFormInputsNames.SORT}
          render={() => (
            <div className={styles.sortModal}>
              {options.map(({ value, label }, idx) => (
                <BlackButton
                  key={idx}
                  className={classNames(styles.sortButton, {
                    [styles.activeSortButton]: sort.value === value,
                  })}
                  onClick={() => onChange(label, value)}
                >
                  {label}
                </BlackButton>
              ))}
            </div>
          )}
        />
      )}
    </>
  );
};

export default SortOrders;
