import { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import styles from './Modal.module.scss';

interface ModalProps {
  modalElement: HTMLDivElement;
  children: JSX.Element;
  modalClassName?: string;
  closeModal?: (arg: (value: boolean) => boolean) => void;
  stopScroll?: boolean;
  scrollToTop?: boolean;
}

const root = document.getElementById('root');

const withModal = (Component: FC): ((arg) => JSX.Element) => {
  const modalElement = document.createElement('div');

  const Modal = (props) => {
    return (
      <ModalWrapper {...props} modalElement={modalElement}>
        <Component {...props} />
      </ModalWrapper>
    );
  };
  return Modal;
};

const ModalWrapper: FC<ModalProps> = ({
  modalElement,
  children,
  modalClassName = '',
  stopScroll = true,
  scrollToTop = true,
}) => {
  const body = document.querySelector('body');

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
    modalElement.className = classNames(styles.modalWrapper, {
      [modalClassName]: modalClassName,
    });
  }, [modalClassName, modalElement]);

  return ReactDOM.createPortal(children, modalElement);
};

export default withModal;
