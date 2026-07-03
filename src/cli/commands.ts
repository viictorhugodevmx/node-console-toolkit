export type CommandName =
  | 'help'
  | 'version'
  | 'echo'
  | 'health-check'
  | 'create-user'
  | 'list-users'
  | 'count-users'
  | 'find-user'
  | 'search-users'
  | 'filter-users'
  | 'sort-users'
  | 'update-user'
  | 'delete-user'
  | 'reset-users'
  | 'validate-users'
  | 'repair-users'
  | 'backup-users'
  | 'read-json'
  | 'hash-password'
  | 'generate-token'
  | 'export-users'
  | 'import-users'
  | 'stats-users';

export interface ParsedCommand {
  name: CommandName;
  args: string[];
}

export const availableCommands: CommandName[] = [
  'help',
  'version',
  'echo',
  'health-check',
  'create-user',
  'list-users',
  'count-users',
  'find-user',
  'search-users',
  'filter-users',
  'sort-users',
  'update-user',
  'delete-user',
  'reset-users',
  'validate-users',
  'repair-users',
  'backup-users',
  'read-json',
  'hash-password',
  'generate-token',
  'export-users',
  'import-users',
  'stats-users'
];

export function isCommandName(value: string): value is CommandName {
  return availableCommands.includes(value as CommandName);
}
