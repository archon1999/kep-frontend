import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { type Hackathon } from 'modules/hackathons/domain';
import KepIcon from 'shared/components/base/KepIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';

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
        icon: 'hackathon' as const,
        to: getResourceById(resources.Hackathon, hackathon.id),
      },
      {
        label: t('hackathons.projects'),
        icon: 'projects' as const,
        to: getResourceById(resources.HackathonProjects, hackathon.id),
      },
      {
        label: t('hackathons.attempts'),
        icon: 'attempts' as const,
        to: getResourceById(resources.HackathonAttempts, hackathon.id),
      },
      {
        label: t('hackathons.standings'),
        icon: 'ranking' as const,
        to: getResourceById(resources.HackathonStandings, hackathon.id),
      },
      {
        label: t('hackathons.registrants'),
        icon: 'users' as const,
        to: getResourceById(resources.HackathonRegistrants, hackathon.id),
      },
    ];
  }, [hackathon, t]);

  const activeValue = useMemo(
    () =>
      [...tabs]
        .sort((a, b) => b.to.length - a.to.length)
        .find((tab) => location.pathname === tab.to || location.pathname.startsWith(`${tab.to}/`))
        ?.to ?? tabs[0]?.to,
    [location.pathname, tabs],
  );

  if (!hackathon) return null;

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <ResponsiveTabs
        value={activeValue}
        onChange={(value) => navigate(value)}
        items={tabs.map((tab) => ({
          value: tab.to,
          label: tab.label,
          icon: <KepIcon name={tab.icon} fontSize={18} />,
          tabProps: {
            iconPosition: 'start',
            component: RouterLink,
            to: tab.to,
            sx: {
              fontWeight: 500,
              textTransform: 'none',
            },
          },
        }))}
        ariaLabel={t('hackathons.navigation')}
        selectProps={{
          sx: {
            minHeight: 38,
            '& .MuiSelect-select': { py: 0.8, fontSize: '0.85rem' },
          },
        }}
        tabsProps={{
          variant: 'scrollable',
          scrollButtons: 'auto',
          allowScrollButtonsMobile: true,
          sx: { width: '100%', minWidth: 0 },
        }}
      />
    </Box>
  );
};

export default HackathonTabs;
