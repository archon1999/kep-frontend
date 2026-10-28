import { useTranslation } from 'react-i18next';
import { Box, Skeleton, Stack } from '@mui/material';
import { EventListCardSkeleton } from 'shared/components/sections/common/EventListCard';
import FramedPage from 'shared/components/sections/common/FramedPage';

const Heading = ({ action = false }: { action?: boolean }) => (
  <div className="kep-dashboard-panel-heading" style={action ? { marginBottom: 0 } : undefined}>
    <h2 style={{ flex: 1 }}>
      <Skeleton width="70%" height="1.35em" />
    </h2>
    {action ? (
      <Skeleton variant="rounded" width={132} height={40} />
    ) : (
      <Box
        className="kep-dashboard-pattern kep-dashboard-pattern-inline"
        sx={{ aspectRatio: '5 / 3' }}
      >
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>
    )}
  </div>
);

/** Uses the dashboard's responsive composition instead of unrelated loading blocks. */
const HomeDashboardSkeleton = () => {
  const { t } = useTranslation();
  return (
    <FramedPage>
      <div
        className="kep-dashboard"
        role="status"
        aria-busy="true"
        aria-label={t('homePage.dashboard.loading')}
      >
        <header className="kep-dashboard-header">
          <div className="kep-dashboard-welcome">
            <Skeleton width={180} height={14} />
            <h1>
              <Skeleton width="80%" height="1.2em" />
            </h1>
            <Skeleton width="95%" height={24} />
          </div>
          <div className="kep-dashboard-actions">
            <Skeleton variant="rounded" width={148} height={46} />
            <Skeleton width={108} height={18} />
          </div>
        </header>
        <section className="kep-dashboard-ratings-section">
          <div className="kep-dashboard-ratings">
            {[0, 1, 2, 3].map((index) => (
              <div className="kep-dashboard-rating" key={index}>
                <div className="kep-dashboard-rating-label">
                  <Skeleton width={100} />
                </div>
                <div className="kep-dashboard-rating-value">
                  <Skeleton width={88} height={36} />
                  <Skeleton width={48} height={16} />
                </div>
                <div className="kep-dashboard-rating-bar" />
              </div>
            ))}
          </div>
        </section>
        <div className="kep-dashboard-shortcuts">
          {[0, 1, 2].map((index) => (
            <div key={index} className="kep-dashboard-shortcut">
              <a aria-hidden="true">
                <span className="kep-dashboard-shortcut-icon">
                  <Skeleton variant="rectangular" width={24} height={24} />
                </span>
                <span className="kep-dashboard-shortcut-copy">
                  <strong>
                    <Skeleton width="75%" height={24} />
                  </strong>
                  <small>
                    <Skeleton width="100%" height={19} />
                    <Skeleton width="70%" height={19} />
                  </small>
                </span>
                <span>
                  <Skeleton width={16} height={16} />
                </span>
              </a>
            </div>
          ))}
        </div>
        <div className="kep-dashboard-grid">
          <div className="kep-dashboard-main">
            <div className="kep-dashboard-section">
              <Box
                sx={{
                  p: 'var(--kep-content-inset)',
                  pb: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Heading action />
              </Box>
              <EventListCardSkeleton description media />
            </div>
            <div className="kep-dashboard-calendar">
              <Skeleton variant="rectangular" width={24} height={24} />
              <p>
                <Skeleton width="95%" height={21} />
              </p>
              <Box
                className="kep-dashboard-pattern kep-dashboard-pattern-inline"
                sx={{ aspectRatio: '5 / 3' }}
              >
                <Skeleton variant="rectangular" width="100%" height="100%" />
              </Box>
              <Skeleton width={110} height={36} />
            </div>
          </div>
          <aside className="kep-dashboard-aside">
            <section className="kep-dashboard-panel kep-dashboard-history">
              <Heading />
              <Stack>
                {Array.from({ length: 5 }, (_, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    gap={2}
                    sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Skeleton width={44} height={42} />
                    <Box flex={1}>
                      <Skeleton width="75%" height={22} />
                      <Skeleton width="45%" height={18} />
                    </Box>
                    <Skeleton width={26} height={22} />
                  </Stack>
                ))}
              </Stack>
            </section>
          </aside>
        </div>
        <div className="kep-dashboard-grid">
          <section className="kep-dashboard-panel">
            <Heading />
            <Skeleton width="85%" height={34} />
            <Skeleton width="65%" height={34} />
            <Box sx={{ mt: 2 }}>
              <Skeleton width="100%" height={22} />
              <Skeleton width="80%" height={22} />
            </Box>
            <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 3 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Skeleton width={80} />
            </Stack>
          </section>
          <section className="kep-dashboard-panel kep-dashboard-leaders">
            <Heading />
            <Stack direction="row" gap={1} sx={{ height: 42, mb: 1 }}>
              {[0, 1, 2, 3].map((index) => (
                <Skeleton key={index} width="25%" height={28} />
              ))}
            </Stack>
            <div className="kep-three-grid">
              {[0, 1, 2].map((index) => (
                <div className="kep-leader-card" key={index}>
                  <div className="kep-leader-loading-row">
                    <span className="kep-leader-rank">
                      <Skeleton width={18} />
                    </span>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box>
                      <Skeleton width="80%" />
                      <Skeleton width="65%" />
                    </Box>
                    <Skeleton width={64} />
                  </div>
                </div>
              ))}
            </div>
            <Box sx={{ mt: 2.5 }}>
              <Skeleton width={130} height={20} />
            </Box>
          </section>
        </div>
        <div className="kep-dashboard-grid">
          <section className="kep-dashboard-panel">
            <Heading />
            {Array.from({ length: 7 }, (_, index) => (
              <Stack
                key={index}
                direction="row"
                gap={1.5}
                alignItems="center"
                sx={{ height: 52, borderTop: 1, borderColor: 'divider' }}
              >
                <Skeleton width={32} height={32} />
                <Skeleton width="75%" />
                <Skeleton width={40} height={24} />
              </Stack>
            ))}
          </section>
          <section className="kep-dashboard-panel">
            <Heading />
            {Array.from({ length: 5 }, (_, index) => (
              <Stack
                key={index}
                direction="row"
                gap={1.5}
                alignItems="center"
                sx={{ minHeight: 79, borderTop: 1, borderColor: 'divider' }}
              >
                <Skeleton width={32} height={40} />
                <Skeleton variant="circular" width={32} height={32} />
                <Box flex={1}>
                  <Skeleton width="85%" />
                  <Skeleton width="55%" />
                </Box>
                <Skeleton width={32} height={40} />
              </Stack>
            ))}
          </section>
        </div>
      </div>
    </FramedPage>
  );
};
export default HomeDashboardSkeleton;
