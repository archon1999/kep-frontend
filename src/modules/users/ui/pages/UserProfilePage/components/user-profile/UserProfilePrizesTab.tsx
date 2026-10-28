import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { contentGridSx, contentHeadingSx, contentInsetSx } from 'app/theme/styles/content';
import { useUserCompetitionPrizes } from 'modules/users/application/queries';
import {
  UserCompetitionPrize,
  UserCompetitionPrizeCurrency,
} from 'modules/users/domain/entities/user-profile.entity';
import kepcoinImage from 'shared/assets/images/icons/kepcoin.webp';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import { formatLocalizedNumber } from 'shared/lib/numberFormat';

type PrizePresentation = {
  color: 'primary' | 'secondary' | 'warning' | 'success' | 'info';
  icon: string;
  label: string;
  value: string;
  image?: string;
};

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '';

  return formatLocalizedNumber(
    value,
    {
      maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
    },
    'en-US',
  );
};

const formatMoney = (value: number | null, currency: UserCompetitionPrizeCurrency) => {
  const amount = formatNumber(value);

  if (currency === 'SUM') return amount ? `${amount} so'm` : "so'm";
  if (currency === 'DOLLAR') return amount ? `$${amount}` : '$';
  if (currency === 'TON') return amount ? `${amount} TON` : 'TON';

  return amount || currency;
};

const isTelegramStarsPrize = (prize: UserCompetitionPrize) =>
  prize.prizeType === 'TELEGRAM_STARS' ||
  /telegram\s+stars?|stars?/i.test(`${prize.prizeTitle} ${prize.note}`);

const getMoneyPresentation = (
  value: number | null,
  currency: UserCompetitionPrizeCurrency,
): PrizePresentation => {
  if (currency === 'SUM') {
    return {
      color: 'success',
      icon: 'mdi:cash-multiple',
      label: "So'm",
      value: formatMoney(value, currency),
    };
  }

  if (currency === 'DOLLAR') {
    return {
      color: 'success',
      icon: 'mdi:currency-usd-circle-outline',
      label: 'Dollar',
      value: formatMoney(value, currency),
    };
  }

  if (currency === 'TON') {
    return {
      color: 'info',
      icon: 'mdi:diamond-stone',
      label: 'TON',
      value: formatMoney(value, currency),
    };
  }

  return {
    color: 'success',
    icon: 'mdi:cash',
    label: currency,
    value: formatMoney(value, currency),
  };
};

const getPrizePresentation = (prize: UserCompetitionPrize): PrizePresentation => {
  if (isTelegramStarsPrize(prize)) {
    const value = formatNumber(prize.telegramStarsValue);

    return {
      color: 'warning',
      icon: 'mdi:star-four-points-circle-outline',
      label: 'Telegram Stars',
      value: value ? `${value} Stars` : prize.note || prize.prizeTitle,
    };
  }

  if (prize.prizeType === 'MONEY') {
    return getMoneyPresentation(prize.moneyValue, prize.currency);
  }

  if (prize.prizeType === 'KEPCOIN') {
    const value = formatNumber(prize.kepcoinValue);

    return {
      color: 'warning',
      icon: 'mdi:hexagon-multiple-outline',
      image: kepcoinImage,
      label: 'Kepcoin',
      value: value ? `${value} Kepcoin` : 'Kepcoin',
    };
  }

  if (prize.prizeType === 'TELEGRAM_PREMIUM') {
    const period = formatNumber(prize.telegramPremiumPeriod);

    return {
      color: 'info',
      icon: 'mdi:telegram',
      label: 'Telegram Premium',
      value: period ? `${period} mo Premium` : 'Telegram Premium',
    };
  }

  if (prize.prizeType === 'MERCH') {
    return {
      color: 'primary',
      icon: 'mdi:tshirt-crew-outline',
      label: 'Merch',
      value: prize.note || prize.prizeTitle,
    };
  }

  return {
    color: 'secondary',
    icon: 'mdi:gift-outline',
    label: 'Prize',
    value: prize.note || prize.prizeTitle,
  };
};

const getPrizeRoute = (prize: UserCompetitionPrize) => {
  if (prize.competitionType === 'OTHER') return null;
  if (prize.competitionType === 'GIVEAWAY') {
    return getResourceById(resources.Giveaway, prize.competitionId);
  }
  if (prize.competitionType === 'CONTEST') {
    return getResourceById(resources.ContestStandings, prize.competitionId);
  }

  if (prize.competitionType === 'ARENA') {
    return getResourceById(resources.ArenaTournament, prize.competitionId);
  }

  return getResourceById(resources.Tournament, prize.competitionId);
};

const UserProfilePrizesTab = () => {
  const { t } = useTranslation();
  const { username = '' } = useParams();
  const prizesQuery = useUserCompetitionPrizes(username);
  return (
    <Box>
      <SectionHeader title={t('users.profile.prizes.title')} />
      {prizesQuery.isLoading ? (
        <Box sx={contentInsetSx}>
          <Skeleton height={160} />
        </Box>
      ) : prizesQuery.error ? (
        <Box sx={contentInsetSx}>
          <Alert
            severity="error"
            action={<Button onClick={() => prizesQuery.mutate()}>{t('common.retry')}</Button>}
          >
            {t('common.loadFailed')}
          </Alert>
        </Box>
      ) : prizesQuery.data?.length ? (
        <Box
          sx={{
            ...contentGridSx,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          {prizesQuery.data.map((prize, index) => {
            const presentation = getPrizePresentation(prize);
            const route = getPrizeRoute(prize);
            return (
              <Box key={`${prize.competitionId}-${index}`} sx={contentInsetSx}>
                <Stack direction="row" alignItems="flex-start" gap={2}>
                  {presentation.image ? (
                    <Box
                      component="img"
                      src={presentation.image}
                      alt={presentation.label}
                      sx={{ width: 36, height: 36, objectFit: 'contain' }}
                    />
                  ) : (
                    <IconifyIcon icon={presentation.icon} fontSize={32} color="secondary.main" />
                  )}
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="label" color="text.secondary">
                      {presentation.label}
                    </Typography>
                    <Typography component="h3" sx={{ ...contentHeadingSx, mt: 1 }}>
                      {presentation.value}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {prize.prizeTitle}
                    </Typography>
                    {route ? (
                      <Button
                        component={RouterLink}
                        to={route}
                        sx={{ mt: 1, px: 0, textAlign: 'left' }}
                      >
                        {prize.competitionTitle}
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {prize.competitionTitle}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography color="text.secondary" sx={contentInsetSx}>
          {t('users.profile.prizes.empty')}
        </Typography>
      )}
    </Box>
  );
};

export default UserProfilePrizesTab;
