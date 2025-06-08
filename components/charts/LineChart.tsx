import React, { useState } from 'react';
import { ChartData } from '../../types';

interface LineChartProps {
  data: ChartData;
  className?: string;
  title: string;
  onPointClick?: (label: string, value: number, index: number) => void;
  animated?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  className, 
  title, 
  onPointClick, 
  animated = true 
}) => {
  const maxValue = Math.max(...data.datasets[0].data);
  const minValue = Math.min(...data.datasets[0].data);
  const range = maxValue - minValue || 1;
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  
  const points = data.datasets[0].data.map((value, index) => ({
    x: 60 + (index * 70),
    y: 200 - ((value - minValue) / range) * 140
  }));
  
  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className={className}>
      <h4 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
        <span className="mr-2">📈</span>
        {title}
      </h4>
      <svg viewBox="0 0 500 300" className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <path 
          d={`${pathData} L ${points[points.length-1].x} 250 L ${points[0].x} 250 Z`} 
          fill="url(#areaGradient)"
          opacity={animated ? "0" : "1"}
        >
          {animated && (
            <animate 
              attributeName="opacity" 
              from="0" 
              to="1" 
              dur="1s" 
              begin="0.5s"
              fill="freeze"
            />
          )}
        </path>
        <path 
          d={pathData} 
          stroke="url(#lineGradient)" 
          strokeWidth="3" 
          fill="none"
          strokeDasharray={animated ? "1000" : "0"}
          strokeDashoffset={animated ? "1000" : "0"}
        >
          {animated && (
            <animate 
              attributeName="stroke-dashoffset" 
              from="1000" 
              to="0" 
              dur="2s" 
              fill="freeze"
            />
          )}
        </path>
        
        {points.map((point, index) => (
          <g 
            key={index} 
            className="cursor-pointer" 
            onClick={() => onPointClick && onPointClick(data.labels[index], data.datasets[0].data[index], index)}
            onMouseEnter={() => setHoveredPoint(index)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <circle 
              cx={point.x} 
              cy={point.y} 
              r={animated ? "0" : "6"} 
              fill="white" 
              stroke="url(#lineGradient)" 
              strokeWidth="3" 
              className={`transition-all duration-300 ${hoveredPoint === index ? 'r-8' : ''}`}
            >
              {animated && (
                <animate 
                  attributeName="r" 
                  from="0" 
                  to="6" 
                  dur="0.5s" 
                  begin={`${index * 0.2 + 1}s`}
                  fill="freeze"
                />
              )}
            </circle>
            {hoveredPoint === index && (
              <>
                <rect
                  x={point.x - 30}
                  y={point.y - 40}
                  width="60"
                  height="25"
                  fill="rgba(0,0,0,0.8)"
                  rx="4"
                  className="animate-fadeIn"
                />
                <text 
                  x={point.x} 
                  y={point.y - 22} 
                  textAnchor="middle" 
                  className="text-xs fill-white animate-fadeIn"
                >
                  {data.datasets[0].data[index]}%
                </text>
              </>
            )}
            <text x={point.x} y={270} textAnchor="middle" className="text-sm fill-gray-600 font-medium">{data.labels[index]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default LineChart;
