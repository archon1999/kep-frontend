import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Button, Skeleton, Tooltip } from '@mui/material';
import { getResourceByUsername, resources } from 'app/routes/resources';
import { useUserRatings } from 'modules/home/application/queries';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import ChallengesRatingChip from 'shared/components/rating/ChallengesRatingChip';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import { DashboardPattern } from './DashboardPattern';

const ratings = [
  { key: 'skillsRating', label: 'skills', pattern: 'hackathon' },
  { key: 'activityRating', label: 'activity', pattern: 'daily-tasks' },
  { key: 'contestsRating', label: 'contests', pattern: 'competitions' },
  { key: 'challengesRating', label: 'challenges', pattern: 'battles' },
] as const;

const DashboardRatings = ({ username }: { username: string }) => {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useUserRatings(username);
  return (
    <section className="kep-dashboard-ratings-section" aria-label={t('homePage.ranks.title')}>
      {error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => void mutate()}>{t('homePage.landing.retry')}</Button>}
        >
          {t('homePage.landing.loadError')}
        </Alert>
      ) : (
        <div className="kep-dashboard-ratings">
          {ratings.map(({ key, label, pattern }) => {
            const rating = data?.[key];
            const percentile = Math.min(100, Math.max(0, rating?.percentile ?? 0));
            return (
              <PointerSpotlight className="kep-dashboard-rating" key={key}>
                <DashboardPattern kind={pattern} />
                <div className="kep-dashboard-rating-label">
                  <Link to={getResourceByUsername(resources.UserProfileRatings, username)}>
                    {t(`homePage.ranks.labels.${label}`)} <span aria-hidden="true">↗</span>
                  </Link>
                  {!isLoading &&
                    rating?.title &&
                    (key === 'contestsRating' || key === 'challengesRating') && (
                      <div className="kep-dashboard-rating-title">
                        {key === 'contestsRating' ? (
                          <ContestsRatingChip title={rating.title} imgSize={24} withTitle />
                        ) : (
                          <ChallengesRatingChip
                            title={rating.title}
                            size="small"
                            aria-label={rating.title}
                          />
                        )}
                      </div>
                    )}
                </div>
                <div className="kep-dashboard-rating-value">
                  {isLoading ? (
                    <>
                      <Skeleton width={88} height={36} />
                      <Skeleton width={48} height={16} />
                    </>
                  ) : (
                    <>
                      <strong>{rating?.value ?? '—'}</strong>
                      <small>
                        {rating?.rank
                          ? t('homePage.dashboard.rank', { rank: rating.rank })
                          : t('homePage.dashboard.unranked')}
                      </small>
                    </>
                  )}
                </div>
                <Tooltip title={t('homePage.ranks.percentile', { percentile })}>
                  <div
                    className="kep-dashboard-rating-bar"
                    role="progressbar"
                    aria-label={t(`homePage.ranks.labels.${label}`)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentile}
                  >
                    <span style={{ width: `${percentile}%` }} />
                  </div>
                </Tooltip>
              </PointerSpotlight>
            );
          })}
        </div>
      )}
    </section>
  );
};
export default DashboardRatings;
