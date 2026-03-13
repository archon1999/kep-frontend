import { useMemo } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { resources, getResourceById } from 'app/routes/resources';
import { Hackathon, HackathonStatus } from '../../domain/entities/hackathon.entity';

interface HackathonTabsProps {
  hackathon?: Hackathon;
}

const HackathonTabs = ({ hackathon }: HackathonTabsProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs = useMemo(() => {
    if (!hackathon) return [];

    const baseTabs = [
      {
        label: t('hackathons.overview'),
        to: getResourceById(resources.Hackathon, hackathon.id),
        icon: 'mdi:trophy-variant-outline',
      },
    ];

    if (hackathon.status !== HackathonStatus.NOT_STARTED) {
      baseTabs.push(
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
      );
    } else {
      baseTabs.push({
        label: t('hackathons.registrants'),
        to: getResourceById(resources.HackathonRegistrants, hackathon.id),
        icon: 'mdi:account-group-outline',
      });
    }

    return baseTabs;
  }, [hackathon, t]);

  const activeValue = useMemo(
    () => tabs.find((tab) => location.pathname.startsWith(tab.to))?.to ?? tabs[0]?.to,
    [location.pathname, tabs],
  );

  if (!hackathon) return null;

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Tabs value={activeValue} variant="scrollable" scrollButtons allowScrollButtonsMobile>
        {tabs.map((tab) => (
          <Tab
            key={tab.to}
            value={tab.to}
            label={tab.label}
            iconPosition="start"
            icon={<IconifyIcon icon={tab.icon} />}
            component={RouterLink}
            to={tab.to}
            sx={{ fontWeight: 700, minHeight: 56 }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default HackathonTabs;
