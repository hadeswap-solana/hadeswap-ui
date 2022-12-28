import { useState } from 'react';

type UseSortModal = () => {
  visible: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export const useSortModal: UseSortModal = () => {
  const [visible, setVisible] = useState<boolean>(false);

  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
    toggle: () => setVisible(!visible),
  };
};
