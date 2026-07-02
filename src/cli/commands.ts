export type CommandName =
  | 'help'
  | 'version'
  | 'echo'
  | 'create-user'
  | 'list-users'
  | 'read-json'
  | 'hash-password'
  | 'generate-token';

export interface ParsedCommand {
  name: CommandName;
  args: string[];
}

export const availableCommands: CommandName[] = [
  'help',
  'version',
  'echo',
  'create-user',
  'list-users',
  'read-json',
  'hash-password',
  'generate-token'
];

export function isCommandName(value: string): value is CommandName {
  return availableCommands.includes(value as CommandName);
}
