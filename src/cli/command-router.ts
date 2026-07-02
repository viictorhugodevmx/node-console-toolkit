import { generateToken, hashPassword } from '../modules/crypto-tools/hash.service';
import { readJsonFile } from '../modules/json-files/json-file.service';
import { createUser, readUsers } from '../modules/users/user.repository';
import { isCommandName, type ParsedCommand } from './commands';

function printHelp(): void {
  console.log('Node Console Toolkit');
  console.log('');
  console.log('Available commands:');
  console.log('  help                         Show available commands');
  console.log('  version                      Show CLI version');
  console.log('  echo <message>               Print a message');
  console.log('  create-user <name> <email>   Create a user in data/users.json');
  console.log('  list-users                   List users from data/users.json');
  console.log('  read-json <filePath>         Read and print a JSON file');
  console.log('  hash-password <password>     Generate a SHA-256 hash');
  console.log('  generate-token [bytes]       Generate a random token');
  console.log('');
  console.log('Examples:');
  console.log('  npm run dev -- help');
  console.log('  npm run dev -- version');
  console.log('  npm run dev -- echo hello world');
  console.log('  npm run dev -- create-user Victor victor@app1.com');
  console.log('  npm run dev -- list-users');
  console.log('  npm run dev -- read-json data/users.json');
  console.log('  npm run dev -- hash-password 123456');
  console.log('  npm run dev -- generate-token');
  console.log('  npm run dev -- generate-token 32');
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

function handleReadJson(args: string[]): void {
  const [filePath] = args;

  if (!filePath) {
    throw new Error('Usage: read-json <filePath>');
  }

  const data = readJsonFile(filePath);

  console.log(JSON.stringify(data, null, 2));
}

function handleHashPassword(args: string[]): void {
  const [password] = args;

  if (!password) {
    throw new Error('Usage: hash-password <password>');
  }

  const hash = hashPassword(password);

  console.log(JSON.stringify({
    algorithm: 'sha256',
    hash
  }, null, 2));
}

function handleGenerateToken(args: string[]): void {
  const [rawBytes] = args;
  const bytes = rawBytes ? Number(rawBytes) : 24;
  const token = generateToken(bytes);

  console.log(JSON.stringify({
    bytes,
    token
  }, null, 2));
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

    if (command.name === 'read-json') {
      handleReadJson(command.args);
      return;
    }

    if (command.name === 'hash-password') {
      handleHashPassword(command.args);
      return;
    }

    if (command.name === 'generate-token') {
      handleGenerateToken(command.args);
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
