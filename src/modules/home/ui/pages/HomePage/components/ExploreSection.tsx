import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Chip,
  Paper,
  Skeleton,
  Typography,
} from '@mui/material';
import { resources } from 'app/routes/resources';
import { useProblemLanguages } from 'modules/problems/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { ScrollReveal } from 'shared/components/motion/InteractionEffects';
import { SectionAction, SectionHeading } from './HomePrimitives';

export const LanguagesSection = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useProblemLanguages();
  return (
    <section className="kep-section kep-toolkit">
      <SectionHeading
        eyebrow={t('homePage.landing.languages.eyebrow')}
        title={t('homePage.landing.languages.title')}
        description={t('homePage.landing.languages.description')}
      />
      {isLoading ? (
        <Skeleton variant="rectangular" height={64} />
      ) : error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => void mutate()}>{t('homePage.landing.retry')}</Button>}
        >
          {t('homePage.landing.loadError')}
        </Alert>
      ) : data?.length ? (
        <ul className="kep-toolkit-languages" aria-label={t('homePage.landing.language')}>
          {data.map((language) => (
            <li key={language.lang}>
              <Chip variant="soft" color="neutral" label={language.langFull} />
            </li>
          ))}
        </ul>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {t('homePage.landing.empty')}
        </Typography>
      )}
    </section>
  );
};

export const FaqSection = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | false>(0);
  return (
    <section className="kep-section" id="faq">
      <SectionHeading
        eyebrow={t('homePage.landing.faq.eyebrow')}
        title={t('homePage.landing.faq.title')}
        description={t('homePage.landing.faq.description')}
      />
      <Paper variant="panel" className="kep-faq-grid">
        <div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Accordion
              key={i}
              expanded={expanded === i}
              onChange={(_, open) => setExpanded(open ? i : false)}
              disableGutters
              elevation={0}
              className="kep-faq-item"
            >
              <AccordionSummary
                expandIcon={<IconifyIcon icon={expanded === i ? 'mdi:minus' : 'mdi:plus'} />}
                id={`faq-question-${i}`}
                aria-controls={`faq-answer-${i}`}
              >
                <Typography variant="subtitle1" fontWeight={600} component="span">
                  {t(`homePage.landing.faq.items.${i}.question`)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails id={`faq-answer-${i}`}>
                <Typography variant="body2" color="text.secondary">
                  {t(`homePage.landing.faq.items.${i}.answer`)}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
        <ScrollReveal className="kep-faq-aside">
          <PatternArtwork kind="daily-tasks" sx={{ width: 144, mb: 2 }} />
          <Typography component="h3" variant="h5">
            {t('homePage.landing.faq.asideTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('homePage.landing.faq.asideDescription')}
          </Typography>
          <SectionAction to={resources.StudyPlans} secondary>
            {t('homePage.landing.platform.plans.title')}
          </SectionAction>
        </ScrollReveal>
      </Paper>
    </section>
  );
};

export const JoinSection = () => {
  const { t } = useTranslation();
  return (
    <section className="kep-section kep-final-cta">
      <SectionHeading
        eyebrow={t('homePage.landing.final.eyebrow')}
        title={t('homePage.landing.final.title')}
        description={t('homePage.landing.final.description')}
      />
      <SectionAction to={resources.Problems}>{t('homePage.landing.startSolving')}</SectionAction>
    </section>
  );
};
