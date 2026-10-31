import { getSnippetsAPI } from 'shared/api/orval/generated/playground';
import { RunLang } from 'shared/api/orval/generated/playground/index.schemas';
import type { PlaygroundRepository } from '../../domain';
import { toLanguage, toRun } from '../mappers';

const api = getSnippetsAPI();

export const playgroundRepository: PlaygroundRepository = {
  async languages() {
    return (await api.apiPlaygroundLanguagesList()).map(toLanguage);
  },
  async run(request, signal) {
    const lang = Object.values(RunLang).find((value) => value === request.lang);
    if (!lang) throw new Error('Unsupported execution language');
    return toRun(
      await api.apiPlaygroundRunsCreate(
        { lang, sourceCode: request.code, inputData: request.input },
        { signal },
      ),
    );
  },
  async result(id, signal) {
    return toRun(await api.apiPlaygroundRunsRead(encodeURIComponent(id), { signal }));
  },
};
