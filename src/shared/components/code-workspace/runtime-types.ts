import type { Monaco } from '@monaco-editor/react';

const configured = new WeakSet<Monaco>();

/** Match the judge's Deno/ESNext environment instead of reporting browser-only errors. */
export const configureRuntimeTypes = (monaco: Monaco) => {
  if (configured.has(monaco)) return;
  configured.add(monaco);
  const typescript = monaco.languages.typescript;
  typescript.typescriptDefaults.setCompilerOptions({
    ...typescript.typescriptDefaults.getCompilerOptions(),
    target: typescript.ScriptTarget.ESNext,
    module: typescript.ModuleKind.ESNext,
    moduleDetection: 3,
    allowNonTsExtensions: true,
  });
  typescript.typescriptDefaults.addExtraLib(
    `
    declare namespace Deno {
      const stdin: { readonly readable: ReadableStream<Uint8Array> };
      const stdout: { write(data: Uint8Array): Promise<number> };
      function readTextFileSync(path: string | URL): string;
      function readTextFile(path: string | URL): Promise<string>;
      function readFileSync(path: string | URL): Uint8Array;
      function readFile(path: string | URL): Promise<Uint8Array>;
    }
  `,
    'file:///kep-runtime.d.ts',
  );
};
