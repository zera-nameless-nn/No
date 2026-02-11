import type { VercelRequest, VercelResponse } from '@vercel/node';
import { scriptStore } from './store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { content, alias, redeemCode } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  let finalId = '';

  // Handle Custom Alias Logic
  if (alias && alias.trim() !== '') {
    // Verify Redeem Code
    if (redeemCode !== 'NameLessFree') {
      return res.status(403).json({ error: 'Invalid redeem code for custom alias.' });
    }
    
    // Check if alias is already taken
    if (scriptStore.has(alias)) {
      return res.status(409).json({ error: 'Alias already exists.' });
    }

    // Basic validation for alias (alphanumeric and hyphens only)
    const validAliasRegex = /^[a-zA-Z0-9-]+$/;
    if (!validAliasRegex.test(alias)) {
      return res.status(400).json({ error: 'Alias contains invalid characters.' });
    }

    finalId = alias;
  } else {
    // Generate Random ID (xxxxx-xxxxx-xxxxx format)
    const generateSegment = () => Math.random().toString(36).substring(2, 7);
    finalId = `${generateSegment()}-${generateSegment()}-${generateSegment()}`;
  }

  // Save to "Database"
  scriptStore.set(finalId, content);

  return res.status(200).json({ 
    success: true, 
    id: finalId,
    url: `/api/script/${finalId}` 
  });
    }
