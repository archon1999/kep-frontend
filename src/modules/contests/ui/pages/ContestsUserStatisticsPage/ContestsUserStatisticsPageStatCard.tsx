import { Card, CardContent, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
import type { KepIconName } from 'shared/config/icons';
import { getColor } from 'shared/lib/echart-utils';

export interface ContestsUserStatisticsPageStatCardProps {
  icon: KepIconName;
  label: string;
  value?: string;
  subtitle?: string;
  highlight?: boolean;
  valueColor?: string;
}

const ContestsUserStatisticsPageStatCard = ({
  icon,
  label,
  value,
  subtitle,
  highlight,
  valueColor,
}: ContestsUserStatisticsPageStatCardProps) => (
  <Card
    variant="outlined"
    sx={(theme) => ({
      height: '100%',
      borderRadius: 3,
      background: highlight
        ? `linear-gradient(135deg, ${getColor(theme.vars.palette.primary.light)}20, ${getColor(
            theme.vars.palette.primary.main,
          )}12)`
        : undefined,
    })}
  >
    <CardContent sx={{ height: '100%' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Stack direction="column" spacing={0.75} flex={1} minWidth={0}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" fontWeight={800} color={valueColor ?? 'text.primary'}>
            {value ?? '--'}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
        <KepIcon name={icon} fontSize={26} />
      </Stack>
    </CardContent>
  </Card>
);

export default ContestsUserStatisticsPageStatCard;
