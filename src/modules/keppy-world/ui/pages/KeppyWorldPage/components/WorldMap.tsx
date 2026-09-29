import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import type { CommunityWorld, WorldPlayer, WorldQuest } from 'modules/keppy-world/domain';
import { worldBridges, worldLandPolygons } from 'modules/keppy-world/domain/utils/terrain';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const questColors: Record<string, string> = {
  'bug-hunt': '#d9a36e',
  'logic-circuit': '#419e90',
  'code-islands': '#5194bd',
  'memory-grid': '#9277ae',
  'math-compare': '#ad7394',
  'quick-math': '#418e9d',
  'number-sequence': '#7681bd',
  'number-hunt': '#b48c52',
  'memory-matrix': '#8b79b3',
  cargo: '#b89b54',
  'daily-task': '#6e7a9e',
};
const landColors: Record<string, string> = {
  academy: '#b8cec2',
  'workshop-island': '#dfcfb1',
  'crystal-island': '#c7c3df',
  citadel: '#b9cdb3',
};
export default function WorldMap({
  world,
  players,
  quests,
  selfId,
}: {
  world: CommunityWorld;
  players: WorldPlayer[];
  quests: WorldQuest[];
  selfId: string | null;
}) {
  const { t } = useTranslation();
  const lands = useMemo(() => worldLandPolygons(world.zones), [world.zones]);
  const bounds = useMemo(() => {
    const points = lands.flatMap((land) => land.points);
    const left = Math.min(...points.map((p) => p.x)) - 8,
      top = Math.min(...points.map((p) => p.z)) - 8;
    const width = Math.max(...points.map((p) => p.x)) - left + 8,
      height = Math.max(...points.map((p) => p.z)) - top + 8;
    return { left, top, width, height, unit: Math.max(width, height) / 100 };
  }, [lands]);
  const bridges = worldBridges(world.zones);
  return (
    <Stack spacing={1.5}>
      <Box sx={{ bgcolor: '#c8e1e5', borderRadius: 2.5, overflow: 'hidden' }}>
        <svg
          viewBox={`${bounds.left} ${bounds.top} ${bounds.width} ${bounds.height}`}
          role="img"
          aria-label={t('keppyWorld.map')}
          style={{ width: '100%', height: 390, display: 'block' }}
        >
          {lands.map((land) => (
            <polygon
              key={land.id}
              points={land.points.map((p) => `${p.x},${p.z}`).join(' ')}
              fill={landColors[land.id] ?? '#d9e4c8'}
              stroke="#eef0da"
              strokeWidth={bounds.unit * 1.5}
            />
          ))}
          {bridges.map(({ bridge, zone }) => (
            <line
              key={zone}
              x1={bridge.start.x}
              y1={bridge.start.z}
              x2={bridge.end.x}
              y2={bridge.end.z}
              stroke="#baab81"
              strokeWidth={bounds.unit * 1.5}
              strokeLinecap="round"
            />
          ))}
          {quests.map((quest) => (
            <circle
              key={quest.id}
              cx={quest.position.x}
              cy={quest.position.z}
              r={bounds.unit * 0.8}
              fill={questColors[quest.kind] ?? '#778d84'}
              stroke="#fff"
              strokeWidth={bounds.unit * 0.25}
            >
              <title>
                {quest.title} · {quest.xp} XP
              </title>
            </circle>
          ))}
          {players
            .filter((p) => !p.falling && p.sessionId !== selfId)
            .map((player) => (
              <circle
                key={player.sessionId}
                cx={player.x}
                cy={player.z}
                r={bounds.unit * 0.72}
                fill="#5688ae"
                stroke="#fff"
                strokeWidth={bounds.unit * 0.25}
              >
                <title>{player.username}</title>
              </circle>
            ))}
          {players
            .filter((p) => p.sessionId === selfId)
            .map((player) => (
              <g key={player.sessionId}>
                <circle
                  cx={player.x}
                  cy={player.z}
                  r={bounds.unit * 1.65}
                  fill="#3183ff"
                  opacity={0.18}
                />
                <circle
                  cx={player.x}
                  cy={player.z}
                  r={bounds.unit}
                  fill="#3183ff"
                  stroke="#fff"
                  strokeWidth={bounds.unit * 0.38}
                />
                <title>{t('keppyWorld.growth.you')}</title>
              </g>
            ))}
        </svg>
      </Box>
      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="center">
        {(['you', 'players', 'missions'] as const).map((name, index) => (
          <Typography
            key={name}
            fontSize={12}
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}
          >
            <IconifyIcon
              icon={
                index === 0
                  ? 'mdi:navigation'
                  : index === 1
                    ? 'mdi:account-multiple-outline'
                    : 'mdi:map-marker-outline'
              }
              width={16}
              sx={{ color: index === 0 ? 'primary.main' : 'text.secondary' }}
            />
            {t(`keppyWorld.growth.${name}`)}
          </Typography>
        ))}
      </Stack>
      <Typography fontSize={12} color="text.secondary">
        {t('keppyWorld.growth.mapHelp')}
      </Typography>
    </Stack>
  );
}
