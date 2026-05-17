export const formatAdminEditTitle = (id: number | string | undefined, title?: string | null) => {
  const normalizedTitle = String(title ?? '').trim();

  if (!id) {
    return normalizedTitle;
  }

  return normalizedTitle ? `${id}. ${normalizedTitle}` : String(id);
};

export const getAdminResourceTitle = (resource?: Record<string, any> | null) => {
  if (!resource) {
    return '';
  }

  const candidates = [
    resource.title,
    resource.name,
    resource.username,
    resource.code,
    resource.problemTitle,
    resource.contestTitle,
    resource.teamName,
    resource.userUsername,
    resource.createrUsername,
    resource.question,
  ];

  return String(candidates.find((value) => String(value ?? '').trim()) ?? '');
};
