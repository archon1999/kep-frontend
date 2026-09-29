import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  ButtonBase,
  Fade,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import type { CommunityWorld } from 'modules/keppy-world/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export const worldZoneIcons: Record<string, string> = {
  plaza: 'mdi:campfire',
  harbor: 'mdi:sail-boat',
  bridge: 'mdi:bridge',
  island: 'mdi:island',
  garden: 'mdi:pine-tree',
  academy: 'mdi:school-outline',
  summit: 'mdi:city-variant-outline',
  'workshop-island': 'mdi:tools',
  'crystal-island': 'mdi:diamond-stone',
  citadel: 'mdi:castle',
};
type WorldPanel = 'map' | 'growth' | 'quests' | 'ranking' | 'profile';
const surface = {
  bgcolor: 'background.paper',
  border: 0,
  boxShadow: '0 6px 30px rgba(20,47,65,.09)',
  borderRadius: 2.5,
};

export const WorldProgressCard = memo(
  ({
    world,
    collapsed,
    onCollapse,
    onPanel,
    tooltipContainer,
  }: {
    world: CommunityWorld;
    collapsed: boolean;
    onCollapse: () => void;
    onPanel: (panel: WorldPanel) => void;
    tooltipContainer: () => HTMLElement | null;
  }) => {
    const { t } = useTranslation();
    const next = world.milestones[world.stage + 1];
    return (
      <Paper
        sx={{
          ...surface,
          position: 'absolute',
          top: 16,
          right: 16,
          width: collapsed ? 'auto' : { xs: 52, sm: 268 },
          p: 1.25,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1}>
          <ButtonBase
            onClick={() => onPanel('growth')}
            aria-label={t('keppyWorld.growth.title')}
            sx={{
              display: collapsed ? 'none' : { xs: 'none', sm: 'flex' },
              flex: 1,
              gap: 1.2,
              textAlign: 'left',
              justifyContent: 'flex-start',
              borderRadius: 1,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1.5,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.lighter',
                color: 'primary.main',
              }}
            >
              <Box
                component="img"
                src={`${import.meta.env.BASE_URL}logo.svg`}
                alt="KEP.uz"
                sx={{ width: 28, height: 28 }}
              />
            </Box>
            <Box>
              <Typography fontSize={11} color="text.secondary">
                {t('keppyWorld.worldProgress')}
              </Typography>
              <Typography fontSize={16} fontWeight={700}>
                {t('keppyWorld.growth.worldLevel', { count: world.level })}
              </Typography>
            </Box>
          </ButtonBase>
          <IconButton
            size="small"
            onClick={onCollapse}
            aria-label={t(collapsed ? 'keppyWorld.expand' : 'keppyWorld.collapse')}
          >
            <IconifyIcon icon={collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'} width={18} />
          </IconButton>
        </Stack>
        {!collapsed && (
          <>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, my: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline" gap={1}>
                <Typography fontSize={13} fontWeight={700} color="primary.main">
                  {world.totalXp.toLocaleString()} XP
                </Typography>
                <Typography fontSize={11} color="text.secondary">
                  {Math.round(world.progress * 100)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={world.progress * 100}
                sx={{ my: 1, height: 5, borderRadius: 2 }}
              />
              <ButtonBase
                onClick={() => onPanel('growth')}
                sx={{
                  gap: 0.75,
                  borderRadius: 1,
                  width: 1,
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                }}
              >
                <IconifyIcon
                  icon={worldZoneIcons[next?.zone] ?? 'mdi:check-circle-outline'}
                  width={17}
                  sx={{ color: next ? 'text.secondary' : 'success.main', flexShrink: 0 }}
                />
                <Typography fontSize={11} color="text.secondary">
                  {next
                    ? t('keppyWorld.growth.next', {
                        name: t(`keppyWorld.growth.zones.${next.zone}`),
                        xp: next.requiredXp.toLocaleString(),
                      })
                    : t('keppyWorld.growth.fullyBuilt')}
                </Typography>
              </ButtonBase>
            </Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-around" gap={0.5}>
              {(['map', 'quests', 'ranking', 'profile'] as const).map((name) => (
                <Tooltip
                  key={name}
                  title={t(`keppyWorld.${name}`)}
                  slotProps={{ popper: { container: tooltipContainer } }}
                >
                  <IconButton onClick={() => onPanel(name)} aria-label={t(`keppyWorld.${name}`)}>
                    <IconifyIcon
                      icon={
                        {
                          map: 'mdi:map-outline',
                          quests: 'mdi:compass-outline',
                          ranking: 'mdi:trophy-outline',
                          profile: 'mdi:hanger',
                        }[name]
                      }
                      width={20}
                    />
                  </IconButton>
                </Tooltip>
              ))}
            </Stack>
          </>
        )}
      </Paper>
    );
  },
);

export const WorldGrowthDetails = ({ world }: { world: CommunityWorld }) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1}>
      <Typography fontSize={13} color="text.secondary" mb={1}>
        {t('keppyWorld.growth.help')}
      </Typography>
      {world.milestones.map((milestone) => {
        const unlocked = milestone.level <= world.level;
        const current = milestone.level === world.level;
        return (
          <Stack
            key={milestone.level}
            direction="row"
            gap={1.5}
            alignItems="center"
            sx={{
              py: 1.5,
              px: 1.5,
              borderRadius: 2,
              bgcolor: current ? 'background.elevation1' : 'transparent',
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                flexShrink: 0,
                display: 'grid',
                placeItems: 'center',
                bgcolor: unlocked ? 'primary.lighter' : 'background.elevation1',
                borderRadius: 1.5,
                color: unlocked ? 'primary.main' : 'text.disabled',
              }}
            >
              <IconifyIcon icon={worldZoneIcons[milestone.zone] ?? 'mdi:earth'} width={24} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="baseline" gap={0.75}>
                <Typography fontSize={12} color="text.secondary">
                  {milestone.level}
                </Typography>
                <Typography fontSize={14} fontWeight={600}>
                  {t(`keppyWorld.growth.zones.${milestone.zone}`)}
                </Typography>
              </Stack>
              <Typography fontSize={12} color="text.secondary" lineHeight={1.5}>
                {t(`keppyWorld.growth.details.${milestone.zone}`)}
              </Typography>
            </Box>
            <Stack alignItems="flex-end" gap={0.3}>
              <IconifyIcon
                icon={unlocked ? 'mdi:check' : 'mdi:lock-outline'}
                width={17}
                sx={{ color: unlocked ? 'success.main' : 'text.disabled' }}
              />
              <Typography fontSize={10} color="text.secondary" whiteSpace="nowrap">
                {milestone.requiredXp.toLocaleString()} XP
              </Typography>
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};

export const WorldUnlockNotice = ({
  world,
  active,
  onCue,
  onDetails,
}: {
  world: CommunityWorld;
  active: boolean;
  onCue: () => void;
  onDetails: () => void;
}) => {
  const { t } = useTranslation();
  const previous = useRef<number | null>(null);
  const [notice, setNotice] = useState<{ level: number; zone: string } | null>(null);
  const cue = useRef(onCue);
  cue.current = onCue;
  useEffect(() => {
    if (!active) {
      previous.current = null;
      setNotice(null);
      return;
    }
    const seen = previous.current;
    previous.current = Math.max(seen ?? world.level, world.level);
    if (seen === null || world.level <= seen) return;
    setNotice({ level: world.level, zone: world.milestones[world.stage]?.zone ?? 'plaza' });
    cue.current();
  }, [world.level, world.stage, world.milestones, active]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 6500);
    return () => window.clearTimeout(timer);
  }, [notice]);
  return (
    <Fade in={Boolean(notice)} unmountOnExit>
      <Paper
        role="status"
        aria-live="polite"
        sx={{
          ...surface,
          position: 'absolute',
          top: { xs: 150, md: 18 },
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: { xs: 'calc(100% - 32px)', md: 'calc(100% - 600px)' },
          width: 410,
          zIndex: 5,
          p: 1.5,
        }}
      >
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Box
            sx={{
              width: 44,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              bgcolor: 'success.lighter',
              color: 'success.main',
              borderRadius: 2,
            }}
          >
            <IconifyIcon icon={worldZoneIcons[notice?.zone ?? 'plaza']} width={28} />
          </Box>
          <ButtonBase
            onClick={onDetails}
            sx={{ flex: 1, display: 'block', textAlign: 'left', borderRadius: 1 }}
          >
            <Typography fontSize={15} fontWeight={700}>
              {t('keppyWorld.growth.levelUp', { count: notice?.level })}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {t(`keppyWorld.growth.details.${notice?.zone ?? 'plaza'}`)}
            </Typography>
          </ButtonBase>
          <IconButton
            size="small"
            aria-label={t('keppyWorld.close')}
            onClick={() => setNotice(null)}
          >
            <IconifyIcon icon="mdi:close" width={17} />
          </IconButton>
        </Stack>
      </Paper>
    </Fade>
  );
};
