import { Link as RouterLink } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
import StatisticsSection from 'shared/components/statistics/StatisticsSection';
import type { KepIconName } from 'shared/config/icons';

export interface ContestsUserStatisticsPageRecordItem {
  icon: KepIconName;
  label: string;
  value?: string;
  subtitle?: string;
  contestTitle?: string;
  contestLink?: string;
  valueColor?: string;
}

interface ContestsUserStatisticsPageRecordCardProps {
  title: string;
  items: ContestsUserStatisticsPageRecordItem[];
  emptyText: string;
}

const ContestsUserStatisticsPageRecordCard = ({
  title,
  items,
  emptyText,
}: ContestsUserStatisticsPageRecordCardProps) => (
  <StatisticsSection title={title}>
    <Stack direction="column" spacing={2}>
      <Stack direction="column" spacing={2.5}>
        {items.map((item) => (
          <Stack
            key={item.label}
            direction="row"
            spacing={2}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <KepIcon name={item.icon} fontSize={22} />
            <Stack direction="column" spacing={0.5} flex={1} minWidth={0}>
              <Typography variant="label" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="metric" fontSize={26} color={item.valueColor}>
                {item.value ?? emptyText}
              </Typography>
              {item.contestTitle ? (
                item.contestLink ? (
                  <Button
                    component={RouterLink}
                    to={item.contestLink}
                    size="small"
                    variant="text"
                    sx={{ px: 0, justifyContent: 'flex-start' }}
                  >
                    {item.contestTitle}
                  </Button>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {item.contestTitle}
                  </Typography>
                )
              ) : null}
              {item.subtitle ? (
                <Typography variant="body2" color="text.secondary">
                  {item.subtitle}
                </Typography>
              ) : null}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  </StatisticsSection>
);

export default ContestsUserStatisticsPageRecordCard;
