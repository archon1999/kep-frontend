import { useTranslation } from 'react-i18next';
import { Alert, Box, Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useNextBirthdays } from 'modules/home/application/queries';
import type { HomeNextBirthday } from 'modules/home/domain/entities/home.entity';
import { getBirthdayDetails } from 'modules/home/domain/utils/birthday';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import MixedText from 'shared/components/common/MixedText';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';
import { formatDateTime, formatDateTimePattern } from 'shared/lib/dateTime';
import { DashboardPattern } from './DashboardPattern';

const SKELETON_ITEMS = Array.from({ length: 5 });
const birthdayRowStyles = {
  display: 'grid',
  gridTemplateColumns: '38px minmax(0, 1fr) auto',
  gap: 1.5,
  alignItems: 'center',
  py: 2,
  borderTop: 1,
  borderColor: 'divider',
  minWidth: 0,
} as const;

const getDisplayName = (user: HomeNextBirthday) => {
  const firstName = user.firstName?.trim() ?? '';
  const lastName = user.lastName?.trim() ?? '';
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || user.username;
};

const BirthdaysSection = () => {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useNextBirthdays();

  const birthdays = data?.data ?? [];

  return (
    <Paper
      component={PointerSpotlight}
      variant="section"
      sx={{ p: 'var(--kep-content-inset)', height: '100%' }}
    >
      <Stack spacing={2} direction="column" sx={{ height: '100%' }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography component="h2" variant="h5" sx={{ flex: 1, minWidth: 0 }}>
            <MixedText>{t('homePage.birthdays.title')}</MixedText>
          </Typography>
          <DashboardPattern kind="profile" inline />
        </Stack>

        {isLoading ? (
          <Stack component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }} aria-busy="true">
            {SKELETON_ITEMS.map((_, index) => (
              <Box key={index} component="li" sx={birthdayRowStyles}>
                <Stack gap={0.25}>
                  <Typography variant="metric" sx={{ fontSize: 24 }}>
                    <Skeleton width={28} height="1.2em" />
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10 }}>
                    <Skeleton width={20} height="1.5em" />
                  </Typography>
                </Stack>
                <Stack direction="row" gap={1.5} alignItems="center">
                  <Skeleton variant="circular" width={32} height={32} />
                  <Stack sx={{ minWidth: 0, flex: 1 }} gap={0.5}>
                    <Typography variant="body2">
                      <Skeleton width="85%" height="1.5em" />
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      <Skeleton width="55%" height="1.5em" />
                    </Typography>
                  </Stack>
                </Stack>
                <Stack gap={0.25} alignItems="flex-end">
                  <Typography variant="metric" sx={{ fontSize: 24 }}>
                    <Skeleton width={28} height="1.2em" />
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: 10 }}>
                    <Skeleton width={36} height="1.5em" />
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : error ? (
          <Alert
            severity="error"
            action={<Button onClick={() => void mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        ) : birthdays?.length ? (
          <Stack component="ul" direction="column" sx={{ p: 0, m: 0, listStyle: 'none' }}>
            {birthdays.map((user) => {
              const displayName = getDisplayName(user);
              const birthdayDate =
                formatDateTime(user.date, 'longMonthDay', '') ||
                t('homePage.birthdays.dateUnknown');
              const { daysRemaining, turningAge } = getBirthdayDetails(user.date, user.dateOfBirth);
              return (
                <Box
                  component="li"
                  key={user.username}
                  sx={{
                    ...birthdayRowStyles,
                    ...(daysRemaining === 0
                      ? { backgroundColor: 'primary.lighter', mx: -1, px: 1 }
                      : {}),
                  }}
                >
                  <Box
                    component="time"
                    dateTime={user.date}
                    aria-label={birthdayDate}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0.25,
                      color: daysRemaining === 0 ? 'primary.main' : 'text.secondary',
                    }}
                  >
                    <Typography component="span" variant="metric" sx={{ fontSize: 24 }}>
                      {user.date ? formatDateTimePattern(user.date, 'DD') : '—'}
                    </Typography>
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}
                    >
                      {user.date ? formatDateTimePattern(user.date, 'MMM') : ''}
                    </Typography>
                  </Box>
                  <UserPopover
                    username={user.username}
                    fullName={displayName}
                    avatar={user.avatar}
                    sx={{ width: '100%' }}
                  >
                    <Stack direction="row" gap={1.5} alignItems="center" sx={{ width: '100%' }}>
                      <Avatar
                        src={user.avatar}
                        alt=""
                        sx={{ width: 32, height: 32, flexShrink: 0 }}
                      />

                      <Stack direction="column" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                          color="text.primary"
                        >
                          {displayName}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontFamily: 'var(--kep-display-font)', fontSize: 12 }}
                        >
                          {turningAge !== undefined
                            ? t('homePage.birthdays.turns', { count: turningAge })
                            : birthdayDate}
                        </Typography>
                      </Stack>
                    </Stack>
                  </UserPopover>
                  {daysRemaining !== undefined && (
                    <Stack alignItems="flex-end" gap={0.25}>
                      <Typography
                        variant="metric"
                        color={daysRemaining === 0 ? 'primary.main' : 'text.primary'}
                        sx={{ fontSize: 24 }}
                      >
                        {String(daysRemaining).padStart(2, '0')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                        {daysRemaining === 0
                          ? t('homePage.birthdays.today')
                          : daysRemaining === 1
                            ? t('homePage.birthdays.tomorrow')
                            : t('homePage.birthdays.daysLeft', { count: daysRemaining })}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t('homePage.birthdays.empty')}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default BirthdaysSection;
