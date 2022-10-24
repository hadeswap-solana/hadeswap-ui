import { FC, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import styles from './Modal.module.scss';

interface ModalProps {
  modalWrapper: HTMLDivElement;
  children: JSX.Element;
  modalClassName?: string;
  closeModal?: (arg: (value: boolean) => boolean) => void;
  stopScroll?: boolean;
}

const root = document.getElementById('root');

const withModal = (Component: FC): ((arg) => JSX.Element) => {
  const modalWrapper = document.createElement('div');

  const Modal = (props) => {
    const { modalClassName, stopScroll, closeModal } = props;
    return (
      <ModalWrapper
        modalWrapper={modalWrapper}
        modalClassName={modalClassName}
        closeModal={closeModal}
        stopScroll={stopScroll}
      >
        <Component {...props} />
      </ModalWrapper>
    );
  };
  return Modal;
};

const ModalWrapper: FC<ModalProps> = ({
  modalWrapper,
  children,
  modalClassName = '',
  closeModal,
  stopScroll = true,
}) => {
  const layout = document.querySelector('.ant-layout');

  const handleClickOutOfModal = useCallback(() => {
    closeModal((value) => !value);
  }, [closeModal]);

  useEffect(() => {
    root.appendChild(modalWrapper);
    return () => {
      root.removeChild(modalWrapper);
    };
  }, [modalWrapper]);

  useEffect(() => {
    closeModal && layout.addEventListener('click', handleClickOutOfModal);
    stopScroll && layout.classList.add(styles.stopScrollLayout);
    return () => {
      closeModal && layout.removeEventListener('click', handleClickOutOfModal);
      stopScroll && layout.classList.remove(styles.stopScrollLayout);
    };
  });

  useEffect(() => {
    modalWrapper.className = classNames(styles.modalWrapper, {
      [modalClassName]: modalClassName,
    });
  }, [modalClassName, modalWrapper]);

  return ReactDOM.createPortal(children, modalWrapper);
};

export default withModal;
