import { FaCalendarAlt, FaEdit, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import React from 'react';

export const CalendarIcon = FaCalendarAlt;
export const EditIcon = FaEdit;
export const UserIcon = FaUser;
export const AlertIcon = FaExclamationTriangle;

export const X = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
); 