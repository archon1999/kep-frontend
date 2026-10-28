import { useEffect, useEffectEvent } from 'react';

type Shortcut = { enabled: boolean; onTrigger: () => void };
type Options = {
  run: Shortcut;
  submit: Shortcut;
  checkSamples?: Shortcut;
  answerForInput?: Shortcut;
};

export const useWorkspaceHotkeys = (options: Options) => {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!event.ctrlKey || event.repeat || event.isComposing) return;
    const action =
      event.key === "'"
        ? options.run
        : event.key === ','
          ? options.checkSamples
          : event.key === '.'
            ? options.answerForInput
            : event.altKey && (event.key === 'Enter' || event.key === 'NumpadEnter')
              ? options.submit
              : undefined;
    if (!action?.enabled) return;
    event.preventDefault();
    action.onTrigger();
  });
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
