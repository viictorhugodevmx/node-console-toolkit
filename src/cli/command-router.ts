import { generateToken, hashPassword } from '../modules/crypto-tools/hash.service';
import { exportUsers } from '../modules/export/export-users.service';
import { importUsers } from '../modules/import/import-users.service';
import { readJsonFile } from '../modules/json-files/json-file.service';
import { createUser, deleteUserByEmail, readUsers } from '../modules/users/user.repository';
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
  console.log('  delete-user <email>          Delete a user from data/users.json');
  console.log('  read-json <filePath>         Read and print a JSON file');
  console.log('  hash-password <password>     Generate a SHA-256 hash');
  console.log('  generate-token [bytes]       Generate a random token');
  console.log('  export-users <outputPath>    Export users to a JSON backup file');
  console.log('  import-users <inputPath>     Import users from a JSON backup file');
  console.log('');
  console.log('Examples:');
  console.log('  npm run dev -- help');
  console.log('  npm run dev -- version');
  console.log('  npm run dev -- echo hello world');
  console.log('  npm run dev -- create-user Victor victor@app1.com');
  console.log('  npm run dev -- list-users');
  console.log('  npm run dev -- delete-user victor@app1.com');
  console.log('  npm run dev -- read-json data/users.json');
  console.log('  npm run dev -- hash-password 123456');
  console.log('  npm run dev -- generate-token');
  console.log('  npm run dev -- generate-token 32');
  console.log('  npm run dev -- export-users backups/users-backup.json');
  console.log('  npm run dev -- import-users backups/users-backup.json');
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

function handleDeleteUser(args: string[]): void {
  const [email] = args;

  if (!email) {
    throw new Error('Usage: delete-user <email>');
  }

  const deletedUser = deleteUserByEmail(email);

  console.log('User deleted successfully');
  console.log(JSON.stringify(deletedUser, null, 2));
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

function handleExportUsers(args: string[]): void {
  const [outputPath] = args;

  if (!outputPath) {
    throw new Error('Usage: export-users <outputPath>');
  }

  const exportData = exportUsers(outputPath);

  console.log('Users exported successfully');
  console.log(JSON.stringify({
    outputPath,
    exportedAt: exportData.exportedAt,
    total: exportData.total
  }, null, 2));
}

function handleImportUsers(args: string[]): void {
  const [inputPath] = args;

  if (!inputPath) {
    throw new Error('Usage: import-users <inputPath>');
  }

  const result = importUsers(inputPath);

  console.log('Users imported successfully');
  console.log(JSON.stringify(result, null, 2));
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

    if (command.name === 'delete-user') {
      handleDeleteUser(command.args);
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

    if (command.name === 'export-users') {
      handleExportUsers(command.args);
      return;
    }

    if (command.name === 'import-users') {
      handleImportUsers(command.args);
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
