import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface PairButtonsProps {
  className?: string;
  onClickLeft: (arg: any) => void;
  onClickRight: (arg: any) => void;
  valueButtonLeft: string | JSX.Element;
  valueButtonRight: string | JSX.Element;
  isActiveRight: boolean;
  isActiveLeft: boolean;
}

export const PairButtons: FC<PairButtonsProps> = ({
  className,
  onClickLeft,
  onClickRight,
  valueButtonLeft,
  valueButtonRight,
  isActiveLeft,
  isActiveRight,
}) => (
  <div className={classNames(styles.pairButtonsWrapper, className)}>
    <button
      className={classNames(styles.rootButton, styles.pairButtonLeft, {
        [styles.active]: isActiveLeft,
      })}
      onClick={onClickLeft}
    >
      {valueButtonLeft}
    </button>
    <div
      className={classNames(styles.separator, {
        [styles.active]: isActiveLeft || isActiveRight,
      })}
    />
    <button
      className={classNames(styles.rootButton, styles.pairButtonRight, {
        [styles.active]: isActiveRight,
      })}
      onClick={onClickRight}
    >
      {valueButtonRight}
    </button>
  </div>
);
