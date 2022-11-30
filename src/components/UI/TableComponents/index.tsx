import { FC } from 'react';
import { UNTITLED_COLLECTION } from '../../../constants/common';
import { SolPrice } from '../../SolPrice/SolPrice';
import { NavLink } from 'react-router-dom';

import styles from './styles.module.scss';

export const LinkCell: FC<{
  internal?: boolean;
  link: string;
  children: JSX.Element | JSX.Element[];
}> = ({ internal, link, children }) => (
  <>
    {internal ? (
      <NavLink className={styles.linkCell} to={link}>
        {children}
      </NavLink>
    ) : (
      <a
        className={styles.linkCell}
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
}> = ({ imgSrc, title }) => (
  <>
    <img
      className={styles.titleCellImg}
      src={imgSrc}
      alt={title || UNTITLED_COLLECTION}
    />
    <span>{title || UNTITLED_COLLECTION}</span>
  </>
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
