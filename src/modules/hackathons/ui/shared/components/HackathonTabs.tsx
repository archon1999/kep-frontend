import { useMemo } from 'react';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import { resources, getResourceById } from 'app/routes/resources';
import { type Hackathon } from 'modules/hackathons/domain';

interface HackathonTabsProps {
  hackathon?: Hackathon;
}

const HackathonTabs = ({ hackathon }: HackathonTabsProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = useMemo(() => {
    if (!hackathon) return [];

    return [
      {
        label: t('hackathons.overview'),
        to: getResourceById(resources.Hackathon, hackathon.id),
        icon: 'mdi:trophy-variant-outline',
      },
      {
        label: t('hackathons.projects'),
        to: getResourceById(resources.HackathonProjects, hackathon.id),
        icon: 'mdi:clipboard-text-outline',
      },
      {
        label: t('hackathons.attempts'),
        to: getResourceById(resources.HackathonAttempts, hackathon.id),
        icon: 'mdi:code-braces-box',
      },
      {
        label: t('hackathons.standings'),
        to: getResourceById(resources.HackathonStandings, hackathon.id),
        icon: 'mdi:podium-gold',
      },
      {
        label: t('hackathons.registrants'),
        to: getResourceById(resources.HackathonRegistrants, hackathon.id),
        icon: 'mdi:account-group-outline',
      },
    ];
  }, [hackathon, t]);

  const activeValue = useMemo(
    () => tabs.find((tab) => location.pathname.startsWith(tab.to))?.to ?? tabs[0]?.to,
    [location.pathname, tabs],
  );

  if (!hackathon) return null;

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: 'auto',
        p: 0.75,
        borderRadius: 3,
        bgcolor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <ResponsiveTabs
        value={activeValue}
        onChange={(value) => navigate(value)}
        items={tabs.map((tab) => ({
          value: tab.to,
          label: tab.label,
          icon: <IconifyIcon icon={tab.icon} />,
          tabProps: {
            iconPosition: 'start',
            component: RouterLink,
            to: tab.to,
            sx: { fontWeight: 700, minHeight: 52, borderRadius: 2 },
          },
        }))}
        ariaLabel="hackathon tabs"
        tabsProps={{
          variant: 'scrollable',
          scrollButtons: true,
          allowScrollButtonsMobile: true,
          sx: { minHeight: 52 },
        }}
      />
    </Box>
  );
};

export default HackathonTabs;
