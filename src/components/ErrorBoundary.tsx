import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12 font-sans">
          <div className="max-w-md w-full bg-white border-2 border-slate-900 p-12 shadow-2xl">
            <h1 className="text-4xl font-serif font-black mb-6 italic tracking-tight text-slate-900">System Interruption</h1>
            <p className="text-slate-500 mb-8 font-serif leading-relaxed italic border-l-4 border-indigo-600 pl-6">
              A critical synthesis error has occurred. The architectural runtime encountered an unhandled exception.
            </p>
            <div className="bg-red-50 p-4 border border-red-100 rounded-sm mb-8">
              <code className="text-[10px] text-red-600 font-mono break-all">
                {this.state.error?.message || 'Unknown Runtime Error'}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-none hover:bg-brand-indigo transition-all"
            >
              Restart Portal
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
