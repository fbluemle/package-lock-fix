import {getLockfileJson, loopThroughPackages} from '../src/npmfix';

describe('package-lock-fix tests', () => {
  it('test01: both packages can have their data added', async () => {
    const lockfile = await getLockfileJson(
      './__tests__/__fixtures__/package-lock-01.json',
      true
    );

    await loopThroughPackages(lockfile.packages, false, true);

    const aixPackage = lockfile.packages['node_modules/@esbuild/aix-ppc64'];
    const aixFixed = 'resolved' in aixPackage && 'integrity' in aixPackage;

    const armPackage = lockfile.packages['node_modules/@esbuild/android-arm'];
    const armFixed = 'resolved' in armPackage && 'integrity' in armPackage;

    expect(aixFixed && armFixed).toBe(true);
  });

  it('test02: only_without_resolved check', async () => {
    const lockfile = await getLockfileJson(
      './__tests__/__fixtures__/package-lock-02.json',
      true
    );

    await loopThroughPackages(lockfile.packages, true, true);

    const aixPackage = lockfile.packages['node_modules/@esbuild/aix-ppc64'];
    const aixFixed = 'resolved' in aixPackage && 'integrity' in aixPackage;

    const armPackage = lockfile.packages['node_modules/@esbuild/android-arm'];
    const armFixed = 'resolved' in armPackage && !('integrity' in armPackage);

    expect(aixFixed && armFixed).toBe(true);
  });

  it('test03: both packages can have their data added', async () => {
    const lockfile = await getLockfileJson(
      './__tests__/__fixtures__/package-lock-03.json',
      true
    );

    await loopThroughPackages(lockfile.packages, false, true);

    const aixPackage = lockfile.packages['node_modules/@esbuild/aix-ppc64'];
    const aixFixed = 'resolved' in aixPackage && 'integrity' in aixPackage;

    const armPackage = lockfile.packages['node_modules/@esbuild/android-arm'];
    const armFixed = 'resolved' in armPackage && 'integrity' in armPackage;

    expect(aixFixed && armFixed).toBe(true);
  });
});
