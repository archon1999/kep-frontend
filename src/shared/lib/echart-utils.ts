export const getColor = (colorVar?: string) => {
  if (!colorVar) {
    return '';
  }

  const trimmed = colorVar.trim();
  const isCssVariable = trimmed.startsWith('var(') && trimmed.endsWith(')');

  if (!isCssVariable) {
    return trimmed;
  }

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return trimmed;
  }

  const variableName = trimmed.slice(4, -1).trim();
  const computedStyle = getComputedStyle(document.documentElement);
  const resolved = computedStyle.getPropertyValue(variableName).trim();

  return resolved || trimmed;
};
