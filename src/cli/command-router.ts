import { generateToken, hashPassword } from '../modules/crypto-tools/hash.service';
import { exportUsers } from '../modules/export/export-users.service';
import { importUsers } from '../modules/import/import-users.service';
import { readJsonFile } from '../modules/json-files/json-file.service';
import { repairUsers } from '../modules/repair/repair-users.service';
import { getUserStats } from '../modules/stats/user-stats.service';
import {
  countUsers,
  createUser,
  deleteUserByEmail,
  filterUsersByDomain,
  findUserByEmail,
  readUsers,
  resetUsers,
  searchUsers,
  sortUsers,
  updateUserByEmail
} from '../modules/users/user.repository';
import type { User } from '../modules/users/user.types';
import { validateUsers } from '../modules/validation/validate-users.service';
import { isCommandName, type ParsedCommand } from './commands';

function printHelp(): void {
  console.log('Node Console Toolkit');
  console.log('');
  console.log('Available commands:');
  console.log('  help                                      Show available commands');
  console.log('  version                                   Show CLI version');
  console.log('  echo <message>                            Print a message');
  console.log('  create-user <name> <email>                Create a user in data/users.json');
  console.log('  list-users                                List users from data/users.json');
  console.log('  count-users                               Count users from data/users.json');
  console.log('  find-user <email>                         Find a user by email');
  console.log('  search-users <query>                      Search users by name or email');
  console.log('  filter-users <domain>                     Filter users by email domain');
  console.log('  sort-users <field> <direction>            Sort users by field');
  console.log('  update-user <email> <newName> <newEmail>  Update a user');
  console.log('  delete-user <email>                       Delete a user from data/users.json');
  console.log('  reset-users                               Delete all users from data/users.json');
  console.log('  validate-users                            Validate users data integrity');
  console.log('  repair-users                              Repair users data when possible');
  console.log('  read-json <filePath>                      Read and print a JSON file');
  console.log('  hash-password <password>                  Generate a SHA-256 hash');
  console.log('  generate-token [bytes]                    Generate a random token');
  console.log('  export-users <outputPath>                 Export users to a JSON backup file');
  console.log('  import-users <inputPath>                  Import users from a JSON backup file');
  console.log('  stats-users                               Show users statistics');
  console.log('');
  console.log('Examples:');
  console.log('  npm run dev -- validate-users');
  console.log('  npm run dev -- repair-users');
  console.log('  npm run dev -- count-users');
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

function printUserTable(users: User[]): void {
  const tableRows = users.map((user) => ({
    id: user.id.slice(0, 8),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt ?? '-'
  }));

  console.table(tableRows);
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

  printUserTable(users);
}

function handleCountUsers(): void {
  const result = countUsers();

  console.log(JSON.stringify(result, null, 2));
}

function handleFindUser(args: string[]): void {
  const [email] = args;

  if (!email) {
    throw new Error('Usage: find-user <email>');
  }

  const user = findUserByEmail(email);

  console.log('User found');
  console.log(JSON.stringify(user, null, 2));
}

function handleSearchUsers(args: string[]): void {
  const [query] = args;

  if (!query) {
    throw new Error('Usage: search-users <query>');
  }

  const users = searchUsers(query);

  if (users.length === 0) {
    console.log('No users matched your search');
    return;
  }

  console.log(`Found ${users.length} user(s)`);
  printUserTable(users);
}

function handleFilterUsers(args: string[]): void {
  const [domain] = args;

  if (!domain) {
    throw new Error('Usage: filter-users <domain>');
  }

  const users = filterUsersByDomain(domain);

  if (users.length === 0) {
    console.log('No users matched that domain');
    return;
  }

  console.log(`Found ${users.length} user(s) for domain ${domain}`);
  printUserTable(users);
}

function handleSortUsers(args: string[]): void {
  const [field, direction] = args;

  if (!field || !direction) {
    throw new Error('Usage: sort-users <field> <direction>');
  }

  const users = sortUsers(field, direction);

  if (users.length === 0) {
    console.log('No users found');
    return;
  }

  console.log(`Sorted by ${field} ${direction}`);
  printUserTable(users);
}

function handleUpdateUser(args: string[]): void {
  const [currentEmail, newName, newEmail] = args;

  if (!currentEmail || !newName || !newEmail) {
    throw new Error('Usage: update-user <email> <newName> <newEmail>');
  }

  const updatedUser = updateUserByEmail(currentEmail, newName, newEmail);

  console.log('User updated successfully');
  console.log(JSON.stringify(updatedUser, null, 2));
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

function handleResetUsers(): void {
  const deletedCount = resetUsers();

  console.log('Users reset successfully');
  console.log(JSON.stringify({
    deletedCount
  }, null, 2));
}

function handleValidateUsers(): void {
  const result = validateUsers();

  if (result.valid) {
    console.log('Users data is valid');
    console.log(JSON.stringify({
      valid: result.valid,
      totalUsers: result.totalUsers,
      totalIssues: result.totalIssues
    }, null, 2));
    return;
  }

  console.log('Users data has issues');
  console.log(JSON.stringify(result, null, 2));

  process.exitCode = 1;
}

function handleRepairUsers(): void {
  const result = repairUsers();

  console.log('Users repair completed');
  console.log(JSON.stringify(result, null, 2));
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

function handleStatsUsers(): void {
  const stats = getUserStats();

  console.log(JSON.stringify(stats, null, 2));
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

    if (command.name === 'count-users') {
      handleCountUsers();
      return;
    }

    if (command.name === 'find-user') {
      handleFindUser(command.args);
      return;
    }

    if (command.name === 'search-users') {
      handleSearchUsers(command.args);
      return;
    }

    if (command.name === 'filter-users') {
      handleFilterUsers(command.args);
      return;
    }

    if (command.name === 'sort-users') {
      handleSortUsers(command.args);
      return;
    }

    if (command.name === 'update-user') {
      handleUpdateUser(command.args);
      return;
    }

    if (command.name === 'delete-user') {
      handleDeleteUser(command.args);
      return;
    }

    if (command.name === 'reset-users') {
      handleResetUsers();
      return;
    }

    if (command.name === 'validate-users') {
      handleValidateUsers();
      return;
    }

    if (command.name === 'repair-users') {
      handleRepairUsers();
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

    if (command.name === 'stats-users') {
      handleStatsUsers();
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
