import React, { useState, useEffect } from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Safe imports with fallbacks
let Header: any = () => <div>Header not available</div>;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [components, setComponents] = useState<{
    Header: any;
    ErrorBoundary: any;
  }>({
    Header: () => <div>Header not available</div>,
    ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>
  });

  useEffect(() => {
    const loadComponents = async () => {
      try {
        // Load ErrorBoundary first
        const ErrorBoundaryModule = await import('../components/common/ErrorBoundary');
        if (!ErrorBoundaryModule.default) {
          throw new Error('ErrorBoundary component not found in module');
        }

        // Then load Header
        const HeaderModule = await import('../components/common/Header');
        if (!HeaderModule.default) {
          throw new Error('Header component not found in module');
        }

        setComponents({
          Header: HeaderModule.default,
          ErrorBoundary: ErrorBoundaryModule.default
        });
      } catch (err) {
        console.error('Failed to load components:', err);
        setError(err instanceof Error ? err.message : 'Failed to load components');
      } finally {
        setIsLoading(false);
      }
    };

    loadComponents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
          <p className="text-gray-600">Loading components...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const { Header: HeaderComponent, ErrorBoundary: ErrorBoundaryComponent } = components;

  return (
    <ErrorBoundaryComponent>
      <div className="min-h-screen bg-gray-100">
        {typeof HeaderComponent === 'function' && (
          <HeaderComponent
            user={{
              name: 'John Doe',
              email: 'john@example.com'
            }}
            notificationsCount={0}
            onNotificationsClick={() => {}}
            onSettingsClick={() => {}}
          />
        )}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
            <p className="text-gray-600">Testing component loading...</p>
          </div>
        </div>
      </div>
    </ErrorBoundaryComponent>
  );
};

export default App;