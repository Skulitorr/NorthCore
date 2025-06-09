import React from 'react';

interface SafeImportOptions {
  fallback?: React.ReactNode;
  componentName: string;
}

export const safeImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T } | { [key: string]: T }>,
  options: SafeImportOptions
): React.LazyExoticComponent<T> => {
  const { fallback, componentName } = options;
  
  return React.lazy(() =>
    importFn()
      .then((module) => {
        if (!module) {
          console.error(`Failed to import ${componentName}: Module is undefined`);
          return { default: () => fallback || <div>Failed to load {componentName}</div> };
        }

        const Component = module.default || module[componentName];
        if (!Component) {
          console.error(`Failed to import ${componentName}: No default export or named export found`);
          return { default: () => fallback || <div>Failed to load {componentName}</div> };
        }

        return { default: Component };
      })
      .catch((error) => {
        console.error(`Error importing ${componentName}:`, error);
        return { default: () => fallback || <div>Failed to load {componentName}</div> };
      })
  );
}; 