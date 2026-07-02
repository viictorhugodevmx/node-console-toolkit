import { runCli } from './cli/command-router';

const args = process.argv.slice(2);

runCli(args);
