import React from 'react';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Safe imports with fallbacks
let MainLayout: any;
try {
  MainLayout = require('../components/layout/MainLayout').default;
} catch (err) {
  console.error("Failed to import MainLayout:", err);
  MainLayout = () => (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">VaktAI</h1>
        <p className="text-gray-600">Application is currently unavailable</p>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      {typeof MainLayout === 'function' && <MainLayout />}
    </ErrorBoundary>
  );
};

export default App;