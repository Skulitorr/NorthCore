import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'https://skulitorr.app.n8n.cloud/webhook/scheduler';
    
    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    console.error('n8n webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to connect to scheduling service' 
    });
  }
}
