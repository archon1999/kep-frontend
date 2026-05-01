const DEFAULT_PROJECT_FILE_ACCEPT = '.zip';

export const resolveProjectFileAccept = (fileAccept?: string) => {
  const normalized = fileAccept?.trim();
  return normalized || DEFAULT_PROJECT_FILE_ACCEPT;
};

export const formatProjectUploadHint = (fileAccept?: string) =>
  `(${resolveProjectFileAccept(fileAccept)})`;
