import { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.scss';
import classNames from "classnames";

interface ModalProps {
  className?: string;
}

const root = document.getElementById('root');
const modalWrapper = document.createElement('div');

const Modal: FC<ModalProps> = ({ children, className }) => {
  const layout = document.querySelector('.ant-layout');

  useEffect(() => {
    root.appendChild(modalWrapper);
    modalWrapper.className = classNames(styles.modalWrapper, { [className]: className });
    layout.classList.add(styles.heightFullScreen);
    return () => {
      root.removeChild(modalWrapper);
      layout.classList.remove(styles.heightFullScreen);
    };
  }, []);

  return ReactDOM.createPortal(children, modalWrapper);
};

export default Modal;