import { Component, ErrorInfo, FC, ReactNode } from 'react';

import styles from './ErrorBoundary.module.scss';

interface Props {
  children?: ReactNode;
}

interface SolanaError extends Error {
  logs?: Array<string>;
}

interface State {
  error?: SolanaError;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    error: null,
  };

  public static getDerivedStateFromError(error: SolanaError): State {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  public componentDidCatch(error: SolanaError, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.error) {
      return <ErrorPlaceholder error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorPlaceholderProps {
  error: SolanaError;
}

const ErrorPlaceholder: FC<ErrorPlaceholderProps> = ({ error }) => {
  const errorText = [
    error.name,
    error.message,
    error?.cause,
    error?.logs?.join('\n'),
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <h1 className={styles.title}>Something unexpected happened</h1>
        <pre className={styles.errorMessage}>{errorText}</pre>
      </div>
    </div>
  );
};
