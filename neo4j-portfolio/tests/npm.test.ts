import { fetchNpmPackument } from '../src/ingest/npm';
import * as http from '../src/ingest/http';

jest.mock('../src/ingest/http');

const mockedGetJson = http.getJson as jest.MockedFunction<typeof http.getJson>;

const fixture = {
  name: 'demo-pkg',
  description: 'demo',
  homepage: 'https://example.com',
  'dist-tags': { latest: '1.1.0' },
  time: {
    '1.0.0': '2024-01-01T00:00:00Z',
    '1.1.0': '2024-06-01T00:00:00Z',
  },
  versions: {
    '1.0.0': {
      name: 'demo-pkg',
      version: '1.0.0',
      license: 'MIT',
      dependencies: { 'lib-a': '^1.0.0' },
      maintainers: [{ name: 'alice', email: 'a@x.io' }],
    },
    '1.1.0': {
      name: 'demo-pkg',
      version: '1.1.0',
      license: { type: 'MIT' },
      dependencies: { 'lib-a': '^2.0.0' },
      devDependencies: { 'lib-b': '^1.0.0' },
      maintainers: [
        { name: 'alice', email: 'a@x.io' },
        { name: 'bob' },
      ],
    },
  },
};

describe('fetchNpmPackument', () => {
  beforeEach(() => mockedGetJson.mockReset());

  it('projects packument into graph rows', async () => {
    mockedGetJson.mockResolvedValueOnce(fixture as never);
    const r = await fetchNpmPackument('demo-pkg');
    expect(r).not.toBeNull();
    expect(r!.pkg.name).toBe('demo-pkg');
    expect(r!.versions).toHaveLength(2);

    const v110 = r!.versions.find((v) => v.version === '1.1.0')!;
    expect(v110.id).toBe('demo-pkg@1.1.0');
    expect(v110.license).toBe('MIT');
    expect(v110.publishedAt).toBe('2024-06-01T00:00:00Z');

    expect(r!.maintainers.map((m) => m.username).sort()).toEqual(['alice', 'bob']);

    const runtimeDeps = r!.dependencies.filter((d) => d.kind === 'runtime');
    const devDeps = r!.dependencies.filter((d) => d.kind === 'dev');
    expect(runtimeDeps).toHaveLength(2);
    expect(devDeps).toHaveLength(1);
    expect(devDeps[0]!.toPackageName).toBe('lib-b');
  });

  it('returns null on 404', async () => {
    mockedGetJson.mockResolvedValueOnce(null);
    expect(await fetchNpmPackument('does-not-exist')).toBeNull();
  });

  it('honours versionsLimit and orders by publishedAt desc', async () => {
    mockedGetJson.mockResolvedValueOnce(fixture as never);
    const r = await fetchNpmPackument('demo-pkg', { versionsLimit: 1 });
    expect(r!.versions).toHaveLength(1);
    expect(r!.versions[0]!.version).toBe('1.1.0');
  });
});
