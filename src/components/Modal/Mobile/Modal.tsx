import { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';
import classNames from 'classnames';

interface ModalProps {
  className?: string;
  closeModal?: (arg: (value) => boolean) => void;
}

const root = document.getElementById('root');
const modalWrapper = document.createElement('div');

const Modal: FC<ModalProps> = ({ children, className, closeModal }) => {
  const layout = document.querySelector('.ant-layout');

  const handleClickOutOfModal = () => {
    closeModal((value) => !value);
  };

  useEffect(() => {
    root.appendChild(modalWrapper);
    modalWrapper.className = classNames(styles.modalWrapper, {
      [className]: className,
    });
    layout.classList.add(styles.heightFullScreen);

    closeModal && layout.addEventListener("click", handleClickOutOfModal);

    return () => {
      root.removeChild(modalWrapper);
      layout.classList.remove(styles.heightFullScreen);
      layout.removeEventListener("click", handleClickOutOfModal);
    };
  }, [children, className]);

  return ReactDOM.createPortal(children, modalWrapper);
};

export default Modal;
