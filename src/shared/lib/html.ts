const NAMED_HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

const HTML_ENTITY_PATTERN = /&(#(?:x[\da-f]+|\d+)|[a-z][\da-z]+);/gi;

const decodeEntity = (entity: string, original: string) => {
  if (!entity.startsWith('#')) {
    return NAMED_HTML_ENTITIES[entity.toLowerCase()] ?? original;
  }

  const isHex = entity[1]?.toLowerCase() === 'x';
  const codePoint = Number.parseInt(entity.slice(isHex ? 2 : 1), isHex ? 16 : 10);

  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return original;
  }

  try {
    return String.fromCodePoint(codePoint);
  } catch {
    return original;
  }
};

export const decodeHtmlEntities = (value: string) => {
  let decoded = value;

  // Some legacy content was encoded more than once (for example, &amp;#39;).
  for (let pass = 0; pass < 2; pass += 1) {
    const next = decoded.replace(HTML_ENTITY_PATTERN, (match, entity: string) =>
      decodeEntity(entity, match),
    );
    if (next === decoded) break;
    decoded = next;
  }

  return decoded;
};
