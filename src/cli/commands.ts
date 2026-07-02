export type CommandName = 'help' | 'version' | 'echo';

export interface ParsedCommand {
  name: CommandName;
  args: string[];
}

export const availableCommands: CommandName[] = ['help', 'version', 'echo'];

export function isCommandName(value: string): value is CommandName {
  return availableCommands.includes(value as CommandName);
}
