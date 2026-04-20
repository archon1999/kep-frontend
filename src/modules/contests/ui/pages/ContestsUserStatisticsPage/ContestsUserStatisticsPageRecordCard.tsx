import { Link as RouterLink } from 'react-router-dom';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import KepIcon from 'shared/components/base/KepIcon';
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
  <Card variant="outlined" sx={{ height: '100%', borderRadius: 3 }}>
    <CardContent>
      <Stack direction="column" spacing={2}>
        <Typography variant="subtitle1" fontWeight={700}>
          {title}
        </Typography>
        <Stack direction="column" spacing={1.5}>
          {items.map((item) => (
            <Stack
              key={item.label}
              direction="row"
              spacing={2}
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <KepIcon name={item.icon} fontSize={22} />
              <Stack direction="column" spacing={0.5} flex={1}>
                <Typography variant="subtitle2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h6" fontWeight={800} color={item.valueColor}>
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
    </CardContent>
  </Card>
);

export default ContestsUserStatisticsPageRecordCard;
