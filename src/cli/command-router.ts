import { isCommandName, type ParsedCommand } from './commands';

function printHelp(): void {
  console.log('Node Console Toolkit');
  console.log('');
  console.log('Available commands:');
  console.log('  help                 Show available commands');
  console.log('  version              Show CLI version');
  console.log('  echo <message>       Print a message');
  console.log('');
  console.log('Examples:');
  console.log('  npm run dev -- help');
  console.log('  npm run dev -- version');
  console.log('  npm run dev -- echo hello world');
}

function printVersion(): void {
  console.log('node-console-toolkit v1.0.0');
}

function printEcho(args: string[]): void {
  if (args.length === 0) {
    console.log('Nothing to echo');
    return;
  }

  console.log(args.join(' '));
}

function parseCommand(rawArgs: string[]): ParsedCommand {
  const [rawCommand = 'help', ...args] = rawArgs;

  if (!isCommandName(rawCommand)) {
    throw new Error(`Unknown command: ${rawCommand}`);
  }

  return {
    name: rawCommand,
    args
  };
}

export function runCli(rawArgs: string[]): void {
  try {
    const command = parseCommand(rawArgs);

    if (command.name === 'help') {
      printHelp();
      return;
    }

    if (command.name === 'version') {
      printVersion();
      return;
    }

    if (command.name === 'echo') {
      printEcho(command.args);
      return;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected CLI error';

    console.error(message);
    console.error('');
    printHelp();

    process.exitCode = 1;
  }
}
