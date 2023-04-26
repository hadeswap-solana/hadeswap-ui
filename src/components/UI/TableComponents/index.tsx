import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { PnftBadge } from '../PnftBadge';
import { SolPrice } from '../../SolPrice/SolPrice';
import { TableCellAlign } from '../../../types';
import { UNTITLED_COLLECTION } from '../../../constants/common';

import styles from './styles.module.scss';

export const LinkCell: FC<{
  internal?: boolean;
  link: string;
  children: JSX.Element | JSX.Element[];
  align?: TableCellAlign;
}> = ({ internal, link, children, align }) => (
  <>
    {internal ? (
      <NavLink to={link} className={classNames(styles.linkCell, styles[align])}>
        {children}
      </NavLink>
    ) : (
      <a
        className={classNames(styles.linkCell, styles[align])}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    )}
  </>
);

export const TitleCell: FC<{
  imgSrc: string;
  title: string;
  isPnft?: boolean;
}> = ({ imgSrc, title, isPnft }) => (
  <div className={styles.titleCellWrapper}>
    <div>
      <img
        className={styles.titleCellImg}
        src={imgSrc}
        alt={title || UNTITLED_COLLECTION}
      />
      <span>{title || UNTITLED_COLLECTION}</span>
    </div>
    {isPnft && <PnftBadge className={styles.pnftBadge} />}
  </div>
);

export const ColoredTextCell: FC<{
  cellValue: string;
  defaultValue: string;
}> = ({ cellValue, defaultValue }) => (
  <span
    className={
      cellValue === defaultValue
        ? styles.coloredTextCellGreen
        : styles.coloredTextCellRed
    }
  >
    {cellValue}
  </span>
);

export const PriceCell: FC<{ value: string }> = ({ value }) => (
  <SolPrice price={parseFloat(value)} rightIcon className={styles.priceCell} />
);
