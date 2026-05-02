import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import FilterButton from 'shared/components/common/FilterButton';
import Logo from 'shared/components/common/Logo';
import { cssVarRgba } from 'shared/lib/utils';

interface ContestsListPageHeroCardProps {
  canViewMyStats: boolean;
  filtersOpen: boolean;
  activeFiltersCount: number;
  onToggleFilters: (event: MouseEvent<HTMLButtonElement>) => void;
}

const ContestsListPageHeroCard = ({
  canViewMyStats,
  filtersOpen,
  activeFiltersCount,
  onToggleFilters,
}: ContestsListPageHeroCardProps) => {
  const { t } = useTranslation();

  return (
    <Card
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: 'background.paper',
        background: `linear-gradient(135deg, ${cssVarRgba(theme.vars.palette.primary.lightChannel, 0.08)}, ${cssVarRgba(theme.vars.palette.primary.mainChannel, 0.06)})`,
      })}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction="column" spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ sm: 'center' }}
            spacing={2}
          >
            <Stack direction="column" spacing={1}>
              <Typography variant="h4" fontWeight={800}>
                {t('contests.title')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
                {t('contests.subtitle')}
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.25}
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Button
                component={RouterLink}
                to={resources.ContestsRating}
                variant="contained"
                color="primary"
                startIcon={<IconifyIcon icon="mdi:trophy" sx={{ fontSize: 20 }} />}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                {t('contests.viewRating')}
              </Button>

              {canViewMyStats ? (
                <Button
                  component={RouterLink}
                  to={resources.ContestsUserStatistics}
                  variant="outlined"
                  color="primary"
                  startIcon={<IconifyIcon icon="mdi:chart-line" sx={{ fontSize: 20 }} />}
                  sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
                >
                  {t('contests.viewMyStats')}
                </Button>
              ) : null}

              <FilterButton
                onClick={onToggleFilters}
                aria-haspopup="true"
                aria-expanded={filtersOpen ? 'true' : undefined}
                aria-controls={filtersOpen ? 'contests-filters-menu' : undefined}
                label={t('problems.filters')}
                badgeContent={activeFiltersCount}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <Box
        sx={{
          position: 'absolute',
          right: { xs: -24, md: 24 },
          bottom: { xs: -24, md: 8 },
          opacity: 0.08,
          pointerEvents: 'none',
        }}
      >
        <Logo sx={{ width: { xs: 200, md: 280 }, height: { xs: 200, md: 280 } }} />
      </Box>
    </Card>
  );
};

export default ContestsListPageHeroCard;
