import { useEffect, useEffectEvent, useRef, useState } from 'react';

const useDebouncedInput = (value: string, onValueChange: (value: string) => void, delay = 300) => {
  const [input, setInput] = useState({
    sourceValue: value,
    draftValue: value,
    submittedValue: undefined as string | undefined,
  });
  const [isComposing, setIsComposing] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // A delayed acknowledgement must not replace text typed since the last submission.
  if (input.sourceValue !== value) {
    setInput({
      sourceValue: value,
      draftValue: input.submittedValue === value ? input.draftValue : value,
      submittedValue: undefined,
    });
  }

  const cancelPendingChange = () => clearTimeout(timeoutRef.current);
  const commit = (nextValue = input.draftValue) => {
    cancelPendingChange();
    if (!isComposing && nextValue !== value && nextValue !== input.submittedValue) {
      setInput((current) => ({ ...current, submittedValue: nextValue }));
      onValueChange(nextValue);
    }
  };
  const commitLatest = useEffectEvent(commit);

  useEffect(() => {
    if (input.draftValue === value || input.draftValue === input.submittedValue || isComposing)
      return;

    timeoutRef.current = setTimeout(() => commitLatest(input.draftValue), delay);
    return cancelPendingChange;
  }, [delay, input.draftValue, input.submittedValue, isComposing, value]);

  const setValue = (nextValue: string) => {
    cancelPendingChange();
    setInput((current) => ({ ...current, draftValue: nextValue }));
    if (nextValue === '') commit(nextValue);
  };

  return { value: input.draftValue, setValue, commit, isComposing, setIsComposing };
};

export default useDebouncedInput;
