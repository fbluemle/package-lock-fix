#!/usr/bin/env node

import {Command} from 'commander';
import {getLockfileJson, loopThroughPackages, saveJson} from './npmfix.js';
import type {CliOptions} from './types.js';

async function mainImpl(options: CliOptions): Promise<number> {
  const {filename, onlyWithoutResolved, output, cout, indent} = options;

  const lockfileJson = await getLockfileJson(filename, cout);

  await loopThroughPackages(
    lockfileJson.packages,
    onlyWithoutResolved,
    cout
  );

  if (cout) {
    console.log(JSON.stringify(lockfileJson, null, indent));
    return 0;
  }

  const outpath = output || filename;
  await saveJson(lockfileJson, outpath, indent);

  return 0;
}

async function main() {
  const program = new Command();

  program
    .name('package-lock-fix')
    .description(
      'Add missing integrity and resolved fields to a package-lock.json file. ' +
      'By default this will modify the specified file.'
    )
    .version('0.1.0')
    .argument('<filename>', 'the package-lock.json file to patch')
    .option(
      '-r, --only-without-resolved',
      'only patch dependencies without a resolved field'
    )
    .option(
      '-o, --output <file>',
      'leave input file unmodified and output to specified file'
    )
    .option(
      '--cout',
      'leave input file unmodified and output to stdout'
    )
    .option(
      '--indent <number>',
      'number of spaces to indent output with',
      '2'
    )
    .action(async (filename: string, options: any) => {
      const cliOptions: CliOptions = {
        filename,
        onlyWithoutResolved: options.onlyWithoutResolved || false,
        output: options.output,
        cout: options.cout || false,
        indent: parseInt(options.indent, 10),
      };

      try {
        const exitCode = await mainImpl(cliOptions);
        process.exit(exitCode);
      } catch (error) {
        console.error('Error:', error);
        process.exit(1);
      }
    });

  await program.parseAsync(process.argv);
}

main();
