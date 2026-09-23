import type { Command } from '../entities/game.types.ts';

export class GameSyntaxError extends Error {
  readonly line: number;
  constructor(line: number) {
    super(`Invalid game command at line ${line}`);
    this.line = line;
  }
}

export const formatProgram = (commands: readonly Command[], depth = 0): string => {
  const pad = '  '.repeat(depth);
  return commands
    .map((command) => {
      if (command.kind === 'repeat') {
        return `${pad}repeat ${command.count} {\n${formatProgram(command.body, depth + 1)}\n${pad}}`;
      }
      if (command.kind === 'ifBlocked') {
        return `${pad}if blocked {\n${formatProgram(command.yes, depth + 1)}\n${pad}} else {\n${formatProgram(command.no, depth + 1)}\n${pad}}`;
      }
      return `${pad}${command.kind}`;
    })
    .join('\n');
};

export const parseProgram = (source: string): Command[] => {
  const lines = source
    .split(/\r?\n/)
    .map((value, index) => ({ text: value.trim(), number: index + 1 }));
  if (lines.length > 80) throw new GameSyntaxError(81);
  let cursor = 0;
  let sequence = 0;

  const readBody = (depth: number): Command[] => {
    if (depth > 6) throw new GameSyntaxError(lines[cursor - 1]?.number ?? 1);
    const commands: Command[] = [];
    while (cursor < lines.length) {
      const line = lines[cursor];
      if (!line.text || line.text.startsWith('//')) {
        cursor += 1;
        continue;
      }
      if (line.text === '}' || line.text === '} else {') break;
      cursor += 1;
      const id = `code-${++sequence}`;
      if (line.text === 'move' || line.text === 'left' || line.text === 'right') {
        commands.push({ id, kind: line.text });
      } else if (/^repeat [1-8] \{$/.test(line.text)) {
        const count = Number(line.text.match(/[1-8]/)?.[0]);
        const body = readBody(depth + 1);
        if (lines[cursor]?.text !== '}')
          throw new GameSyntaxError(lines[cursor]?.number ?? line.number);
        cursor += 1;
        commands.push({ id, kind: 'repeat', count, body });
      } else if (line.text === 'if blocked {') {
        const yes = readBody(depth + 1);
        const separator = lines[cursor];
        if (!separator || (separator.text !== '} else {' && separator.text !== '}')) {
          throw new GameSyntaxError(separator?.number ?? line.number);
        }
        cursor += 1;
        let no: Command[] = [];
        if (separator.text === '} else {') {
          no = readBody(depth + 1);
          if (lines[cursor]?.text !== '}')
            throw new GameSyntaxError(lines[cursor]?.number ?? line.number);
          cursor += 1;
        }
        commands.push({ id, kind: 'ifBlocked', yes, no });
      } else {
        throw new GameSyntaxError(line.number);
      }
    }
    return commands;
  };

  const program = readBody(0);
  if (cursor < lines.length) throw new GameSyntaxError(lines[cursor].number);
  if (sequence > 60) throw new GameSyntaxError(lines[lines.length - 1]?.number ?? 1);
  return program;
};
