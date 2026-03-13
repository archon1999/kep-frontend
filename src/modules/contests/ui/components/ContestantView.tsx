import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, StackProps, Tooltip, Typography } from '@mui/material';
import UserPopover from 'modules/users/ui/components/UserPopover';
import KepIcon from 'shared/components/base/KepIcon';
import CountryFlagIcon from 'shared/components/common/CountryFlagIcon';
import ContestsRatingChip from 'shared/components/rating/ContestsRatingChip';
import {
  ContestantEntity,
  ContestantTeam,
  ContestantTeamMember,
} from '../../domain/entities/contestant.entity';
import { ContestRatingRow } from '../../domain/entities/contest-rating.entity';
import { ContestStatisticsContestant } from '../../domain/entities/contest-statistics.entity';

type ContestantLike = Partial<ContestantEntity> &
  Partial<ContestStatisticsContestant> &
  Partial<ContestRatingRow>;

interface ContestantViewProps extends Omit<StackProps, 'children'> {
  contestant?: ContestantLike | null;
  user?: ContestantLike | null;
  team?: ContestantTeam | { name?: string; members?: ContestantTeamMember[] } | null;
  textColor?: string;
  teamNameColor?: string;
  imgSize?: number;
  isOfficial?: boolean;
  isUnrated?: boolean;
  isVirtual?: boolean;
  showCountry?: boolean;
}

const normalizeTeam = (
  team?: ContestantTeam | { name?: string; members?: ContestantTeamMember[] } | null,
) => {
  if (!team) return null;

  return {
    name: team.name ?? '',
    members: (team.members ?? []).filter((member) => Boolean(member?.username)),
  };
};

const ContestantView = ({
  contestant,
  user,
  team,
  textColor,
  teamNameColor = 'primary',
  imgSize = 32,
  isOfficial,
  isUnrated,
  isVirtual,
  showCountry = false,
  sx,
  ...stackProps
}: ContestantViewProps) => {
  const { t } = useTranslation();
  const baseContestant = contestant ?? user ?? null;

  const resolvedTeam = useMemo(() => {
    if (team) return normalizeTeam(team);

    if (baseContestant?.teamName) {
      return normalizeTeam({
        name: baseContestant.teamName,
        members: baseContestant.teamMembers as ContestantTeamMember[],
      });
    }

    if ((baseContestant as ContestantEntity | null)?.team) {
      return normalizeTeam((baseContestant as ContestantEntity).team);
    }

    return null;
  }, [baseContestant, team]);

  const username = baseContestant?.username ?? '';
  const fullName =
    (baseContestant as ContestantEntity | null)?.userFullName ??
    (baseContestant as ContestStatisticsContestant | null)?.fullName ??
    '';
  const ratingTitle = baseContestant?.ratingTitle ?? undefined;
  const countryCode = (baseContestant as ContestantEntity | null)?.country;

  const resolvedOfficial = Boolean(isOfficial ?? baseContestant?.isOfficial);
  const resolvedUnrated = Boolean(isUnrated ?? baseContestant?.isUnrated);
  const resolvedVirtual = Boolean(isVirtual ?? baseContestant?.isVirtual);

  const nameColorSx = textColor ? { color: textColor } : undefined;
  const teamColorSx = teamNameColor ? { color: teamNameColor } : undefined;

  const renderStatusIcons = () => {
    const icons = [];

    if (resolvedUnrated && !resolvedVirtual) {
      icons.push(
        <Tooltip key="unrated" title={t('contests.contestantStatus.unrated')}>
          <Stack direction="row" alignItems="center">
            <KepIcon name="unrated" fontSize={18} sx={{ color: 'error.main' }} />
          </Stack>
        </Tooltip>,
      );
    }

    if (resolvedOfficial) {
      icons.push(
        <Tooltip key="official" title={t('contests.contestantStatus.official')}>
          <Stack direction="row" alignItems="center">
            <KepIcon name="official" fontSize={18} sx={{ color: 'success.main' }} />
          </Stack>
        </Tooltip>,
      );
    }

    if (resolvedVirtual) {
      icons.push(
        <Tooltip key="virtual" title={t('contests.contestantStatus.virtual')}>
          <Stack direction="row" alignItems="center">
            <KepIcon name="virtual" fontSize={18} sx={{ color: 'info.main' }} />
          </Stack>
        </Tooltip>,
      );
    }

    if (!icons.length) return null;

    return (
      <Stack direction="row" spacing={0.5} alignItems="center" flexWrap="wrap" useFlexGap>
        {icons}
      </Stack>
    );
  };

  const renderTeam = () => (
    <Stack spacing={0.5} minWidth={0}>
      <Typography
        variant="subtitle2"
        fontWeight={500}
        noWrap
        color={teamNameColor ? undefined : 'text.primary'}
        sx={teamColorSx}
      >
        {resolvedTeam?.name || username || '—'}
      </Typography>

      {resolvedTeam?.members?.length ? (
        <Stack direction="row" spacing={0.25} flexWrap="wrap" useFlexGap>
          {resolvedTeam.members.map((member, index) => (
            <Stack key={`${member.username}-${index}`} direction="row" spacing={0.25} alignItems="center">
              {member.username ? (
                <UserPopover username={member.username}>
                  <Typography variant="body2" color="text.secondary" sx={nameColorSx} noWrap>
                    {member.username}
                  </Typography>
                </UserPopover>
              ) : null}
              {index < resolvedTeam.members.length - 1 ? (
                <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.75 }}>
                  ,
                </Typography>
              ) : null}
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );

  const nameContent = (
    <Stack spacing={0.25} minWidth={0}>
      <Typography
        variant="subtitle2"
        fontWeight={500}
        noWrap
        color={textColor ? undefined : 'text.primary'}
        sx={nameColorSx}
      >
        {username || '—'}
      </Typography>
      {fullName ? (
        <Typography variant="caption" color="text.secondary" noWrap>
          {fullName}
        </Typography>
      ) : null}
    </Stack>
  );

  const renderUser = () => {
    const popoverContent = username ? (
      <UserPopover username={username} fullName={fullName} countryCode={countryCode}>
        {nameContent}
      </UserPopover>
    ) : (
      nameContent
    );

    return (
      <Stack direction="row" spacing={0.75} alignItems="center" minWidth={0}>
        {ratingTitle ? <ContestsRatingChip title={ratingTitle} imgSize={imgSize} /> : null}
        {popoverContent}
        {countryCode && showCountry ? <CountryFlagIcon code={countryCode} size={18} /> : null}
      </Stack>
    );
  };

  if (!baseContestant && !team) return null;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems={resolvedTeam ? 'flex-start' : 'center'}
      minWidth={0}
      sx={sx}
      {...stackProps}
    >
      {resolvedTeam ? renderTeam() : renderUser()}
      {renderStatusIcons()}
    </Stack>
  );
};

export default ContestantView;
