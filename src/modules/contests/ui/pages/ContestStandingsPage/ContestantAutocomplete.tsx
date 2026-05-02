import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Autocomplete,
  Avatar,
  AvatarGroup,
  Box,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useContestContestants } from 'modules/contests/application/queries';
import { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import { formatContestPoints } from 'modules/contests/ui/shared/utils/contestType';

interface ContestantAutocompleteProps {
  contestId?: number | string;
  value: ContestantEntity | null;
  onChange: (value: ContestantEntity | null) => void;
  excludeContestantId?: number | string;
  disabled?: boolean;
}

const getInitial = (value?: string) => value?.trim().charAt(0).toUpperCase() || '?';

export const getContestantLabel = (contestant?: ContestantEntity | null) => {
  if (!contestant) return '';

  const teamName = contestant.team?.name;
  if (teamName) {
    const members = contestant.team?.members?.map((member) => member.username).filter(Boolean);
    return [teamName, ...(members ?? [])].join(' ');
  }

  return contestant.username || `#${contestant.id}`;
};

const ContestantOptionContent = ({
  contestant,
  compact = false,
}: {
  contestant: ContestantEntity;
  compact?: boolean;
}) => (
  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, width: '100%' }}>
    {contestant.team?.members?.length ? (
      <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 30, height: 30 } }}>
        {contestant.team.members.map((member) => (
          <Avatar key={member.username} src={member.avatar ?? undefined} alt={member.username}>
            {getInitial(member.username)}
          </Avatar>
        ))}
      </AvatarGroup>
    ) : (
      <Avatar
        src={contestant.avatar ?? undefined}
        alt={contestant.username}
        sx={{ width: 30, height: 30 }}
      >
        {getInitial(contestant.username)}
      </Avatar>
    )}

    <Typography
      variant="body2"
      fontWeight={800}
      color="text.secondary"
      sx={{ width: 42, flexShrink: 0 }}
    >
      {contestant.rank ? `#${contestant.rank}` : '-'}
    </Typography>

    <Box minWidth={0} flex={1}>
      {compact ? (
        <Typography variant="body2" fontWeight={700} noWrap>
          {contestant.team?.name || contestant.username || `#${contestant.id}`}
        </Typography>
      ) : (
        <ContestantView
          contestant={contestant}
          imgSize={22}
          isVirtual={contestant.isVirtual}
          isUnrated={contestant.isUnrated}
          isOfficial={contestant.isOfficial}
        />
      )}
    </Box>

    <Typography variant="body2" fontWeight={800} color="primary.main" noWrap sx={{ ml: 'auto' }}>
      {formatContestPoints(contestant.points)}
    </Typography>
  </Stack>
);

const ContestantAutocomplete = ({
  contestId,
  value,
  onChange,
  excludeContestantId,
  disabled = false,
}: ContestantAutocompleteProps) => {
  const { t } = useTranslation();
  const { data: contestants, isLoading } = useContestContestants(contestId);

  const options = useMemo(
    () =>
      (contestants ?? []).filter(
        (contestant) =>
          contestant.rowType !== 'upsolve' &&
          String(contestant.id) !== String(excludeContestantId ?? ''),
      ),
    [contestants, excludeContestantId],
  );

  return (
    <Autocomplete<ContestantEntity>
      fullWidth
      clearOnBlur={false}
      disabled={disabled || !contestId}
      filterSelectedOptions
      getOptionLabel={getContestantLabel}
      isOptionEqualToValue={(option, selectedValue) => option.id === selectedValue.id}
      loading={isLoading}
      noOptionsText={t('contests.standings.noContestantsFound')}
      onChange={(_, nextValue) => onChange(nextValue)}
      options={options}
      value={value}
      size="large"
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <ContestantOptionContent contestant={option} />
        </li>
      )}
      renderValue={(selected) =>
        selected ? <Box pt={1}><ContestantOptionContent contestant={selected} compact /></Box> : null
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('contests.standings.compareWith')}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? <CircularProgress color="inherit" size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default ContestantAutocomplete;
