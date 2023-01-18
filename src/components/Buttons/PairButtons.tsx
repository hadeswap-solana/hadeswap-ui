import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface PairButtonsProps {
  className?: string;
  onClickLeft?: (arg: any) => void;
  onClickCenter?: (arg: any) => void;
  onClickRight?: (arg: any) => void;
  valueButtonLeft: string | JSX.Element;
  valueButtonCenter?: string | JSX.Element;
  valueButtonRight: string | JSX.Element;
  isActiveRight: boolean;
  isActiveCenter?: boolean;
  isActiveLeft: boolean;
  isDisabled?: boolean;
}

export const PairButtons: FC<PairButtonsProps> = ({
  className,
  onClickLeft,
  onClickCenter,
  onClickRight,
  valueButtonLeft,
  valueButtonCenter,
  valueButtonRight,
  isActiveLeft,
  isActiveCenter,
  isActiveRight,
  isDisabled = false,
}) => (
  <div className={classNames(styles.pairButtonsWrapper, className)}>
    <button
      className={classNames(
        styles.rootButton,
        styles.pairButtonLeft,
        { [styles.active]: isActiveLeft },
        { [styles.disabled]: isDisabled },
      )}
      onClick={!isDisabled ? onClickLeft : null}
    >
      {valueButtonLeft}
    </button>
    <div
      className={classNames(styles.separator, {
        [styles.active]: isActiveLeft || isActiveRight,
      })}
    />

    <button
      className={classNames(
        styles.rootButton,
        styles.pairButtonRight,
        { [styles.active]: isActiveCenter },
        { [styles.disabled]: isDisabled },
      )}
      onClick={!isDisabled ? onClickCenter : null}
    >
      {valueButtonCenter}
    </button>
    <button
      className={classNames(
        styles.rootButton,
        styles.pairButtonRight,
        { [styles.active]: isActiveRight },
        { [styles.disabled]: isDisabled },
      )}
      onClick={!isDisabled ? onClickRight : null}
    >
      {valueButtonRight}
    </button>
  </div>
);
