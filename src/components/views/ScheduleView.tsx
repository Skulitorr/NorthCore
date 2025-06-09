import React from 'react';
import { Staff } from '../../types';

interface ScheduleViewProps {
  date: Date;
  onDateChange: (date: Date) => void;
  staff: Staff[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({
  date,
  onDateChange,
  staff
}) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Schedule</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onDateChange(new Date(date.setDate(date.getDate() - 1)))}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              Previous
            </button>
            <span className="text-gray-700">
              {date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button
              onClick={() => onDateChange(new Date(date.setDate(date.getDate() + 1)))}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              {staff.map((member) => (
                <th
                  key={member.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {member.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hours.map((hour) => (
              <tr key={hour}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {`${hour.toString().padStart(2, '0')}:00`}
                </td>
                {staff.map((member) => (
                  <td
                    key={`${member.id}-${hour}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {member.availability[daysOfWeek[date.getDay()]] ? 'Available' : 'Unavailable'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleView; 