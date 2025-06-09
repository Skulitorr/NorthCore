import React, { useState, useEffect } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';

// Default fallback components
const FallbackComponent = ({ name }: { name: string }) => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <p className="text-yellow-800">Component failed to load: {name}</p>
  </div>
);

const App: React.FC = () => {
  const [MainLayout, setMainLayout] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMainLayout = async () => {
      try {
        const module = await import('./components/layout/MainLayout');
        setMainLayout(() => module.default);
      } catch (err) {
        console.error('Failed to load MainLayout:', err);
        setError('Failed to load main application layout');
      }
    };

    loadMainLayout();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Application Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<FallbackComponent name="App" />}>
      {MainLayout ? (
        <MainLayout />
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
            <p className="text-gray-600">Loading application...</p>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default App;