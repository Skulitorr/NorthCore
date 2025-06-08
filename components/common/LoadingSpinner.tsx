import React, { useState, useEffect } from 'react';
import Icons from './Icons';

interface LoadingSpinnerProps {
  message?: string;
  progress?: number;
  subMessage?: string;
  isVisible?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "AI í vinnslu...",
  progress = 0,
  subMessage = "",
  isVisible = true
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center shadow-2xl border transform animate-scaleIn">
        <div className="relative mb-8">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icons.BrainIcon className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center justify-center">
          <span className="ml-2">VaktAI Gervigreind</span>
        </h3>
        <p className="text-gray-600 text-base mb-2 font-medium">{message}{dots}</p>
        {subMessage && <p className="text-gray-500 text-sm mb-4">{subMessage}</p>}
        
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 shadow-sm relative overflow-hidden"
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-white opacity-30 animate-shimmer"></div>
            </div>
          </div>
        )}
        
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        <p className="text-xs text-gray-400 mt-4">Vinnsla gagna með fullkominni öryggi 🔒</p>
      </div>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
