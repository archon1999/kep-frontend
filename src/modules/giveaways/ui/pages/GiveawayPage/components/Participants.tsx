import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  ButtonBase,
  Chip,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import UserPopover from 'modules/users/ui/shared/components/UserPopover';
import type { Participant } from '../../../../domain/entities/giveaway.types';

export default function Participants({
  users,
  username,
}: {
  users: Participant[];
  username: string;
}) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const filtered = users.filter((person) =>
    person.username.toLowerCase().includes(search.toLowerCase()),
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(filtered.length / 24)));
  return (
    <Box className="giveaway-panel" sx={{ p: { xs: 2.5, md: 3.5 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        gap={2}
        justifyContent="space-between"
        alignItems={{ sm: 'center' }}
      >
        <Stack direction="row" gap={1.5} alignItems="center">
          <Typography variant="h6" fontWeight={800}>
            {t('giveaways.participants')}
          </Typography>
          <Chip size="small" label={users.length} />
        </Stack>
        <TextField
          size="small"
          label={t('giveaways.search')}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 1.5,
          mt: 3,
        }}
      >
        {filtered.slice((currentPage - 1) * 24, currentPage * 24).map((person) => (
          <Stack
            key={person.id}
            direction="row"
            alignItems="center"
            gap={1}
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: person.username === username ? 'action.selected' : 'action.hover',
              minWidth: 0,
            }}
          >
            <UserPopover username={person.username}>
              <ButtonBase sx={{ gap: 1, minWidth: 0, borderRadius: 1, textAlign: 'left' }}>
                <Avatar sx={{ width: 32, height: 32, fontSize: 12 }}>
                  {person.username.slice(0, 2).toUpperCase()}
                </Avatar>
                <Typography noWrap variant="body2" fontWeight={600}>
                  {person.username}
                </Typography>
              </ButtonBase>
            </UserPopover>
            {person.username === username && (
              <Chip size="small" color="success" label={t('giveaways.you')} />
            )}
          </Stack>
        ))}
      </Box>
      {!filtered.length && (
        <Typography color="text.secondary" sx={{ py: 3 }}>
          {t(users.length ? 'giveaways.noMatches' : 'giveaways.noEntriesYet')}
        </Typography>
      )}
      {filtered.length > 24 && (
        <Pagination
          sx={{ mt: 3 }}
          count={Math.ceil(filtered.length / 24)}
          page={currentPage}
          onChange={(_, value) => setPage(value)}
        />
      )}
    </Box>
  );
}
