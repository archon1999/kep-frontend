import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Paper, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { ScrambleText, ScrollReveal } from 'shared/components/motion/InteractionEffects';
import { SectionHeading } from './HomePrimitives';

const features = [
  { key: 'problems', route: resources.Problems, artwork: 'auth' },
  { key: 'plans', route: resources.StudyPlans, artwork: 'daily-tasks' },
  { key: 'contests', route: resources.Contests, artwork: 'competitions' },
  { key: 'duels', route: resources.Duels, artwork: 'battles' },
  { key: 'projects', route: resources.Projects, artwork: 'hackathon' },
] as const;

export const PlatformSection = () => {
  const { t } = useTranslation();
  return (
    <section className="kep-section kep-paths" id="platform">
      <SectionHeading
        eyebrow={t('homePage.landing.platform.eyebrow')}
        title={t('homePage.landing.platform.title')}
        description={t('homePage.landing.platform.description')}
      />
      <div className="kep-path-grid">
        {features.map(({ key, route, artwork }, index) => (
          <Paper variant="panel" className="kep-path-card" key={key}>
            <Link to={route} className="kep-path-link">
              <div className="kep-path-art">
                <Typography
                  component="span"
                  variant="metric"
                  color="text.secondary"
                  aria-hidden="true"
                >
                  0{index + 1}
                </Typography>
                <PatternArtwork kind={artwork} sx={{ width: 112 }} />
              </div>
              <Typography component="h3" variant="h5">
                <MixedText>{t(`homePage.landing.platform.${key}.title`)}</MixedText>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`homePage.landing.platform.${key}.description`)}
              </Typography>
              <span className="kep-path-action">
                <ScrambleText>{t(`homePage.landing.platform.${key}.action`)}</ScrambleText>
                <IconifyIcon icon="mdi:arrow-top-right" />
              </span>
            </Link>
          </Paper>
        ))}
      </div>
    </section>
  );
};

export const JourneySection = () => {
  const { t } = useTranslation();
  return (
    <section className="kep-section kep-practice-flow" id="how-it-works">
      <SectionHeading
        eyebrow={t('homePage.landing.journey.eyebrow')}
        title={t('homePage.landing.journey.title')}
      />
      <ol className="kep-practice-steps">
        {['choose', 'solve', 'improve'].map((key, index) => (
          <li key={key}>
            <ScrollReveal delay={index * 60}>
              <Typography
                component="span"
                variant="metric"
                color="primary"
                className="kep-practice-number"
                aria-hidden="true"
              >
                0{index + 1}
              </Typography>
              <Typography component="h3" variant="h5">
                <MixedText>{t(`homePage.landing.journey.${key}.title`)}</MixedText>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t(`homePage.landing.journey.${key}.description`)}
              </Typography>
            </ScrollReveal>
          </li>
        ))}
      </ol>
    </section>
  );
};
