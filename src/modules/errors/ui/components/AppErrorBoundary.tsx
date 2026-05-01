import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import AppErrorPage from './AppErrorPage';
import { resolveAppErrorKind } from '../utils/app-error';

interface AppErrorBoundaryState {
  error: unknown;
}

const IS_PROD = import.meta.env.PROD;

class AppErrorBoundary extends Component<PropsWithChildren, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  componentDidMount(): void {
    if (!IS_PROD) {
      return;
    }

    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount(): void {
    if (!IS_PROD) {
      return;
    }

    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState | null {
    if (!IS_PROD) {
      return null;
    }

    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Frontend runtime error', error, errorInfo);
  }

  handleWindowError = (event: ErrorEvent) => {
    this.setState({
      error: event.error ?? new Error(event.message || 'Unhandled window error'),
    });
  };

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    this.setState({
      error: event.reason ?? new Error('Unhandled promise rejection'),
    });
  };

  render() {
    if (!IS_PROD || !this.state.error) {
      return this.props.children;
    }

    return <AppErrorPage kind={resolveAppErrorKind(this.state.error)} />;
  }
}

export default AppErrorBoundary;
