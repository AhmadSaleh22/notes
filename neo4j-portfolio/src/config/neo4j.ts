import neo4j, { Driver, Session, SessionConfig } from 'neo4j-driver';
import { env } from './env';

let driver: Driver | undefined;

/**
 * Lazily build the singleton driver. The driver is connection-pooled and
 * thread-safe, so we want exactly one per process.
 */
export function getDriver(): Driver {
  if (driver) return driver;
  driver = neo4j.driver(
    env.neo4j.uri,
    neo4j.auth.basic(env.neo4j.user, env.neo4j.password),
    {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 30_000,
      connectionTimeout: 10_000,
      logging: { level: 'warn', logger: (level, msg) => console.error(`[neo4j:${level}] ${msg}`) },
    },
  );
  return driver;
}

export async function verifyConnectivity(): Promise<void> {
  await getDriver().verifyConnectivity({ database: env.neo4j.database });
}

export async function closeDriver(): Promise<void> {
  if (driver) {
    await driver.close();
    driver = undefined;
  }
}

export function openSession(mode: 'read' | 'write' = 'write'): Session {
  const config: SessionConfig = {
    database: env.neo4j.database,
    defaultAccessMode: mode === 'read' ? neo4j.session.READ : neo4j.session.WRITE,
  };
  return getDriver().session(config);
}

/**
 * Run a unit of work inside a managed session — caller never has to remember to close.
 * Uses driver-managed transactions for automatic retry on transient errors.
 */
export async function withSession<T>(
  fn: (session: Session) => Promise<T>,
  mode: 'read' | 'write' = 'write',
): Promise<T> {
  const session = openSession(mode);
  try {
    return await fn(session);
  } finally {
    await session.close();
  }
}
