import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Buffer } from 'buffer';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Robust body parsing: sometimes Vercel doesn't parse JSON automatically if headers are missed
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON body format' });
      }
    }

    if (!body) {
      return res.status(400).json({ error: 'No request body provided' });
    }

    const { content, alias, redeemCode } = body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // STATELESS STORAGE: Encode content into the ID using Base64URL.
    // We use the global Buffer (available in Node environment) to avoid import issues.
    let finalId = '';
    const base64Content = Buffer.from(content).toString('base64url');

    if (alias && alias.trim() !== '') {
      if (redeemCode !== 'NameLessFree') {
        return res.status(403).json({ error: 'Invalid redeem code for custom alias.' });
      }
      finalId = `${alias}~${base64Content}`;
    } else {
      finalId = base64Content;
    }

    if (finalId.length > 4000) {
      return res.status(413).json({ error: 'Script is too large for this free demo.' });
    }

    return res.status(200).json({ 
      success: true, 
      id: finalId, 
      url: `/api/script/${finalId}` 
    });

  } catch (error: any) {
    console.error("Save API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
