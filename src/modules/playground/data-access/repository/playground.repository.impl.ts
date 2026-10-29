import { getSnippetsAPI } from 'shared/api/orval/generated/playground';
import type { PlaygroundRepository } from '../../domain';
import { toRun } from '../mappers';

const api = getSnippetsAPI();

export const playgroundRepository: PlaygroundRepository = {
  async run(request, signal) {
    return toRun(
      await api.apiPlaygroundRunsCreate(
        { lang: 'kep', sourceCode: request.code, inputData: request.input },
        { signal },
      ),
    );
  },
  async result(id, signal) {
    return toRun(await api.apiPlaygroundRunsRead(encodeURIComponent(id), { signal }));
  },
};
