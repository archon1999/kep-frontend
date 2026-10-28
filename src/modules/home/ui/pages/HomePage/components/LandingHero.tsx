import { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Button, Chip, Paper, Skeleton, Typography } from '@mui/material';
import { normalizeSupportedLocale } from 'app/locales/locale';
import { resources } from 'app/routes/resources';
import { useHomePromos, useLandingPageStatistics } from 'modules/home/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { ScrollReveal } from 'shared/components/motion/InteractionEffects';
import { PageHeroSurface } from 'shared/components/sections/common/PageHeader';
import { SectionAction } from './HomePrimitives';

const ProblemExplorer = lazy(() => import('./ProblemExplorer'));

export const LandingHero = () => {
  const { t } = useTranslation();
  const { data: promos } = useHomePromos();
  const event = promos?.find((promo) => promo.type === 'arena' || promo.type === 'contest');
  return (
    <section className="kep-hero" aria-labelledby="kep-home-title">
      <PageHeroSurface element="div" className="kep-hero-copy">
        <div className="kep-hero-heading">
          <Chip variant="category" label={t('homePage.landing.hero.eyebrow')} />
          <Typography component="h1" variant="h1" id="kep-home-title">
            <MixedText>{t('homePage.landing.hero.title')}</MixedText>
            <br />
            <span className="kep-hero-highlight">
              <MixedText>{t('homePage.landing.hero.highlight')}</MixedText>
            </span>
          </Typography>
        </div>
        <div className="kep-hero-summary">
          <Typography variant="body1" color="text.secondary">
            {t('homePage.landing.hero.description')}
          </Typography>
          <div className="kep-hero-actions">
            <SectionAction to={resources.Problems}>
              {t('homePage.landing.startSolving')}
            </SectionAction>
            <Button
              component="a"
              href="#platform"
              variant="text"
              endIcon={<IconifyIcon icon="mdi:arrow-down" />}
            >
              {t('homePage.landing.hero.explorePlatform')}
            </Button>
          </div>
        </div>
      </PageHeroSurface>
      <div className="kep-hero-stage">
        <div className="kep-demo-heading">
          <Typography component="span" variant="label" color="text.secondary">
            {t('homePage.landing.hero.tryWorkspace')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('homePage.landing.workspace.hint')}
          </Typography>
        </div>
        <ScrollReveal delay={120}>
          <Paper variant="panel" className="kep-explorer-window">
            <Suspense fallback={<Skeleton variant="rectangular" height="100%" />}>
              <ProblemExplorer />
            </Suspense>
          </Paper>
        </ScrollReveal>
        <div className="kep-hero-next">
          {event ? (
            <Link to={event.href}>
              <span className="kep-live-dot" aria-hidden="true" />
              {event.typeLabel} · {event.title}{' '}
              <IconifyIcon icon="mdi:arrow-top-right" aria-hidden="true" />
            </Link>
          ) : (
            <Link to={resources.StudyPlans}>
              {t('homePage.landing.hero.planLink')}{' '}
              <IconifyIcon icon="mdi:arrow-top-right" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export const PlatformStatistics = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error, mutate } = useLandingPageStatistics();
  if (error) {
    return (
      <Alert
        severity="error"
        action={<Button onClick={() => void mutate()}>{t('homePage.landing.retry')}</Button>}
      >
        {t('homePage.landing.loadError')}
      </Alert>
    );
  }
  return (
    <div className="kep-statistics" aria-label={t('homePage.statistics.title')}>
      {(['users', 'problems', 'competitions', 'attempts'] as const).map((key) => (
        <div key={key}>
          <Typography component="strong" variant="pixel">
            {isLoading ? (
              <Skeleton width={100} />
            ) : data ? (
              new Intl.NumberFormat(normalizeSupportedLocale(i18n.language)).format(data[key].value)
            ) : (
              '—'
            )}
          </Typography>
          <Typography component="span" variant="label" color="text.secondary">
            {t(`homePage.statistics.cards.${key}`)}
          </Typography>
        </div>
      ))}
    </div>
  );
};
