// In a real application, use Vercel KV (Redis), MongoDB, or Postgres.
// This in-memory map will reset when the serverless function cold starts.
export const scriptStore = new Map<string, string>();

// Pre-populate a demo script
scriptStore.set('demo', "-- This is a raw demo script\nprint('Hello World')");
