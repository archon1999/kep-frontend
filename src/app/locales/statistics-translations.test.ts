import i18next from 'i18next';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const resource = (language: string) =>
  Object.assign(
    {},
    ...['common', 'contests', 'problems', 'challenges'].map((name) =>
      JSON.parse(
        readFileSync(new URL(`./langs/${language}/${name}.json`, import.meta.url), 'utf8').replace(
          /^\uFEFF/,
          '',
        ),
      ),
    ),
  );

const examples = {
  en: [
    ['contests.statistics.attemptsCount', 1, '1 attempt'],
    ['contests.statistics.attemptsCount', 5, '5 attempts'],
    ['challenges.statisticsPage.formats.questionsCount', 1, '1 question'],
    ['challenges.statisticsPage.formats.questionsCount', 4, '4 questions'],
    ['common.statistics.days', 1, '1 day'],
  ],
  ru: [
    ['contests.statistics.attemptsCount', 1, '1 попытка'],
    ['contests.statistics.attemptsCount', 2, '2 попытки'],
    ['contests.statistics.attemptsCount', 5, '5 попыток'],
    ['challenges.statisticsPage.formats.questionsCount', 21, '21 вопрос'],
    ['common.statistics.days', 2, '2 дня'],
  ],
  uz: [
    ['contests.statistics.attemptsCount', 1, '1 ta urinish'],
    ['contests.statistics.attemptsCount', 5, '5 ta urinish'],
    ['challenges.statisticsPage.formats.questionsCount', 1, '1 ta savol'],
    ['challenges.statisticsPage.formats.questionsCount', 4, '4 ta savol'],
    ['common.statistics.days', 1, '1 kun'],
  ],
} as const;

for (const language of ['en', 'ru', 'uz'] as const) {
  test(`statistics counts and headings resolve in ${language}`, async () => {
    const instance = i18next.createInstance();
    await instance.init({
      lng: language,
      fallbackLng: false,
      resources: { [language]: { translation: resource(language) } },
    });
    for (const [key, count, expected] of examples[language]) {
      assert.equal(instance.t(key, { count }), expected);
    }
    for (const key of [
      'common.statistics.total',
      'contests.statistics.headToHead',
      'problems.statisticsPage.heatmap.last365Days',
      'challenges.statisticsPage.knowledge.seenShort',
      'challenges.statisticsPage.questionTypes.chessPuzzle',
    ]) {
      assert.notEqual(instance.t(key), key);
    }
  });
}
