const DEFAULT_PROJECT_FILE_ACCEPT = '.zip';

export const resolveProjectFileAccept = (fileAccept?: string) => {
  const normalized = fileAccept?.trim();
  return normalized || DEFAULT_PROJECT_FILE_ACCEPT;
};

export const formatProjectUploadHint = (fileAccept?: string) =>
  `(${resolveProjectFileAccept(fileAccept)})`;

export const isProjectFileAccepted = (file: Pick<File, 'name' | 'type'>, fileAccept?: string) => {
  const filename = file.name.toLowerCase();
  const mimeType = file.type.toLowerCase();

  return resolveProjectFileAccept(fileAccept)
    .split(',')
    .some((value) => {
      const token = value.trim().toLowerCase();

      if (!token) return false;
      if (token === '*' || token === '*/*') return true;
      if (token.startsWith('.')) return filename.endsWith(token);
      if (token.endsWith('/*')) return mimeType.startsWith(token.slice(0, -1));

      return mimeType === token;
    });
};
