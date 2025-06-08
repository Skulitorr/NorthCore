import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { ChartData } from '../../types';

interface DoughnutChartProps {
  data: ChartData;
  options?: Chart.ChartOptions;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  options = {},
  width = 300,
  height = 300,
  className = '',
  title,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Default options
      const defaultOptions: Chart.ChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            position: 'right' as const,
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 10,
            titleFont: {
              size: 14,
            },
            bodyFont: {
              size: 13,
            },
            displayColors: true,
            callbacks: {
              label: function(context: Chart.TooltipItem<'doughnut'>) {
                const label = context.label || '';
                const value = context.raw as number || 0;
                const total = context.chart.data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          },
          title: title ? {
            display: true,
            text: title,
            font: {
              size: 16,
              weight: 'bold',
            },
            padding: {
              top: 10,
              bottom: 20,
            },
          } : undefined,
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1000,
        },
      };

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: data,
          options: { ...defaultOptions, ...options },
        });
      }
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, options, title]);

  return (
    <div className={`chart-container ${className}`} style={{ width, height, position: 'relative' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default DoughnutChart;
