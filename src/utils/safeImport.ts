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
        // Log the module for debugging
        console.log(`Loading ${componentName}:`, module);

        if (!module) {
          console.error(`Failed to import ${componentName}: Module is undefined`);
          return { default: () => fallback || <div>Failed to load {componentName}</div> };
        }

        // Try to get the component from various possible locations
        const Component = module.default || module[componentName] || module[`${componentName}Component`];
        
        if (!Component) {
          console.error(`Failed to import ${componentName}: No valid export found. Available exports:`, Object.keys(module));
          return { default: () => fallback || <div>Failed to load {componentName}</div> };
        }

        // Log successful import
        console.log(`Successfully loaded ${componentName}`);
        return { default: Component };
      })
      .catch((error) => {
        console.error(`Error importing ${componentName}:`, error);
        return { default: () => fallback || <div>Failed to load {componentName}</div> };
      })
  );
}; 