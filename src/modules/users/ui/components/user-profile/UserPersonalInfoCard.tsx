import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { useUserAbout } from '../../../application/queries';
import KepIcon from 'shared/components/base/KepIcon';
import { KepIconName } from 'shared/config/icons';

type UserPersonalInfoCardProps = {
  username: string;
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return undefined;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('MMM DD, YYYY') : undefined;
};

const UserPersonalInfoCard = ({ username }: UserPersonalInfoCardProps) => {
  const { t } = useTranslation();
  const { data, isLoading } = useUserAbout(username);

  const generalInfo = data?.generalInfo;
  const profileInfo = data?.profileInfo;

  const rows: Array<{
    label: string;
    value: string | undefined;
    icon?: KepIconName;
  }> = [
    {
      label: t('users.profile.personal.fullName'),
      value: [generalInfo?.firstName, generalInfo?.lastName].filter(Boolean).join(' '),
      icon: 'profile' as KepIconName,
    },
    {
      label: t('users.profile.personal.wasBorn'),
      value: formatDate(profileInfo?.dateOfBirth),
      icon: 'challenge-time' as KepIconName,
    },
    {
      label: t('users.profile.personal.lives'),
      value: [profileInfo?.country, profileInfo?.region].filter(Boolean).join(', '),
      icon: 'info' as KepIconName,
    },
    {
      label: t('users.profile.personal.email'),
      value: profileInfo?.email,
      icon: 'email' as KepIconName,
    },
    {
      label: t('users.profile.personal.website'),
      value: profileInfo?.website,
    },
    {
      label: t('users.profile.personal.joined'),
      value: formatDate(profileInfo?.dateJoined),
      icon: 'contest' as KepIconName,
    },
  ].filter((item) => Boolean(item.value));

  if (isLoading) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack direction="column" spacing={1.5}>
            <Skeleton variant="text" width="60%" />
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} variant="text" width="90%" />
            ))}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (!rows.length) {
    return null;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            {t('users.profile.personal.title')}
          </Typography>

          <Stack direction="column" spacing={1.5}>
            {rows.map((row) => (
              <Stack key={row.label} direction="row" spacing={1} alignItems="center">
                {row.icon ? (
                  <KepIcon name={row.icon} fontSize={16} color="text.secondary" />
                ) : null}
                <Typography variant="body2" color="text.secondary">
                  {row.label}:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserPersonalInfoCard;
