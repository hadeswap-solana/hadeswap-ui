import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface PairButtonsProps {
  className?: string;
  onClickLeft?: (arg: any) => void;
  onClickRight?: (arg: any) => void;
  onClickCenter?: (arg: any) => void;
  valueButtonLeft: string | JSX.Element;
  valueButtonRight: string | JSX.Element;
  valueButtonCenter?: string | JSX.Element;
  isActiveRight: boolean;
  isActiveLeft: boolean;
  isActiveCenter?: boolean;
  isDisabled?: boolean;
}

export const PairButtons: FC<PairButtonsProps> = ({
  className,
  onClickLeft,
  onClickRight,
  onClickCenter,
  valueButtonLeft,
  valueButtonRight,
  valueButtonCenter,
  isActiveLeft,
  isActiveRight,
  isActiveCenter,
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
        [styles.active]:
          isActiveLeft ||
          isActiveCenter ||
          (isActiveRight && !valueButtonCenter),
      })}
    />
    {valueButtonCenter && (
      <>
        <button
          className={classNames(
            styles.rootButton,
            styles.pairButtonCenter,
            { [styles.active]: isActiveCenter },
            { [styles.disabled]: isDisabled },
          )}
          onClick={!isDisabled ? onClickCenter : null}
        >
          {valueButtonCenter}
        </button>
        <div
          className={classNames(styles.separator, {
            [styles.active]: isActiveCenter || isActiveRight,
          })}
        />
      </>
    )}
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
