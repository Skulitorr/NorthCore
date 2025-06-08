const API_CONFIG = {
  AI_CHAT_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/ai-chat',
  AI_SCHEDULE_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/ai-schedule',
  SICK_CALL_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/sick-call',
  SYSTEM_UPDATE_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/system-update',
  WEATHER_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/weather',
  ANALYTICS_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/analytics',
  STAFF_MANAGEMENT_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/staff-management',
  STAFF_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/staff',
  NOTIFICATIONS_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/notifications',
  REPORTS_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/reports',
  TOURS_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/tours',
  EXPORT_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/export',
  BACKUP_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/backup',
  SHIFT_MANAGEMENT_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/shift-management',
  REPLACEMENT_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/find-replacement',
  USER_PROFILE_ENDPOINT: 'https://skulitorr.app.n8n.cloud/webhook-test/user-profile',
  timeout: 15000
};

interface APIResponse<T = any> {
  success: boolean;
  data: T;
  mock?: boolean;
  error?: string;
  timestamp: string;
}

export const sendToAgent = async (input: any) => {
  try {
    const response = await fetch('/api/scheduler', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Agent API Error:', error);
    throw error;
  }
};

const getMockDataForEndpoint = (endpoint: string, data: any) => {
  if (endpoint.includes('weather')) {
    return {
      temperature: 8 + Math.floor(Math.random() * 5),
      description: ['Skýjað', 'Sólríkt', 'Rigning', 'Snjókoma'][Math.floor(Math.random() * 4)],
      icon: ['☁️', '☀️', '🌧️', '❄️'][Math.floor(Math.random() * 4)],
      humidity: 65 + Math.floor(Math.random() * 30),
      windSpeed: 10 + Math.floor(Math.random() * 20),
      forecast: [
        { day: 'Mán', temp: 10, icon: '☁️' },
        { day: 'Þri', temp: 8, icon: '🌧️' },
        { day: 'Mið', temp: 12, icon: '☀️' }
      ]
    };
  }
  if (endpoint.includes('analytics')) {
    return {
      efficiency: 94 + Math.floor(Math.random() * 6),
      satisfaction: 85 + Math.floor(Math.random() * 10),
      coverage: 92 + Math.floor(Math.random() * 8),
      costs: -5 - Math.floor(Math.random() * 10),
      trends: {
        weekly: [88, 90, 92, 94, 93, 95, 96],
        monthly: [90, 91, 92, 94]
      }
    };
  }
  if (endpoint.includes('ai-chat')) {
    const responses = [
      'Ég er að greina vaktaplanið. Það vantar 2 starfsmenn á kvöldvakt á morgun.',
      'Ég sé að þú ert með 32 virka starfsmenn. Mæli með að færa Söru í morgunvakt.',
      'Samkvæmt greiningu minni er skilvirkni 96% sem er frábært!',
      'Ég get búið til betra vaktaplan. Viltu að ég taki tillit til frídaga?',
      'Besta lausnin væri að færa Jakob García í kvöldvakt á þriðjudag.',
      'Ég hef fundið 3 starfsmenn sem geta tekið aukavaktir í vikunni.'
    ];
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      suggestions: ['Færa starfsmann', 'Kalla inn aukastarfsmann', 'Breyta vöktum'],
      confidence: 85 + Math.floor(Math.random() * 15)
    };
  }
  if (endpoint.includes('ai-schedule')) {
    return {
      schedule: {
        optimized: true,
        changes: Math.floor(Math.random() * 10) + 5,
        efficiency_gain: Math.floor(Math.random() * 15) + 5,
        conflicts_resolved: Math.floor(Math.random() * 5) + 1,
        suggestions: [
          { staffId: 1, from: 'morning', to: 'evening', day: 'Þriðjudagur' },
          { staffId: 4, from: 'night', to: 'morning', day: 'Miðvikudagur' }
        ]
      }
    };
  }
  if (endpoint.includes('find-replacement')) {
    return {
      replacements: [
        { id: 7, name: 'Jóhanna Guðmundsdóttir', availability: 'full', score: 95 },
        { id: 11, name: 'Nanna Pálsdóttir', availability: 'partial', score: 80 },
        { id: 10, name: 'Magnús Einarsson', availability: 'full', score: 75 }
      ]
    };
  }
  return { success: true, data: {} };
};

export const apiCall = async <T = any>(endpoint: string, data: any = {}, method = 'POST'): Promise<APIResponse<T>> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  try {
    console.log(`📡 API Call to ${endpoint}`, {
      method,
      data,
      timestamp: new Date().toISOString()
    });
    
    clearTimeout(timeoutId);
    
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    const response: APIResponse<T> = {
      success: true,
      data: getMockDataForEndpoint(endpoint, data) as T,
      mock: true,
      timestamp: new Date().toISOString()
    };
    
    console.log(`✅ API Response from ${endpoint}`, response);
    
    return response;
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`❌ API Error [${endpoint}]:`, error);
    
    return { 
      success: true, 
      data: getMockDataForEndpoint(endpoint, data) as T,
      mock: true,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};

export { API_CONFIG };
