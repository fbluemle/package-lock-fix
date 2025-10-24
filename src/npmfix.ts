import {readFile, writeFile} from 'fs/promises';
import type {LockfileJson, Packages, PackageEntry, NpmRegistryResponse} from './types.js';

const REGISTRY_URL = 'https://registry.npmjs.org/';

/**
 * Print string only when useCout is false
 */
function myPrint(message: string, useCout: boolean): void {
  if (!useCout) {
    console.log(message);
  }
}

/**
 * Read and parse a package-lock.json file
 */
export async function getLockfileJson(
  lockfilePath: string,
  useCout: boolean
): Promise<LockfileJson> {
  myPrint(lockfilePath, useCout);
  const fileContent = await readFile(lockfilePath, 'utf-8');
  return JSON.parse(fileContent) as LockfileJson;
}

/**
 * Loop over each package in the packages section and fetch missing metadata
 */
export async function loopThroughPackages(
  packages: Packages,
  onlyWithoutResolved: boolean,
  useCout: boolean
): Promise<void> {
  for (const packageKey of Object.keys(packages)) {
    if (packageKey === '' || !packageKey.includes('node_modules/')) {
      continue;
    }

    const packageEntry = packages[packageKey]!;
    const packageName =
      packageEntry.name || packageKey.split('node_modules/').pop()!;

    const noResolved = !('resolved' in packageEntry);
    const noIntegrity = !('integrity' in packageEntry);
    const noLink = !('link' in packageEntry);

    let shouldUpdate = noResolved || (noIntegrity && noLink);
    if (onlyWithoutResolved) {
      shouldUpdate = noResolved && noIntegrity && noLink;
    }

    if (shouldUpdate) {
      const version = packageEntry.version;
      const url = `${REGISTRY_URL}${packageName}/${version}`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const packageData = await response.json() as NpmRegistryResponse;
          packageEntry.resolved = packageData.dist.tarball;
          packageEntry.integrity = packageData.dist.integrity;
          myPrint(`${packageKey}@${version} updated.`, useCout);
        } else {
          myPrint(`Could not fetch metadata for ${packageKey}@${version}.`, useCout);
          myPrint(`URL: ${url}`, useCout);
          myPrint(`Status code: ${response.status}.`, useCout);
        }
      } catch (error) {
        myPrint(`Error fetching ${packageKey}@${version}: ${error}`, useCout);
      }
    }
  }
}

/**
 * Write JSON data to a file with specified indentation
 */
export async function saveJson(
  data: LockfileJson,
  path: string,
  indent: number
): Promise<void> {
  const jsonString = JSON.stringify(data, null, indent);
  await writeFile(path, jsonString + '\n', 'utf-8');
}
