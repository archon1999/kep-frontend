import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Button, Skeleton } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useFeaturedContestPromo } from 'modules/home/application/hooks/useFeaturedContestPromo';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import FilterButton from 'shared/components/common/FilterButton';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import PageHeader from 'shared/components/sections/common/PageHeader';
import UpcomingContestLink from './components/UpcomingContestLink';
import { contestsHeroSx } from './hero.styles';

interface ContestsListPageHeroCardProps {
  canViewMyStats: boolean;
  filtersOpen: boolean;
  activeFilters: Array<{ key: string; label: string; onRemove: () => void }>;
  onClearFilters: () => void;
  onToggleFilters: MouseEventHandler<HTMLButtonElement>;
}

const ContestsListPageHeroCard = ({
  canViewMyStats,
  filtersOpen,
  activeFilters,
  onClearFilters,
  onToggleFilters,
}: ContestsListPageHeroCardProps) => {
  const { t } = useTranslation();
  const { nextContest, isLoading } = useFeaturedContestPromo({ revalidateOnUpcomingStart: true });
  const upcomingAction = nextContest?.startTime ? (
    <UpcomingContestLink
      title={nextContest.title}
      startTime={nextContest.startTime}
      href={nextContest.href}
    />
  ) : isLoading ? (
    <Skeleton
      variant="rectangular"
      sx={{ height: { xs: 145, sm: 115, md: 90 } }}
      aria-hidden="true"
    />
  ) : undefined;

  return (
    <>
      <PageHeader
        variant="hero"
        title={t('contests.title')}
        titleId="contests-list-title"
        subtitle={t('contests.subtitle')}
        actionComponent={upcomingAction}
        sx={contestsHeroSx}
      />
      <div className="contests-list-toolbar">
        <div className="contests-filter-controls">
          <FilterButton
            onClick={onToggleFilters}
            aria-haspopup="dialog"
            aria-expanded={filtersOpen}
            aria-controls={filtersOpen ? 'contests-filter-menu' : undefined}
            label={t('problems.filters')}
            endIcon={<IconifyIcon icon={filtersOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'} />}
          />
          {activeFilters.map((filter) => (
            <button
              className="contests-inline-filter"
              key={filter.key}
              onClick={filter.onRemove}
              aria-label={t('contests.filters.remove', { label: filter.label })}
              title={filter.label}
            >
              <span>{filter.label}</span>
              <IconifyIcon icon="mdi:close" aria-hidden="true" />
            </button>
          ))}
          {activeFilters.length > 1 && (
            <button
              className="contests-clear-filters"
              onClick={onClearFilters}
              aria-label={t('problems.clearFilters')}
              title={t('problems.clearFilters')}
            >
              <IconifyIcon icon="mdi:filter-remove-outline" />
            </button>
          )}
        </div>
        <div className="contests-list-shortcuts">
          <Button
            component={RouterLink}
            to={resources.ContestsRating}
            variant="outlined"
            startIcon={<IconifyIcon icon="mdi:trophy-outline" />}
          >
            <ScrambleText>{t('contests.viewRating')}</ScrambleText>
          </Button>
          {canViewMyStats && (
            <Button
              component={RouterLink}
              to={resources.ContestsUserStatistics}
              variant="outlined"
              startIcon={<IconifyIcon icon="mdi:chart-line" />}
            >
              <ScrambleText>{t('contests.viewMyStats')}</ScrambleText>
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ContestsListPageHeroCard;
