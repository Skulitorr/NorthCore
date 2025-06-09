import React from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';
import MainLayout from '../components/layout/MainLayout';

const App: React.FC = () => {
  // Add a fallback in case MainLayout is undefined
  const renderMainLayout = () => {
    if (typeof MainLayout === 'function') {
      return <MainLayout />;
    }
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  };

  return (
    <ErrorBoundary>
      {renderMainLayout()}
    </ErrorBoundary>
  );
};

export default App;