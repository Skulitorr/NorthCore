import React, { useState, useEffect } from 'react';
import { X } from './Icons';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
  actions?: ToastAction[];
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type, 
  onClose, 
  autoClose = true, 
  duration = 4000, 
  actions = [] 
}) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [onClose, autoClose, duration]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'loading': return '⏳';
      default: return '📝';
    }
  };

  const getStyles = () => {
    const base = `fixed bottom-4 right-4 max-w-sm rounded-xl shadow-2xl z-50 border text-white p-4 transform transition-all duration-500 ${
      isClosing ? 'animate-slideOutDown' : 'animate-slideInUp'
    }`;
    
    switch (type) {
      case 'success': return `${base} bg-gradient-to-r from-green-500 to-emerald-600 border-green-400`;
      case 'error': return `${base} bg-gradient-to-r from-red-500 to-red-600 border-red-400`;
      case 'warning': return `${base} bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-400`;
      case 'info': return `${base} bg-gradient-to-r from-blue-500 to-blue-600 border-blue-400`;
      case 'loading': return `${base} bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400`;
      default: return `${base} bg-gradient-to-r from-gray-500 to-gray-600 border-gray-400`;
    }
  };

  return (
    <>
      <div className={getStyles()}>
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <span className="text-xl mr-3 mt-0.5 animate-bounce">{getIcon()}</span>
            <div className="flex-1">
              <p className="text-sm font-bold leading-5">{message}</p>
              {actions.length > 0 && (
                <div className="flex space-x-2 mt-3">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.onClick}
                      className="px-3 py-1 bg-white bg-opacity-20 rounded-lg text-xs font-medium hover:bg-opacity-30 transition-all transform hover:scale-105"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={() => {
              setIsClosing(true);
              setTimeout(onClose, 300);
            }} 
            className="ml-3 text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {autoClose && (
          <div className="mt-2 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all"
              style={{
                width: '0%',
                animation: `progress ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes progress {
          to { width: 100%; }
        }
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideOutDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Toast;
