import { useTranslation } from 'react-i18next';
import { Paper, Typography } from '@mui/material';
import { CommunitySection, EventsSection, LeadersSection } from './CommunitySection';
import { FaqSection, JoinSection, LanguagesSection } from './ExploreSection';
import { SectionHeading } from './HomePrimitives';
import { LandingHero, PlatformStatistics } from './LandingHero';
import { JourneySection, PlatformSection } from './PlatformSection';

const HomeLanding = () => {
  const { t } = useTranslation();
  return (
    <div className="kep-home kep-landing">
      <LandingHero />
      <div className="kep-trust-strip">
        <Typography variant="body2" color="text.secondary">
          {t('homePage.landing.trust')}
        </Typography>
        <PlatformStatistics />
      </div>
      <PlatformSection />
      <JourneySection />
      <LanguagesSection />
      <EventsSection hideWhenEmpty />
      <section className="kep-section" aria-label={t('homePage.landing.community.eyebrow')}>
        <SectionHeading
          eyebrow={t('homePage.landing.community.eyebrow')}
          title={t('homePage.landing.community.title')}
          description={t('homePage.landing.community.description')}
        />
        <Paper variant="panel" className="kep-dashboard kep-landing-community">
          <div className="kep-dashboard-grid">
            <CommunitySection compact title={t('homePage.landing.community.latestArticles')} />
            <LeadersSection compact />
          </div>
        </Paper>
      </section>
      <FaqSection />
      <JoinSection />
    </div>
  );
};
export default HomeLanding;
