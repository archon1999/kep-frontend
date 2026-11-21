import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { competitionEvents } from '../../data-access/competition-events';
import type { CompetitionEventId } from '../../domain/entities/competition-event.types';

export const useCompetitionEvent = (id: CompetitionEventId) => {
  const { t, i18n } = useTranslation();
  const event = competitionEvents.find((entry) => entry.id === id)!;
  const [now, setNow] = useState(Date.now);
  const currentStage = event.stages.find((stage) => Date.parse(stage.end) > now);
  const live = Boolean(currentStage && Date.parse(currentStage.start) <= now);
  const archived = !currentStage;
  const target = currentStage ? Date.parse(live ? currentStage.end : currentStage.start) : now;
  const seconds = Math.max(0, Math.floor((target - now) / 1000));

  useEffect(() => {
    if (archived) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [archived]);

  const locale = i18n.resolvedLanguage || i18n.language;
  const formatters = useMemo(
    () => ({
      number: new Intl.NumberFormat(locale),
      day: new Intl.DateTimeFormat(locale, { day: '2-digit', timeZone: 'Asia/Tashkent' }),
      month: new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'Asia/Tashkent' }),
      date: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Tashkent',
      }),
      time: new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
        timeZone: 'Asia/Tashkent',
      }),
    }),
    [locale],
  );
  const copy = (key: string) => t(`competitionEvents.events.${id}.${key}`);
  const common = (key: string, values?: Record<string, string | number>) =>
    t(`competitionEvents.${key}`, values);
  const sectionTitle = (key: string) =>
    t([`competitionEvents.events.${id}.sections.${key}`, `competitionEvents.sections.${key}`]);

  return {
    event,
    editions: competitionEvents.filter((edition) =>
      id === 'junior2024' ? edition.id === id : edition.id !== 'junior2024',
    ),
    copy,
    common,
    sectionTitle,
    archived,
    live,
    currentStage,
    formatters,
    countdown: [
      { key: 'days', value: Math.floor(seconds / 86400) },
      { key: 'hours', value: Math.floor(seconds / 3600) % 24 },
      { key: 'minutes', value: Math.floor(seconds / 60) % 60 },
      { key: 'seconds', value: seconds % 60 },
    ],
  };
};

export type CompetitionEventModel = ReturnType<typeof useCompetitionEvent>;
