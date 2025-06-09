import React, { Suspense } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';
import { safeImport } from './utils/safeImport';

// Default fallback components
const FallbackComponent = ({ name }: { name: string }) => (
  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
    <p className="text-yellow-800">Component failed to load: {name}</p>
  </div>
);

// Safe dynamic import for MainLayout
const MainLayout = safeImport<React.ComponentType>(
  () => import('./components/layout/MainLayout'),
  { componentName: 'MainLayout' }
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<FallbackComponent name="MainLayout" />}>
        <MainLayout />
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;