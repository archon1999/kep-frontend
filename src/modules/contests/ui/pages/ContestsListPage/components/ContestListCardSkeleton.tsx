import { useTranslation } from 'react-i18next';
import { Chip, Paper, Skeleton, Typography } from '@mui/material';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';

/** The editorial card's own layout classes also determine its loading geometry. */
const ContestListCardSkeleton = () => {
  const { t } = useTranslation();
  return (
    <Paper
      variant="panel"
      className="contest-editorial-card contest-editorial-card--finished"
      sx={{ borderInline: 0, borderTop: 0 }}
    >
      <article role="status" aria-label={t('common.loading')} aria-busy="true">
        <PointerSpotlight className="contest-card-masthead">
          <header>
            <div className="contest-card-heading">
              <div className="contest-card-identity">
                <Chip variant="category" label={<Skeleton width={180} />} />
                <span className="contest-card-id">
                  <Skeleton width={28} />
                </span>
              </div>
              <div className="contest-card-badges">
                <Skeleton variant="rounded" width={72} height={30} />
                <Skeleton variant="rounded" width={64} height={30} />
              </div>
            </div>
            <h2>
              <a tabIndex={-1} aria-hidden="true">
                <span className="contest-title-text" style={{ flex: 1 }}>
                  <Skeleton width="72%" height="1.2em" />
                </span>
                <span className="contest-title-arrow">
                  <Skeleton variant="circular" width={32} height={32} />
                </span>
              </a>
            </h2>
          </header>
        </PointerSpotlight>
        <div className="contest-card-rule" aria-hidden="true" />
        <div className="contest-card-main">
          <div className="contest-announcement">
            <div className="contest-announcement-copy">
              <Skeleton height="1.7em" width="95%" />
              <Skeleton height="1.7em" width="80%" />
            </div>
            <span className="contest-text-action">
              <Skeleton width={130} height={20} />
            </span>
          </div>
          <aside className="contest-card-leaders">
            <Typography component="h3" variant="label">
              <Skeleton width={130} height={18} />
            </Typography>
            <ol>
              {[0, 1, 2].map((index) => (
                <li key={index}>
                  <span className="contest-podium-place">
                    <Skeleton width={20} height={20} />
                  </span>
                  <Skeleton width="60%" height={24} />
                </li>
              ))}
            </ol>
          </aside>
        </div>
        <dl className="contest-card-dates">
          {[0, 1, 2].map((index) => (
            <div key={index}>
              <Typography component="dt" variant="label">
                <Skeleton width={90} height={18} />
              </Typography>
              <dd>
                {index === 0 ? (
                  <span className="contest-format-value">
                    <Skeleton width={130} />
                  </span>
                ) : (
                  <span className="contest-schedule-time">
                    <Skeleton width={130} height="1.2em" />
                  </span>
                )}
              </dd>
            </div>
          ))}
        </dl>
        <div className="contest-card-bottom">
          <dl className="contest-card-counts">
            {[0, 1, 2].map((index) => (
              <div key={index}>
                <Typography component="dt" variant="label">
                  <Skeleton width={90} height={18} />
                </Typography>
                <Typography component="dd" variant="metric">
                  <Skeleton width={52} height="1.2em" />
                </Typography>
              </div>
            ))}
          </dl>
          <Skeleton variant="rounded" height={44} sx={{ width: { xs: '100%', sm: 152 } }} />
        </div>
      </article>
    </Paper>
  );
};
export default ContestListCardSkeleton;
