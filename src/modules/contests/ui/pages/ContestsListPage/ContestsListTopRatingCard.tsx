import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Paper, Skeleton, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useContestsRating } from 'modules/contests/application/queries';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { PointerSpotlight, ScrambleText } from 'shared/components/motion/InteractionEffects';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import {
  getContestsRatingLevelByRating,
  getContestsRatingLevelByTitle,
} from 'shared/components/rating/contestsRating';

const ContestsListTopRatingCard = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useContestsRating({
    page: 1,
    pageSize: 10,
    ordering: '-rating',
  });
  const rows = data?.data.slice(0, 10) ?? [];
  return (
    <Paper
      component="aside"
      variant="panel"
      sx={{ border: 0 }}
      className="contest-leaderboard"
      aria-labelledby="contest-leaderboard-title"
    >
      <PointerSpotlight className="contest-leaderboard-header">
        <div>
          <Typography component="p" variant="label" className="contest-leaderboard-eyebrow">
            <span className="kep-pixel-cross" aria-hidden="true" />
            {t('contests.card.leaderboard')}
          </Typography>
          <h2 id="contest-leaderboard-title">
            {t('contests.topRating.title')
              .split(/(10)/)
              .map((part, index) =>
                part === '10' ? (
                  <span className="contest-leaderboard-ten" key={index}>
                    {part}
                  </span>
                ) : (
                  part
                ),
              )}
          </h2>
        </div>
        <svg
          className="contest-leaderboard-podium"
          viewBox="0 0 64 52"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2 50V28H21V50M22 50V12H41V50M42 50V35H61V50M0 51H64" stroke="currentColor" />
          <path d="M28 2H35M31.5 0V5" stroke="currentColor" />
          <path d="M28 21H35M31.5 18V25" stroke="currentColor" strokeWidth="2" />
        </svg>
      </PointerSpotlight>
      <div className="contest-card-rule" aria-hidden="true" />
      {isLoading ? (
        <div className="contest-leaderboard-loading">
          {Array.from({ length: 10 }, (_, index) => (
            <Skeleton key={index} height={40} />
          ))}
        </div>
      ) : error ? (
        <p className="contest-leaderboard-message" role="alert">
          {t('contests.card.ratingError')}
        </p>
      ) : !rows.length ? (
        <p className="contest-leaderboard-message">{t('contests.rating.empty')}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th scope="col">
                <Typography variant="label" className="contest-table-rank-label">
                  {t('contests.rating.columns.place')}
                </Typography>
              </th>
              <th scope="col">
                <Typography variant="label" className="contest-table-label">
                  <IconifyIcon icon="mdi:account-outline" aria-hidden="true" />
                  {t('contests.rating.columns.user')}
                </Typography>
              </th>
              <th scope="col">
                <Typography variant="label" className="contest-table-label">
                  <IconifyIcon icon="mdi:chart-line" aria-hidden="true" />
                  {t('contests.rating.columns.rating')}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const level =
                getContestsRatingLevelByRating(row.rating) ??
                getContestsRatingLevelByTitle(row.ratingTitle);
              return (
                <tr
                  key={row.username}
                  className={
                    index < 3
                      ? `contest-ranking-row contest-ranking-row--${index + 1}`
                      : 'contest-ranking-row'
                  }
                >
                  <td>
                    <span className={`contest-ranking-place ${index < 3 ? 'is-podium' : ''}`}>
                      {String(row.rowIndex ?? index + 1).padStart(2, '0')}
                    </span>
                  </td>
                  <td>
                    <UserPopover username={row.username}>
                      <button
                        type="button"
                        className="contest-user-button"
                        title={row.username}
                        style={{ '--contest-user-color': level?.color } as CSSProperties}
                      >
                        <span className="contest-user-name">{row.username}</span>
                        <IconifyIcon
                          className="contest-user-arrow"
                          icon="mdi:arrow-top-right"
                          aria-hidden="true"
                        />
                      </button>
                    </UserPopover>
                  </td>
                  <td>
                    <span className="contest-rating-score">
                      <ContestsRatingChip title={row.ratingTitle || level?.title} imgSize={24} />
                      <Typography variant="metric" className="contest-rating-value">
                        {row.rating ?? '—'}
                      </Typography>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <Link className="contest-leaderboard-footer" to={resources.ContestsRating}>
        <ScrambleText>{t('contests.topRating.viewAll')}</ScrambleText>
        <IconifyIcon icon="mdi:arrow-top-right" />
      </Link>
    </Paper>
  );
};
export default ContestsListTopRatingCard;
