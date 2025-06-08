import React, { useState } from 'react';
import Icons from '../common/Icons';
import { UserProfile } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile | null;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, userProfile }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      language: 'is',
      theme: 'light',
      notifications: true,
      autoSave: true,
      confirmChanges: true,
    },
    schedule: {
      defaultView: 'week',
      workingHours: {
        start: '08:00',
        end: '17:00',
      },
      weekends: true,
      showHolidays: true,
      minRestBetweenShifts: 11,
    },
    ai: {
      suggestions: true,
      autoSchedule: false,
      optimizationPriority: 'balanced',
      respectPreferences: true,
      considerHistory: true,
      maxConsecutiveWorkDays: 5,
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
      emailAddress: 'user@example.com',
      phoneNumber: '',
      notifyBeforeShift: 2, // hours
      notifyScheduleChanges: true,
      notifyStaffChanges: true,
    },
    export: {
      defaultFormat: 'pdf',
      includeMetrics: true,
      colorCoded: true,
      landscape: true,
    }
  });

  const handleChange = (section: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleNestedChange = (section: string, parent: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parent]: {
          ...prev[section as keyof typeof prev][parent as any],
          [setting]: value
        }
      }
    }));
  };

  const saveSettings = () => {
    // Here you would typically save to API or localStorage
    localStorage.setItem('vaktaiSettings', JSON.stringify(settings));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn no-print" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden shadow-2xl transform animate-scaleIn" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <Icons.Settings className="w-7 h-7 mr-3 text-blue-600" />
            Stillingar
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-all">
            <Icons.X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[70vh]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <nav className="space-y-1">
              {[
                { id: 'general', label: 'Almennt', icon: <Icons.Home className="w-5 h-5" /> },
                { id: 'schedule', label: 'Vaktaplan', icon: <Icons.Calendar className="w-5 h-5" /> },
                { id: 'ai', label: 'Gervigreind', icon: <Icons.Brain className="w-5 h-5" /> },
                { id: 'notifications', label: 'Tilkynningar', icon: <Icons.Bell className="w-5 h-5" /> },
                { id: 'export', label: 'Útflutningur', icon: <Icons.Download className="w-5 h-5" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`flex items-center w-full px-3 py-3 rounded-lg transition-all ${
                    activeTab === tab.id 
                      ? 'bg-blue-100 text-blue-800 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="mr-3 text-blue-600">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Almennar stillingar</h4>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tungumál</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settings.general.language}
                      onChange={(e) => handleChange('general', 'language', e.target.value)}
                    >
                      <option value="is">Íslenska</option>
                      <option value="en">English</option>
                      <option value="da">Dansk</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Þema</label>
                    <div className="flex space-x-4">
                      {['light', 'dark', 'system'].map(theme => (
                        <div key={theme} className="flex items-center">
                          <input 
                            type="radio" 
                            id={`theme-${theme}`}
                            name="theme"
                            value={theme}
                            checked={settings.general.theme === theme}
                            onChange={() => handleChange('general', 'theme', theme)}
                            className="mr-2"
                          />
                          <label htmlFor={`theme-${theme}`} className="text-sm text-gray-700">
                            {theme === 'light' && 'Ljóst'}
                            {theme === 'dark' && 'Dökkt'}
                            {theme === 'system' && 'Fylgja kerfi'}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="notifications"
                        checked={settings.general.notifications}
                        onChange={(e) => handleChange('general', 'notifications', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="notifications" className="text-sm text-gray-700">
                        Leyfa tilkynningar
                      </label>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="autoSave"
                        checked={settings.general.autoSave}
                        onChange={(e) => handleChange('general', 'autoSave', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="autoSave" className="text-sm text-gray-700">
                        Vista breytingar sjálfkrafa
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="confirmChanges"
                        checked={settings.general.confirmChanges}
                        onChange={(e) => handleChange('general', 'confirmChanges', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="confirmChanges" className="text-sm text-gray-700">
                        Staðfesta breytingar áður en þær eru vistaðar
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Stillingar vaktaplans</h4>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sjálfgefið útlit</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settings.schedule.defaultView}
                      onChange={(e) => handleChange('schedule', 'defaultView', e.target.value)}
                    >
                      <option value="day">Dagur</option>
                      <option value="week">Vika</option>
                      <option value="month">Mánuður</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vinnustundir</label>
                    <div className="flex space-x-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Frá</label>
                        <input 
                          type="time" 
                          value={settings.schedule.workingHours.start}
                          onChange={(e) => handleNestedChange('schedule', 'workingHours', 'start', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Til</label>
                        <input 
                          type="time" 
                          value={settings.schedule.workingHours.end}
                          onChange={(e) => handleNestedChange('schedule', 'workingHours', 'end', e.target.value)}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="weekends"
                        checked={settings.schedule.weekends}
                        onChange={(e) => handleChange('schedule', 'weekends', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="weekends" className="text-sm text-gray-700">
                        Sýna helgar
                      </label>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="showHolidays"
                        checked={settings.schedule.showHolidays}
                        onChange={(e) => handleChange('schedule', 'showHolidays', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="showHolidays" className="text-sm text-gray-700">
                        Sýna frídaga
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lágmarks hvíldartími milli vakta (klst)
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      max="24"
                      value={settings.schedule.minRestBetweenShifts}
                      onChange={(e) => handleChange('schedule', 'minRestBetweenShifts', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Stillingar gervigreindar</h4>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="suggestions"
                        checked={settings.ai.suggestions}
                        onChange={(e) => handleChange('ai', 'suggestions', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="suggestions" className="text-sm text-gray-700">
                        Sýna AI tillögur
                      </label>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="autoSchedule"
                        checked={settings.ai.autoSchedule}
                        onChange={(e) => handleChange('ai', 'autoSchedule', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="autoSchedule" className="text-sm text-gray-700">
                        Leyfa sjálfvirka skipulagningu
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Forgangsröðun bestunnar</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settings.ai.optimizationPriority}
                      onChange={(e) => handleChange('ai', 'optimizationPriority', e.target.value)}
                    >
                      <option value="staff">Starfsfólk (vellíðan)</option>
                      <option value="balanced">Jafnvægi</option>
                      <option value="efficiency">Skilvirkni (kostnaður)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="respectPreferences"
                        checked={settings.ai.respectPreferences}
                        onChange={(e) => handleChange('ai', 'respectPreferences', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="respectPreferences" className="text-sm text-gray-700">
                        Virða óskir starfsfólks
                      </label>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="considerHistory"
                        checked={settings.ai.considerHistory}
                        onChange={(e) => handleChange('ai', 'considerHistory', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="considerHistory" className="text-sm text-gray-700">
                        Taka tillit til sögulegra vakta
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hámark samfelldra vinnudaga
                    </label>
                    <input 
                      type="number" 
                      min="1"
                      max="14"
                      value={settings.ai.maxConsecutiveWorkDays}
                      onChange={(e) => handleChange('ai', 'maxConsecutiveWorkDays', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Stillingar tilkynninga</h4>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tilkynningaleiðir</label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="emailNotif"
                          checked={settings.notifications.email}
                          onChange={(e) => handleChange('notifications', 'email', e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="emailNotif" className="text-sm text-gray-700">
                          Tölvupóstur
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="pushNotif"
                          checked={settings.notifications.push}
                          onChange={(e) => handleChange('notifications', 'push', e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="pushNotif" className="text-sm text-gray-700">
                          Tilkynningar í vafra/appi
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="smsNotif"
                          checked={settings.notifications.sms}
                          onChange={(e) => handleChange('notifications', 'sms', e.target.checked)}
                          className="mr-2 h-4 w-4"
                        />
                        <label htmlFor="smsNotif" className="text-sm text-gray-700">
                          SMS
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Netfang</label>
                    <input 
                      type="email" 
                      value={settings.notifications.emailAddress}
                      onChange={(e) => handleChange('notifications', 'emailAddress', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="notandi@fyrirtæki.is"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Símanúmer</label>
                    <input 
                      type="tel" 
                      value={settings.notifications.phoneNumber}
                      onChange={(e) => handleChange('notifications', 'phoneNumber', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="8001234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tilkynna fyrir vakt (klst)
                    </label>
                    <input 
                      type="number" 
                      min="0"
                      max="48"
                      value={settings.notifications.notifyBeforeShift}
                      onChange={(e) => handleChange('notifications', 'notifyBeforeShift', parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="notifyScheduleChanges"
                        checked={settings.notifications.notifyScheduleChanges}
                        onChange={(e) => handleChange('notifications', 'notifyScheduleChanges', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="notifyScheduleChanges" className="text-sm text-gray-700">
                        Tilkynna um breytingar á vaktaplani
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="notifyStaffChanges"
                        checked={settings.notifications.notifyStaffChanges}
                        onChange={(e) => handleChange('notifications', 'notifyStaffChanges', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="notifyStaffChanges" className="text-sm text-gray-700">
                        Tilkynna um breytingar á starfsfólki
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'export' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Stillingar útflutnings</h4>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sjálfgefið útflutningssnið</label>
                    <select 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={settings.export.defaultFormat}
                      onChange={(e) => handleChange('export', 'defaultFormat', e.target.value)}
                    >
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                      <option value="ical">iCalendar</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="includeMetrics"
                        checked={settings.export.includeMetrics}
                        onChange={(e) => handleChange('export', 'includeMetrics', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="includeMetrics" className="text-sm text-gray-700">
                        Taka með tölfræði
                      </label>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox" 
                        id="colorCoded"
                        checked={settings.export.colorCoded}
                        onChange={(e) => handleChange('export', 'colorCoded', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="colorCoded" className="text-sm text-gray-700">
                        Nota litakóðun
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="landscape"
                        checked={settings.export.landscape}
                        onChange={(e) => handleChange('export', 'landscape', e.target.checked)}
                        className="mr-2 h-4 w-4"
                      />
                      <label htmlFor="landscape" className="text-sm text-gray-700">
                        Prentun í landslagssniði
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-4 bg-gray-50">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all font-medium"
          >
            Hætta við
          </button>
          <button 
            onClick={saveSettings}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium"
          >
            Vista stillingar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
