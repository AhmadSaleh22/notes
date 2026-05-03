import { request } from 'undici';
import { env } from '../config/env';

export class HttpError extends Error {
  constructor(public status: number, public url: string, body: string) {
    super(`HTTP ${status} ${url} :: ${body.slice(0, 200)}`);
  }
}

/**
 * Tiny JSON GET wrapper with timeout + structured errors.
 * 404 returns null so callers can treat "not found" as a normal case.
 */
export async function getJson<T>(url: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.ingest.httpTimeoutMs);
  try {
    const res = await request(url, {
      signal: controller.signal,
      headers: { accept: 'application/json', 'user-agent': 'supply-chain-graph/0.1' },
    });
    if (res.statusCode === 404) return null;
    const text = await res.body.text();
    if (res.statusCode >= 400) throw new HttpError(res.statusCode, url, text);
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.ingest.httpTimeoutMs);
  try {
    const res = await request(url, {
      method: 'POST',
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'user-agent': 'supply-chain-graph/0.1',
      },
      body: JSON.stringify(body),
    });
    const text = await res.body.text();
    if (res.statusCode >= 400) throw new HttpError(res.statusCode, url, text);
    return JSON.parse(text) as T;
  } finally {
    clearTimeout(timer);
  }
}
