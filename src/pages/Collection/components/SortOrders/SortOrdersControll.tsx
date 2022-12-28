import { FC, useRef } from 'react';
import { Control } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { FilterFormInputsNames, OrderSortValue } from './hooks/useOrdersSort';
import { selectScreeMode } from '../../../../state/common/selectors';
import { ScreenTypes } from '../../../../state/common/types';
import { useOnClickOutside } from '../../../../hooks';
import { useSortModal } from './hooks/useSortModal';
import SortOrdersMobile from './SortOrdersMobile';
import styles from './styles.module.scss';
import SortOrders from './SortOrders';

interface SortOrdersControllProps {
  setValue: any;
  sort: OrderSortValue;
  control: Control<{ sort: OrderSortValue }>;
}

const SortOrdersControll: FC<SortOrdersControllProps> = ({
  setValue,
  sort,
  control,
}) => {
  const screenMode = useSelector(selectScreeMode);
  const isMobile = screenMode !== ScreenTypes.DESKTOP;

  const {
    visible: sortModalVisible,
    close: closeSortModal,
    toggle: toggleSortModal,
  } = useSortModal();

  const ref = useRef();
  useOnClickOutside(ref, closeSortModal);

  const onChangeSortOrder = (label: JSX.Element, value: string) => {
    setValue(FilterFormInputsNames.SORT, { label, value });
  };

  return (
    <div className={styles.sortWrapper} ref={ref}>
      {isMobile ? (
        <SortOrdersMobile
          onChange={onChangeSortOrder}
          sort={sort}
          control={control}
          close={closeSortModal}
          visible={sortModalVisible}
          toggle={toggleSortModal}
        />
      ) : (
        <SortOrders
          onChange={onChangeSortOrder}
          sort={sort}
          control={control}
          visible={sortModalVisible}
          toggle={toggleSortModal}
        />
      )}
    </div>
  );
};

export default SortOrdersControll;
