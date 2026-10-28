import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { useBreakpoints } from 'app/providers/BreakpointsProvider.tsx';
import { resources } from 'app/routes/resources.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

const ProblemsListHeaderActions = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  const { t } = useTranslation();
  const { down } = useBreakpoints();
  const headerActionButtonVariant = down('md') ? 'soft' : 'text';
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, auto)',
        },
        gap: 1,
        width: { xs: 1, sm: 'auto' },
      }}
    >
      <Button
        component={RouterLink}
        to={resources.ProblemsRating}
        variant={headerActionButtonVariant}
        color="primary"
        startIcon={<IconifyIcon icon="mdi:chart-line" />}
        sx={{
          minWidth: 0,
          px: { xs: 1, sm: 1.5 },
          justifyContent: 'center',
          whiteSpace: 'normal',
          lineHeight: 1.25,
        }}
      >
        {t('problems.ratingButton')}
      </Button>
      <Button
        component={RouterLink}
        to={resources.Attempts}
        variant={headerActionButtonVariant}
        color="primary"
        startIcon={<IconifyIcon icon="mdi:target" />}
        sx={{
          minWidth: 0,
          px: { xs: 1, sm: 1.5 },
          justifyContent: 'center',
          whiteSpace: 'normal',
          lineHeight: 1.25,
        }}
      >
        {t('problems.attemptsButton')}
      </Button>
      {isAuthenticated ? (
        <Button
          component={RouterLink}
          to={resources.ProblemsUserStatistics}
          variant={headerActionButtonVariant}
          color="primary"
          startIcon={<IconifyIcon icon="mdi:chart-bar" />}
          sx={{
            gridColumn: { xs: '1 / -1', sm: 'auto' },
            minWidth: 0,
            px: { xs: 1, sm: 1.5 },
            justifyContent: 'center',
            whiteSpace: 'normal',
            lineHeight: 1.25,
          }}
        >
          {t('problems.statisticsPage.title')}
        </Button>
      ) : null}
    </Box>
  );
};
export default ProblemsListHeaderActions;
