import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorPage } from '../pages/ErrorPage';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | undefined;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: undefined
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
    };

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <ErrorPage
                    error={this.state.error}
                    resetError={this.handleReset}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 