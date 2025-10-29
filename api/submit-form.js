export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    const enrichedData = {
      ...formData,
      submittedAt: new Date().toISOString(),
      source: 'webflow'
    };

    console.log('Form received:', enrichedData.formType);

    const zohoResponse = await fetch(process.env.ZOHO_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedData)
    });

    if (!zohoResponse.ok) {
      return res.status(500).json({ success: false, error: 'Failed' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, error: 'Error' });
  }
}
// Check if current URL is the Vercel proxy and redirect back
if (window.location.href === 'https://pazcare-bridge-pz.vercel.app/api/submit-form') {
  window.history.back();
}
