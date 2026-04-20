const CHESS_SOLUTION_CIPHER = 'xor1';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const fallbackBuffer = globalThis.Buffer;

const toBase64 = (binary: string) => {
  if (typeof btoa === 'function') {
    return btoa(binary);
  }

  if (!fallbackBuffer) {
    throw new Error('Base64 encoder is not available');
  }

  return fallbackBuffer.from(binary, 'binary').toString('base64');
};

const fromBase64 = (value: string) => {
  if (typeof atob === 'function') {
    return atob(value);
  }

  if (!fallbackBuffer) {
    throw new Error('Base64 decoder is not available');
  }

  return fallbackBuffer.from(value, 'base64').toString('binary');
};

const encodeBase64Url = (bytes: Uint8Array) => {
  const binary = Array.from(bytes, (value) => String.fromCharCode(value)).join('');
  return toBase64(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const decodeBase64Url = (value: string) => {
  const normalized = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = fromBase64(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const buildSolutionKey = (questionId: number, puzzleId: string) =>
  textEncoder.encode(`${questionId}:${puzzleId}`);

const xorBytes = (input: Uint8Array, key: Uint8Array) => {
  if (!key.length) return input;

  const output = new Uint8Array(input.length);
  for (let index = 0; index < input.length; index += 1) {
    output[index] = input[index] ^ key[index % key.length];
  }

  return output;
};

export const encodeChessSolutionBlob = (
  questionId: number,
  puzzleId: string,
  solutionLines: string[][],
) => {
  const payload = textEncoder.encode(JSON.stringify(solutionLines));
  return encodeBase64Url(xorBytes(payload, buildSolutionKey(questionId, puzzleId)));
};

export const decodeChessSolutionBlob = (options: {
  questionId: number;
  puzzleId: string;
  solutionBlob?: string;
  solutionCipher?: string;
}) => {
  const {
    questionId,
    puzzleId,
    solutionBlob,
    solutionCipher,
  } = options;

  if (!solutionBlob || solutionCipher !== CHESS_SOLUTION_CIPHER) {
    return [] as string[][];
  }

  try {
    const decoded = xorBytes(
      decodeBase64Url(solutionBlob),
      buildSolutionKey(questionId, puzzleId),
    );
    const parsed = JSON.parse(textDecoder.decode(decoded));

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((line) =>
        Array.isArray(line)
          ? line.map((move) => String(move))
          : [],
      )
      .filter((line) => line.length > 0);
  } catch {
    return [];
  }
};
