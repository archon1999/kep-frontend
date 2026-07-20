interface AttemptLogViewer {
  username?: string | null;
  isSuperuser?: boolean;
}

export const canViewAttemptLog = (
  viewer: AttemptLogViewer | null | undefined,
  attemptUsername: string | null | undefined,
) =>
  viewer?.isSuperuser === true ||
  Boolean(viewer?.username && attemptUsername && viewer.username === attemptUsername);
