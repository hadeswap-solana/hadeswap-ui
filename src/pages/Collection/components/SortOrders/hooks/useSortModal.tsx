import { useState } from 'react';

type UseSortModal = () => {
  visible: boolean;
  close: () => void;
  toggle: () => void;
};

export const useSortModal: UseSortModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    close: () => setVisible(false),
    toggle: () => setVisible(!visible),
  };
};
