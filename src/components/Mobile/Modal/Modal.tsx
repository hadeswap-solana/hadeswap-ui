import { FC } from 'react';
import { useScrollBlock } from "../../../hooks/useScrollBlock";
import styles from './Modal.module.scss';
import classNames from "classnames";

interface ModalProps {
  isVisible: boolean;
  className?: string;
}

const Modal: FC<ModalProps> = ({ children, isVisible, className }) => {
  useScrollBlock(isVisible);
  return isVisible && (
    <div className={classNames(styles.modalWrapper, { [className]: className })}>
      {children}
    </div>
  )
};

export default Modal;