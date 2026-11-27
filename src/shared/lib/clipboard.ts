const copyWithSelection = (text: string, trigger: HTMLElement) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.readOnly = true;
  textarea.tabIndex = -1;
  Object.assign(textarea.style, { position: 'fixed', inset: '0 auto auto 0', opacity: '0' });

  const focusedElement = document.activeElement;
  // Keep the selection inside the active dialog so its focus trap allows it.
  const container = trigger.closest('[role="dialog"]') ?? document.body;
  container.appendChild(textarea);
  try {
    textarea.focus({ preventScroll: true });
    textarea.select();
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    textarea.remove();
    if (focusedElement instanceof HTMLElement) focusedElement.focus({ preventScroll: true });
  }
};

export const copyText = async (text: string, trigger: HTMLElement) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Some browsers block the Clipboard API but still allow copying a selection.
  }

  if (!trigger.isConnected || trigger.closest('[aria-hidden="true"]')) return false;
  return copyWithSelection(text, trigger);
};
