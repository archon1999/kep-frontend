import { act, createElement, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';
import { loadModule } from '../../../../../shared/testing/loadModule.ts';

const { JSDOM } = createRequire(import.meta.url)('jsdom');

test('template save shortcuts stay inside the portal and apply the latest editor model', async () => {
  const dom = new JSDOM('<!doctype html><html><body><main></main></body></html>');
  const previous = new Map(
    ['window', 'document', 'IS_REACT_ACT_ENVIRONMENT'].map((name) => [
      name,
      Object.getOwnPropertyDescriptor(globalThis, name),
    ]),
  );
  for (const [name, value] of Object.entries({
    window: dom.window,
    document: dom.window.document,
    IS_REACT_ACT_ENVIRONMENT: true,
  }))
    Object.defineProperty(globalThis, name, { configurable: true, value, writable: true });
  const root = createRoot(dom.window.document.querySelector('main')!);
  try {
    const primitive =
      (tag: string) =>
      ({ children, onClick, disabled }: any) =>
        createElement(tag, { onClick, disabled }, children);
    const Dialog = ({ children, onKeyDownCapture }: any) =>
      createPortal(createElement('div', { onKeyDownCapture }, children), dom.window.document.body);
    const CodeEditor = ({ onMount }: any) => {
      useEffect(() => {
        onMount({ getValue: () => 'latest model\n' });
      }, [onMount]);
      return createElement('button', { id: 'editor' }, 'Editor');
    };
    const Component = loadModule(new URL('./CodeTemplateDialog.tsx', import.meta.url), {
      '@mui/material': {
        Dialog,
        Button: primitive('button'),
        Box: primitive('div'),
        DialogActions: primitive('div'),
        DialogContent: primitive('div'),
        FormHelperText: primitive('div'),
        LinearProgress: primitive('div'),
        Stack: primitive('div'),
        Typography: primitive('span'),
      },
      'react-i18next': { useTranslation: () => ({ t: (key: string) => key }) },
      'shared/components/common/DialogHeader': () => null,
      'shared/components/problems/AttemptLanguage': () => null,
      'shared/components/code-workspace/CodeEditor': { CodeEditor },
      './SchemaField': () => null,
    }).default;
    for (const [disabled, modifier] of [
      [false, 'ctrlKey'],
      [false, 'metaKey'],
      [true, 'ctrlKey'],
    ] as const) {
      const applied: unknown[] = [];
      let parentKeys = 0;
      let closed = 0;
      await act(async () => {
        root.render(
          createElement(
            'form',
            {
              onKeyDown: () => {
                parentKeys += 1;
              },
            },
            createElement(Component, {
              key: `${disabled}:${modifier}`,
              row: { id: '1', values: { lang: 'py', code_template: 'old React value' } },
              languageName: 'Python',
              disabled,
              onApply: (value: unknown) => {
                applied.push(value);
              },
              onClose: () => {
                closed += 1;
              },
            }),
          ),
        );
      });
      const event = new dom.window.KeyboardEvent('keydown', {
        key: 's',
        [modifier]: true,
        bubbles: true,
        cancelable: true,
      });
      await act(async () => {
        dom.window.document.getElementById('editor')!.dispatchEvent(event);
      });
      assert.equal(parentKeys, 0, 'The parent form must never handle a template shortcut');
      assert.equal(event.defaultPrevented, true);
      assert.deepEqual(applied, disabled ? [] : [{ code_template: 'latest model\n' }]);
      assert.equal(closed, disabled ? 0 : 1);
    }
  } finally {
    await act(async () => root.unmount());
    dom.window.close();
    for (const [name, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  }
});
