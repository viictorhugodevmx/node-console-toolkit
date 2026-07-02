export type CommandName =
  | 'help'
  | 'version'
  | 'echo'
  | 'create-user'
  | 'list-users'
  | 'read-json'
  | 'hash-password';

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
  'hash-password'
];

export function isCommandName(value: string): value is CommandName {
  return availableCommands.includes(value as CommandName);
}
