/* eslint-disable react/display-name */
import { FC, useEffect, memo } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import styles from './Modal.module.scss';

interface ModalProps {
  modalWrapper: HTMLDivElement;
  children: JSX.Element;
  modalClassName?: string;
  closeModal?: (arg: (value) => boolean) => void;
  stopScroll?: boolean;
}

const root = document.getElementById('root');

const withModal = (Component: FC): ((arg) => JSX.Element) => {
  const modalWrapper = document.createElement('div');
  return (props) => {
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
};

const ModalWrapper: FC<ModalProps> = memo(
  ({
    modalWrapper,
    children,
    modalClassName = '',
    closeModal,
    stopScroll = true,
  }) => {
    const layout = document.querySelector('.ant-layout');

    const handleClickOutOfModal = () => {
      closeModal((value) => !value);
    };

    useEffect(() => {
      root.appendChild(modalWrapper);
      return () => {
        root.removeChild(modalWrapper);
      };
    }, [modalWrapper]);

    useEffect(() => {
      stopScroll && layout.classList.add(styles.stopScrollLayout);
      return () => {
        stopScroll && layout.classList.remove(styles.stopScrollLayout);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stopScroll]);

    useEffect(() => {
      closeModal && layout.addEventListener('click', handleClickOutOfModal);
      return () => {
        closeModal &&
          layout.removeEventListener('click', handleClickOutOfModal);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [closeModal]);

    useEffect(() => {
      modalWrapper.className = classNames(styles.modalWrapper, {
        [modalClassName]: modalClassName,
      });
    }, [modalClassName, modalWrapper]);

    return ReactDOM.createPortal(children, modalWrapper);
  },
);

export default withModal;
