import { FC } from 'react';
import { Spinner } from '../Spinner/Spinner';

import styles from './PageContentLayout.module.scss';

interface PageContentLayoutProps {
  title: string;
  children: JSX.Element | JSX.Element[];
  isLoading?: boolean;
}

const PageContentLayout: FC<PageContentLayoutProps> = ({
  title,
  children,
  isLoading,
}) => (
  <div className={styles.contentWrapper}>
    <h1 className={styles.pageTitle}>{title}</h1>
    {isLoading ? <Spinner /> : children}
  </div>
);

export default PageContentLayout;
