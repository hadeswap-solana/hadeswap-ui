import { FC, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import styles from './Modal.module.scss';

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  className?: string;
  stopScroll?: boolean;
  scrollToTop?: boolean;
}

const root = document.getElementById('root');

const Modal: FC<ModalProps> = ({
  children,
  className = '',
  stopScroll = true,
  scrollToTop = true,
}) => {
  const body = document.querySelector('body');

  const modalElement = useMemo(() => {
    return document.createElement('div');
  }, []);

  useEffect(() => {
    root.appendChild(modalElement);
    return () => {
      root.removeChild(modalElement);
    };
  }, [modalElement]);

  useEffect(() => {
    stopScroll && body.classList.add(styles.stopScroll);
    scrollToTop && window.scrollTo(0, 0);
    return () => {
      stopScroll && body.classList.remove(styles.stopScroll);
    };
  });

  useEffect(() => {
    modalElement.className = classNames(styles.modalWrapper, className);
  }, [className, modalElement]);

  return ReactDOM.createPortal(children, modalElement);
};

export default Modal;
