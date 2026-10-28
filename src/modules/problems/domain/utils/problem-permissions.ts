export const parseProblemPermissions = (raw: unknown) => {
  let value = raw;
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value);
    } catch {
      value = null;
    }
  }
  const permissions =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  return {
    canCreateProblems: Boolean(permissions.canCreateProblems ?? permissions.can_create_problems),
    canChangeProblemTags: Boolean(
      permissions.canChangeProblemTags ?? permissions.can_change_problem_tags,
    ),
    canUseCheckSamples: Boolean(
      permissions.canUseCheckSamples ?? permissions.can_use_check_samples,
    ),
  };
};
