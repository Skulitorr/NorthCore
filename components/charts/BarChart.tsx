import React, { useState } from 'react';
import { ChartData } from '../../types';

interface BarChartProps {
  data: ChartData;
  className?: string;
  title: string;
  onBarClick?: (label: string, value: number, index: number) => void;
  animated?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ 
  data, 
  className, 
  title, 
  onBarClick, 
  animated = true 
}) => {
  const maxValue = Math.max(...data.datasets[0].data);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  return (
    <div className={className}>
      <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">📊</span>
        {title}
      </h4>
      <svg viewBox="0 0 500 300" className="w-full h-full">
        <defs>
          <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="barGradHover" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" stopOpacity="0.3"/>
          </filter>
        </defs>
        {data.labels.map((label, index) => {
          const height = (data.datasets[0].data[index] / maxValue) * 180;
          const x = 60 + (index * 55);
          const y = 220 - height;
          const isHovered = hoveredBar === index;
          
          return (
            <g 
              key={label} 
              className="cursor-pointer" 
              onClick={() => onBarClick && onBarClick(label, data.datasets[0].data[index], index)}
              onMouseEnter={() => setHoveredBar(index)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              <rect 
                x={x} 
                y={220} 
                width="35" 
                height="0" 
                fill={isHovered ? "url(#barGradHover)" : "url(#barGrad)"} 
                rx="4" 
                filter="url(#shadow)"
                className="transition-all duration-300"
                style={{
                  transform: isHovered ? 'scaleY(1.05)' : 'scaleY(1)',
                  transformOrigin: 'bottom'
                }}
              >
                {animated && (
                  <>
                    <animate 
                      attributeName="height" 
                      from="0" 
                      to={height} 
                      dur="0.8s" 
                      begin={`${index * 0.1}s`}
                      fill="freeze"
                    />
                    <animate 
                      attributeName="y" 
                      from="220" 
                      to={y} 
                      dur="0.8s" 
                      begin={`${index * 0.1}s`}
                      fill="freeze"
                    />
                  </>
                )}
              </rect>
              <text x={x + 17} y={250} textAnchor="middle" className="text-sm fill-gray-600 font-medium">{label}</text>
              <text 
                x={x + 17} 
                y={y - 8} 
                textAnchor="middle" 
                className={`text-sm fill-gray-800 font-bold transition-opacity duration-300 ${
                  isHovered ? 'opacity-100' : animated ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {data.datasets[0].data[index]}
                {animated && (
                  <animate 
                    attributeName="opacity" 
                    from="0" 
                    to="1" 
                    dur="0.3s" 
                    begin={`${index * 0.1 + 0.8}s`}
                    fill="freeze"
                  />
                )}
              </text>
              {isHovered && (
                <rect
                  x={x - 10}
                  y={y - 40}
                  width="55"
                  height="25"
                  fill="rgba(0,0,0,0.8)"
                  rx="4"
                  className="animate-fadeIn"
                />
              )}
              {isHovered && (
                <text 
                  x={x + 17} 
                  y={y - 22} 
                  textAnchor="middle" 
                  className="text-xs fill-white animate-fadeIn"
                >
                  {data.datasets[0].data[index]} vaktar
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;
