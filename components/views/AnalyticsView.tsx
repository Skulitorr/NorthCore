import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import LoadingSpinner from '../common/LoadingSpinner';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import DoughnutChart from '../charts/DoughnutChart';
import { AnalyticsData, StaffWorkload } from '../../types';
import Icons from '../common/Icons';

interface AnalyticsViewProps {
  startDate?: Date;
  endDate?: Date;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  startDate = new Date(new Date().setDate(new Date().getDate() - 30)), 
  endDate = new Date() 
}) => {
  const { fetchAnalytics } = useApi();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startDate,
    end: endDate,
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const data = await fetchAnalytics(dateRange.start, dateRange.end);
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setDateRange({ start, end });
  };

  if (loading) {
    return <LoadingSpinner message="Loading analytics data..." />;
  }

  if (!analyticsData) {
    return (
      <div className="analytics-view">
        <div className="analytics-header">
          <h2><Icons.Chart /> Analytics Dashboard</h2>
        </div>
        {error ? (
          <div className="error-message">
            <Icons.Alert /> {error}
          </div>
        ) : (
          <div className="empty-analytics">
            <p>No analytics data available.</p>
          </div>
        )}
      </div>
    );
  }

  // Prepare data for tour popularity chart
  const tourPopularityData = {
    labels: analyticsData.tourPopularity.map((item) => item.tourName),
    datasets: [
      {
        label: 'Tours by Popularity',
        data: analyticsData.tourPopularity.map((item) => item.bookingCount),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for staff workload chart
  const workloadByRole = analyzeWorkloadByRole(analyticsData.staffWorkload);
  const workloadData = {
    labels: Object.keys(workloadByRole),
    datasets: [
      {
        label: 'Average Hours by Role',
        data: Object.values(workloadByRole),
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for booking trends
  const bookingTrendsData = {
    labels: analyticsData.bookingTrends.map((item) => formatDate(new Date(item.date))),
    datasets: [
      {
        label: 'Bookings',
        data: analyticsData.bookingTrends.map((item) => item.bookingCount),
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.4,
      },
    ],
  };

  // Prepare data for staff distribution
  const staffDistributionData = {
    labels: Object.keys(analyticsData.staffDistribution),
    datasets: [
      {
        data: Object.values(analyticsData.staffDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="analytics-view">
      <div className="analytics-header">
        <h2><Icons.Chart /> Analytics Dashboard</h2>
        <div className="date-range-selector">
          <button 
            className={`range-button ${dateRange.end.getTime() - dateRange.start.getTime() === 7 * 24 * 60 * 60 * 1000 ? 'active' : ''}`}
            onClick={() => handleDateRangeChange(7)}
          >
            Last 7 Days
          </button>
          <button 
            className={`range-button ${dateRange.end.getTime() - dateRange.start.getTime() === 30 * 24 * 60 * 60 * 1000 ? 'active' : ''}`}
            onClick={() => handleDateRangeChange(30)}
          >
            Last 30 Days
          </button>
          <button 
            className={`range-button ${dateRange.end.getTime() - dateRange.start.getTime() === 90 * 24 * 60 * 60 * 1000 ? 'active' : ''}`}
            onClick={() => handleDateRangeChange(90)}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <Icons.Alert /> {error}
        </div>
      )}

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Bookings</h3>
          <p className="summary-value">{analyticsData.totalBookings}</p>
          <p className="summary-trend">
            {analyticsData.bookingGrowth >= 0 ? '↑' : '↓'} {Math.abs(analyticsData.bookingGrowth)}% from previous period
          </p>
        </div>
        <div className="summary-card">
          <h3>Total Shifts</h3>
          <p className="summary-value">{analyticsData.totalShifts}</p>
        </div>
        <div className="summary-card">
          <h3>Staff Satisfaction</h3>
          <p className="summary-value">{analyticsData.staffSatisfaction}%</p>
        </div>
        <div className="summary-card">
          <h3>Avg. Hours per Staff</h3>
          <p className="summary-value">{analyticsData.averageHoursPerStaff.toFixed(1)}h</p>
        </div>
      </div>

      <div className="analytics-charts">
        <div className="chart-container">
          <h3><Icons.Calendar /> Booking Trends</h3>
          <LineChart 
            data={bookingTrendsData} 
            title="Booking Trends"
          />
        </div>
        
        <div className="chart-container">
          <h3><Icons.Chart /> Tour Popularity</h3>
          <BarChart 
            data={tourPopularityData} 
            title="Tour Popularity"
          />
        </div>
        
        <div className="chart-container">
          <h3><Icons.User /> Staff Distribution</h3>
          <DoughnutChart 
            data={staffDistributionData}
            title="Staff Distribution"
            width={400}
            height={400}
          />
        </div>
        
        <div className="chart-container">
          <h3><Icons.Chart /> Workload by Role</h3>
          <BarChart 
            data={workloadData}
            title="Workload by Role"
          />
        </div>
      </div>

      <div className="analytics-recommendations">
        <h3>AI Recommendations</h3>
        <ul className="recommendations-list">
          {analyticsData.recommendations.map((rec, index) => (
            <li key={index} className="recommendation-item">
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Helper functions
function analyzeWorkloadByRole(staffWorkload: StaffWorkload[]): Record<string, number> {
  const roleWorkload: Record<string, { totalHours: number; count: number }> = {};
  
  staffWorkload.forEach((staff) => {
    if (!roleWorkload[staff.role]) {
      roleWorkload[staff.role] = { totalHours: 0, count: 0 };
    }
    roleWorkload[staff.role].totalHours += staff.hoursWorked;
    roleWorkload[staff.role].count++;
  });
  
  const averageByRole: Record<string, number> = {};
  Object.entries(roleWorkload).forEach(([role, data]) => {
    averageByRole[role] = parseFloat((data.totalHours / data.count).toFixed(1));
  });
  
  return averageByRole;
}

function formatDate(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

export default AnalyticsView;
