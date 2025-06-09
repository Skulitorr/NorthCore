import React from 'react';

const AnalyticsView: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Sample Analytics Cards */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-900">Total Tours</h3>
            <p className="text-3xl font-bold text-blue-700">0</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-green-900">Active Staff</h3>
            <p className="text-3xl font-bold text-green-700">0</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-900">Revenue</h3>
            <p className="text-3xl font-bold text-purple-700">$0</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-900">Bookings</h3>
            <p className="text-3xl font-bold text-yellow-700">0</p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-center">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView; 