import React, { useState, useEffect } from 'react';
import Icons from '../common/Icons';
import { apiCall, API_CONFIG } from '../../lib/api';
import { NotificationItem } from '../../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  read: boolean;
  actionable: boolean;
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, notifications }) => {
  const [notificationsState, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await apiCall(API_CONFIG.NOTIFICATIONS_ENDPOINT);
      if (response.success) {
        // Mock data for now
        setNotifications([
          {
            id: 1,
            title: 'Vaktabreytingar',
            message: 'Breytingar á vaktaplani fyrir viku 22 hafa verið samþykktar',
            type: 'success',
            time: new Date(Date.now() - 30 * 60000).toISOString(),
            read: false,
            actionable: true,
            actions: [
              { label: 'Skoða breytingar', onClick: () => console.log('Viewing changes') }
            ]
          },
          {
            id: 2,
            title: 'Veikindatilkynning',
            message: 'Elín Jónsdóttir hefur tilkynnt veikindi fyrir morgundaginn',
            type: 'warning',
            time: new Date(Date.now() - 2 * 3600000).toISOString(),
            read: true,
            actionable: true,
            actions: [
              { label: 'Finna staðgengil', onClick: () => console.log('Finding replacement') }
            ]
          },
          {
            id: 3,
            title: 'Kerfisuppfærsla',
            message: 'VaktAI 3.0 hefur verið uppfært með nýjum eiginleikum',
            type: 'info',
            time: new Date(Date.now() - 24 * 3600000).toISOString(),
            read: true,
            actionable: false
          },
          {
            id: 4,
            title: 'AI greining',
            message: 'Gervigreind hefur greint mögulega bætingu á vöktum',
            type: 'info',
            time: new Date(Date.now() - 4 * 3600000).toISOString(),
            read: false,
            actionable: true,
            actions: [
              { label: 'Skoða tillögur', onClick: () => console.log('Viewing suggestions') }
            ]
          },
          {
            id: 5,
            title: 'Villa í kerfi',
            message: 'Upp kom villa við að bæta við vakt fyrir Kristján Þorvaldsson',
            type: 'error',
            time: new Date(Date.now() - 1 * 3600000).toISOString(),
            read: false,
            actionable: false
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = async (id: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = async () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return '💡';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} mín síðan`;
    } else if (diffMins < 24 * 60) {
      return `${Math.floor(diffMins / 60)} klst síðan`;
    } else {
      return date.toLocaleDateString('is-IS', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notificationsState 
    : filter === 'unread' 
      ? notificationsState.filter(n => !n.read)
      : notificationsState.filter(n => n.type === filter);

  const unreadCount = notificationsState.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn no-print" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Icons.Bell className="w-7 h-7 mr-3 text-blue-600" />
            Tilkynningar
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">{unreadCount}</span>
            )}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex space-x-2">
            {['all', 'unread', 'info', 'warning', 'success', 'error'].map(filterType => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  filter === filterType
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterType === 'all' && 'Allt'}
                {filterType === 'unread' && 'Ólesið'}
                {filterType === 'info' && '💡 Upplýsingar'}
                {filterType === 'warning' && '⚠️ Viðvaranir'}
                {filterType === 'success' && '✅ Samþykkt'}
                {filterType === 'error' && '❌ Villur'}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={markAllAsRead}
              className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all"
            >
              <Icons.Check className="w-4 h-4 inline mr-1" />
              Merkja allt lesið
            </button>
            <button
              onClick={clearAllNotifications}
              className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
            >
              <Icons.Trash className="w-4 h-4 inline mr-1" />
              Hreinsa allt
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center p-12">
              <div className="text-6xl mb-4">🔔</div>
              <p className="text-xl font-semibold text-gray-600 mb-2">Engar tilkynningar!</p>
              <p className="text-gray-500">Þú ert alveg með puttann á púlsinum.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => (
                <li 
                  key={notification.id}
                  className={`p-5 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="flex space-x-3">
                      <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 flex items-center">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">Nýtt</span>
                          )}
                        </h4>
                        <p className="text-gray-600 text-sm">{notification.message}</p>
                        <p className="text-gray-400 text-xs mt-1">{formatTime(notification.time)}</p>
                        
                        {notification.actionable && notification.actions && (
                          <div className="mt-2 flex space-x-2">
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={action.onClick}
                                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium hover:bg-blue-100 transition-all"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"
                          title="Merkja sem lesið"
                        >
                          <Icons.Check className="w-5 h-5" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
                        title="Eyða tilkynningu"
                      >
                        <Icons.Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <span className="text-sm text-gray-500">Tilkynningar eru geymdar í 30 daga</span>
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
          >
            Loka
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
