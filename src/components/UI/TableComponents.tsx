import { UNTITLED_COLLECTION } from '../../constants/common';
import styles from './styles.module.scss';
import { SolPrice } from '../SolPrice/SolPrice';
import { NavLink } from 'react-router-dom';

export const LinkCell = ({
  internal,
  link,
  children,
}: {
  internal?: boolean;
  link: string;
  children: JSX.Element | JSX.Element[];
}): JSX.Element => (
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

export const TitleCell = ({
  imgSrc,
  title,
}: {
  imgSrc: string;
  title: string;
}): JSX.Element => (
  <>
    <img
      className={styles.titleCellImg}
      src={imgSrc}
      alt={title || UNTITLED_COLLECTION}
    />
    <span>{title || UNTITLED_COLLECTION}</span>
  </>
);

export const ColoredTextCell = ({
  cellValue,
  defaultValue,
}: {
  cellValue: string;
  defaultValue: string;
}): JSX.Element => (
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

export const PriceCell = ({ value }: { value: string }): JSX.Element => (
  <SolPrice price={parseFloat(value)} rightIcon className={styles.priceCell} />
);
