import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Safe imports with fallbacks
let MainLayout: any = () => (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
      <p className="text-gray-600">Application is currently unavailable</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMainLayout = async () => {
      try {
        const MainLayoutModule = await import('../components/layout/MainLayout');
        MainLayout = MainLayoutModule.default;
      } catch (err) {
        console.error('Failed to load MainLayout:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMainLayout();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      {typeof MainLayout === 'function' && <MainLayout />}
    </ErrorBoundary>
  );
};

export default App;