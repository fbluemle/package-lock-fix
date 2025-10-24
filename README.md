# package-lock-fix

Add missing integrity and resolved fields to a package-lock.json file.

[![ci][1]][2]

## Usage

```sh
npx npm-lockfile-fix <path/to/package-lock.json> [options]
```

### Options

- `-r`, `--only-without-resolved` - Only patch dependencies without a resolved field
- `-o`, `--output <file>` - Leave input file unmodified and output to specified file
- `--cout` - Leave input file unmodified and output to stdout
- `--indent <number>` - Number of spaces to indent output with (default: 2)

### Examples

#### Fix lockfile in place

```sh
npx npm-lockfile-fix ./package-lock.json
```

#### Output to stdout

```sh
npx npm-lockfile-fix ./package-lock.json --cout
```

#### Save to different file

```sh
npx npm-lockfile-fix ./package-lock.json -o ./fixed-package-lock.json
```

## Development

### Install dependencies

```sh
yarn
```

### Run tests

```sh
yarn test
```

### Build

```sh
yarn build
```

## Credits

Heavily inspired by a similar Python/Nix CLI tool: [npm-lockfile-fix][3].

## License

MIT

[1]: https://github.com/fbluemle/package-lock-fix/workflows/ci/badge.svg
[2]: https://github.com/fbluemle/package-lock-fix/actions
[3]: https://github.com/jeslie0/npm-lockfile-fix
