export const kepChatEmoji = [
  { id: 1, name: 'KEP' },
  { id: 2, name: 'Kepcoin' },
  { id: 3, name: 'Streak' },
  { id: 4, name: 'AC' },
  { id: 5, name: 'WA' },
  { id: 6, name: 'Code' },
  { id: 7, name: 'Duel' },
  { id: 10, name: 'KEPPER' },
] as const;

export function chatLength(text: string) {
  return Array.from(text.replace(/:kep-(1|2|3|4|5|6|7|10):/g, 'x')).length;
}

export function chatParts(text: string) {
  return text
    .split(/(:kep-(?:1|2|3|4|5|6|7|10):)/g)
    .filter(Boolean)
    .map((part) => {
      const id = /^:kep-(\d+):$/.exec(part)?.[1];
      return {
        text: part,
        emoji: id ? kepChatEmoji.find((item) => item.id === Number(id)) : undefined,
      };
    });
}
