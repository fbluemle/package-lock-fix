// Represents a package entry in package-lock.json
export interface PackageEntry {
  name?: string;
  version: string;
  resolved?: string;
  integrity?: string;
  link?: boolean;

  [key: string]: any; // Allow additional fields
}

// Represents the packages section
export interface Packages {
  [packageKey: string]: PackageEntry;
}

// Represents the entire lockfile structure
export interface LockfileJson {
  name: string;
  version: string;
  lockfileVersion: number;
  requires: boolean;
  packages: Packages;
}

// npm registry response for package metadata
export interface NpmRegistryResponse {
  dist: {
    tarball: string;
    integrity: string;
  };

  [key: string]: any;
}

// CLI options
export interface CliOptions {
  filename: string;
  onlyWithoutResolved: boolean;
  output?: string;
  cout: boolean;
  indent: number;
}
