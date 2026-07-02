import { isCommandName, type ParsedCommand } from './commands';
import { createUser, readUsers } from '../modules/users/user.repository';

function printHelp(): void {
  console.log('Node Console Toolkit');
  console.log('');
  console.log('Available commands:');
  console.log('  help                         Show available commands');
  console.log('  version                      Show CLI version');
  console.log('  echo <message>               Print a message');
  console.log('  create-user <name> <email>   Create a user in data/users.json');
  console.log('  list-users                   List users from data/users.json');
  console.log('');
  console.log('Examples:');
  console.log('  npm run dev -- help');
  console.log('  npm run dev -- version');
  console.log('  npm run dev -- echo hello world');
  console.log('  npm run dev -- create-user Victor victor@app1.com');
  console.log('  npm run dev -- list-users');
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

function handleCreateUser(args: string[]): void {
  const [name, email] = args;

  if (!name || !email) {
    throw new Error('Usage: create-user <name> <email>');
  }

  if (!email.includes('@')) {
    throw new Error('Invalid email');
  }

  const user = createUser(name, email);

  console.log('User created successfully');
  console.log(JSON.stringify(user, null, 2));
}

function handleListUsers(): void {
  const users = readUsers();

  if (users.length === 0) {
    console.log('No users found');
    return;
  }

  console.log(JSON.stringify(users, null, 2));
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

    if (command.name === 'create-user') {
      handleCreateUser(command.args);
      return;
    }

    if (command.name === 'list-users') {
      handleListUsers();
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
