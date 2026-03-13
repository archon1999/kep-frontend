import type { MutableRefObject } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getItemFromStore, setItemToStore } from 'shared/lib/utils';

interface UsePersistedCodeParams {
  storageKey?: string | null;
  template?: string | null;
}

interface UsePersistedCodeResult {
  initialCode: string;
  editorKey: string;
  codeRef: MutableRefObject<string>;
  hasCode: boolean;
  persistCode: (value: string, keyOverride?: string | null, resetEditor?: boolean) => void;
}

export const usePersistedCode = ({
  storageKey,
  template,
}: UsePersistedCodeParams): UsePersistedCodeResult => {
  const [initialCode, setInitialCode] = useState('');
  const [editorKey, setEditorKey] = useState('problem-editor');
  const [hasCode, setHasCode] = useState(false);
  const codeRef = useRef('');
  const lastKeyRef = useRef<string | null>(null);
  const isEditedRef = useRef(false);

  useEffect(() => {
    if (!storageKey) return;

    const isSameKey = lastKeyRef.current === storageKey;
    if (isSameKey && isEditedRef.current) return;

    const storedCode = (getItemFromStore(storageKey, '') as string) || '';
    const nextCode = storedCode || template || '';

    codeRef.current = nextCode;
    setInitialCode(nextCode);
    setHasCode(Boolean(nextCode));
    lastKeyRef.current = storageKey;
    isEditedRef.current = false;
    setEditorKey(`${storageKey}-${Date.now()}`);
  }, [storageKey, template]);

  const persistCode = useCallback(
    (value: string, keyOverride?: string | null, resetEditor = false) => {
      const keyToUse = keyOverride || storageKey;

      codeRef.current = value;
      setHasCode(Boolean(value));
      isEditedRef.current = true;
      lastKeyRef.current = keyToUse ?? lastKeyRef.current;
      if (keyToUse) {
        try {
          setItemToStore(keyToUse, JSON.stringify(value ?? ''));
        } catch {
          // ignore storage write errors to avoid breaking the editor
        }
      }

      if (resetEditor) {
        setInitialCode(value);
        setEditorKey(`${keyToUse ?? 'problem-editor'}-${Date.now()}`);
      }
    },
    [storageKey],
  );

  return { initialCode, editorKey, codeRef, hasCode, persistCode };
};
