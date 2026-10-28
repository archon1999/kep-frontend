const DEFAULT_PROJECT_FILE_ACCEPT = '.zip';

export const resolveProjectFileAccept = (fileAccept?: string) => {
  const normalized = fileAccept?.trim();
  return normalized || DEFAULT_PROJECT_FILE_ACCEPT;
};

export const isProjectFileAccepted = (
  file: { name: string; type: string },
  fileAccept?: string,
) => {
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

export const MAX_PROJECT_FILE_SIZE = 1024 * 1024;

export const validateProjectFile = (
  file: { name: string; type: string; size: number },
  fileAccept?: string,
): 'too-large' | 'unsupported-type' | null => {
  if (file.size > MAX_PROJECT_FILE_SIZE) return 'too-large';
  if (!isProjectFileAccepted(file, fileAccept)) return 'unsupported-type';
  return null;
};
