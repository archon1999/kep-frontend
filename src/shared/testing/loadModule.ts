import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

/** Execute real TypeScript modules in Node while replacing browser/API boundaries. */
export const loadModule = (entry: URL, mocks: Record<string, unknown> = {}) => {
  const require = createRequire(import.meta.url);
  const sourceRoot = fileURLToPath(new URL('../../', import.meta.url));
  const cache = new Map<string, { exports: any }>();
  const load = (file: string): any => {
    if (cache.has(file)) return cache.get(file)!.exports;
    const module = { exports: {} };
    cache.set(file, module);
    const source = ts.transpileModule(readFileSync(file, 'utf8'), {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    const localRequire = (specifier: string) => {
      if (specifier in mocks) return mocks[specifier];
      if (!specifier.startsWith('.') && !/^(app|shared|modules)\//.test(specifier))
        return require(specifier);
      const path = resolve(specifier.startsWith('.') ? dirname(file) : sourceRoot, specifier);
      const target = [path, `${path}.ts`, `${path}.tsx`, resolve(path, 'index.ts')].find(
        (candidate) => existsSync(candidate) && /\.(ts|tsx|json)$/.test(candidate),
      );
      if (!target) throw new Error(`Cannot load ${specifier} from ${file}`);
      if (target.endsWith('.json')) return JSON.parse(readFileSync(target, 'utf8'));
      return load(target);
    };
    new Function('require', 'module', 'exports', source)(localRequire, module, module.exports);
    return module.exports;
  };
  return load(fileURLToPath(entry));
};
