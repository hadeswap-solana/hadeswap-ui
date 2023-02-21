import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';
import { BlackButton } from '../../../../components/Buttons/BlackButton';
import { FilterFormInputsNames, OrderSortValue } from './hooks/useOrdersSort';

import styles from './styles.module.scss';

interface SortOrdersProps {
  onChange: (label: JSX.Element | string, value: string) => void;
  control: Control<{ sort: OrderSortValue }>;
  options?: OrderSortValue[];
  sort: OrderSortValue;
  toggle: () => void;
  visible: boolean;
}

const SortOrders: FC<SortOrdersProps> = ({
  onChange,
  options,
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
              {options.map(({ value, label, isDisabled }, idx) => {
                return (
                  <BlackButton
                    key={idx}
                    isDisabled={isDisabled}
                    className={classNames(styles.sortButton, {
                      [styles.activeSortButton]: sort.value === value,
                    })}
                    onClick={!isDisabled ? () => onChange(label, value) : null}
                  >
                    {label}
                  </BlackButton>
                );
              })}
            </div>
          )}
        />
      )}
    </>
  );
};

export default SortOrders;
