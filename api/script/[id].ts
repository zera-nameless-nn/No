import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Buffer } from 'buffer';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).send('Invalid ID');
    }

    let content = '';
    const idStr = id as string;

    // Decode logic
    if (idStr.includes('~')) {
      const parts = idStr.split('~');
      if (parts.length >= 2) {
        content = Buffer.from(parts[1], 'base64url').toString('utf-8');
      }
    } else {
      try {
        content = Buffer.from(idStr, 'base64url').toString('utf-8');
      } catch (e) {
        content = "-- Error decoding script";
      }
    }

    if (!content) {
      return res.status(404).send('Script not found.');
    }

    // Response headers for raw text
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="script.lua"`);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    
    return res.status(200).send(content);
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
}
