import React from 'react';
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiEdit,
  FiPlus,
  FiAlertCircle,
  FiX,
  FiCheck,
  FiSettings,
  FiBell,
  FiMap,
  FiBarChart2,
  FiStar,
  FiPhone,
  FiMail,
  FiUserPlus,
  FiActivity,
  FiSend,
  FiSearch
} from 'react-icons/fi';

interface IconProps {
  className?: string;
}

const Icons = {
  Calendar: ({ className }: IconProps) => <FiCalendar className={className} />,
  Clock: ({ className }: IconProps) => <FiClock className={className} />,
  User: ({ className }: IconProps) => <FiUser className={className} />,
  Edit: ({ className }: IconProps) => <FiEdit className={className} />,
  Plus: ({ className }: IconProps) => <FiPlus className={className} />,
  Alert: ({ className }: IconProps) => <FiAlertCircle className={className} />,
  X: ({ className }: IconProps) => <FiX className={className} />,
  Check: ({ className }: IconProps) => <FiCheck className={className} />,
  Settings: ({ className }: IconProps) => <FiSettings className={className} />,
  Bell: ({ className }: IconProps) => <FiBell className={className} />,
  Map: ({ className }: IconProps) => <FiMap className={className} />,
  Chart: ({ className }: IconProps) => <FiBarChart2 className={className} />,
  Star: ({ className }: IconProps) => <FiStar className={className} />,
  Phone: ({ className }: IconProps) => <FiPhone className={className} />,
  Mail: ({ className }: IconProps) => <FiMail className={className} />,
  UserPlus: ({ className }: IconProps) => <FiUserPlus className={className} />,
  Brain: ({ className }: IconProps) => <FiActivity className={className} />,
  Send: ({ className }: IconProps) => <FiSend className={className} />,
  Search: ({ className }: IconProps) => <FiSearch className={className} />
};

export default Icons; 