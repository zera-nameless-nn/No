import type { VercelRequest, VercelResponse } from '@vercel/node';
import { scriptStore } from '../_store';

export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { id } = req.query;

    if (!id || Array.isArray(id)) {
      return res.status(400).send('Invalid ID');
    }

    const content = scriptStore.get(id);

    if (!content) {
      return res.status(404).send('Script not found or expired (Serverless memory reset).');
    }

    // QUAN TRỌNG: Sử dụng text/plain để đảm bảo nội dung là văn bản thô tuyệt đối
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    
    // Header này giúp trình duyệt hiểu rằng nếu tải về thì hãy đặt tên là {id}.txt
    // "inline" giúp nội dung vẫn hiển thị trên trình duyệt thay vì bị ép tải xuống ngay lập tức
    res.setHeader('Content-Disposition', `inline; filename="${id}.txt"`);
    
    // Không lưu cache để đảm bảo script luôn mới nhất
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return res.status(200).send(content);
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
}
