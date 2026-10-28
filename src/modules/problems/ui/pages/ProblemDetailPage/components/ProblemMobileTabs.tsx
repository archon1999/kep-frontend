import { useTranslation } from 'react-i18next';
import { Tab, Tabs } from '@mui/material';
import type { useProblemDetailPage } from 'modules/problems/application/hooks/useProblemDetailPage';
import IconifyIcon from 'shared/components/base/IconifyIcon';

type Props = {
  model: Pick<ReturnType<typeof useProblemDetailPage>, 'activeTab' | 'handleTabChange'>;
};
export const ProblemMobileTabs = ({ model }: Props) => {
  const { activeTab, handleTabChange } = model;
  const { t } = useTranslation();

  return (
    <Tabs
      value={activeTab}
      onChange={(_, value) => handleTabChange(value)}
      variant="fullWidth"
      aria-label={t('problems.detail.problemTab')}
      sx={{
        flexShrink: 0,
        bgcolor: 'background.default',
        '& .MuiTab-root': {
          minHeight: 58,
          minWidth: 0,
          px: 0.25,
          fontSize: { xs: 10, sm: 11 },
          fontWeight: 500,
          textTransform: 'none',
          whiteSpace: 'nowrap',
          '& .MuiTab-iconWrapper': { mb: 0.25 },
        },
        '& .MuiTab-root.Mui-selected': { fontWeight: 700 },
      }}
    >
      <Tab
        value="description"
        label={t('problems.detail.problemTab')}
        icon={<IconifyIcon icon="mdi:book-open-page-variant" sx={{ fontSize: 19 }} />}
        iconPosition="top"
      />
      <Tab
        value="code"
        label={t('problems.studyPlans.solve')}
        icon={<IconifyIcon icon="mdi:code-tags" sx={{ fontSize: 19 }} />}
        iconPosition="top"
      />
      <Tab
        value="attempts"
        label={t('problems.detail.attemptsTab')}
        icon={<IconifyIcon icon="mdi:history" sx={{ fontSize: 19 }} />}
        iconPosition="top"
      />
      <Tab
        value="stats"
        label={t('problems.detail.stats')}
        icon={<IconifyIcon icon="mdi:chart-bar" sx={{ fontSize: 19 }} />}
        iconPosition="top"
      />
      <Tab
        value="solvers"
        label={t('problems.detail.solversTab')}
        icon={<IconifyIcon icon="mdi:account-group" sx={{ fontSize: 19 }} />}
        iconPosition="top"
      />
    </Tabs>
  );
};
