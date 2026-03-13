import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { Button, Link, Popover, Skeleton, Stack, Typography, paperClasses } from '@mui/material';
import { resources } from 'app/routes/resources';
import { useAuth } from 'app/providers/AuthProvider';
import { TodayKepCoin, type KepCoinBalance } from 'shared/api/orval/generated/endpoints/index.schemas';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import axiosFetcher from 'shared/services/axios/axiosFetcher';
import KepcoinValue from 'shared/components/common/KepcoinValue';
import { wsService } from 'shared/services/websocket';

interface KepcoinMenuProps {
  type?: 'default' | 'slim';
}

const KepcoinMenu = ({ type = 'default' }: KepcoinMenuProps) => {
  const [todayStats, setTodayStats] = useState<TodayKepCoin | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { currentUser, setCurrentUser } = useAuth();
  const { data: fetchedBalance, mutate: mutateBalance } = useSWR<KepCoinBalance>(
    ['/api/my-kepcoin', { method: 'get' }],
    axiosFetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    },
  );

  const { trigger: fetchTodayStats, isMutating: loadingToday } = useSWRMutation(
    ['/api/today-kepcoin', { method: 'get' }],
    axiosFetcher,
    {
      throwOnError: false,
    },
  );

  const balance = useMemo(() => currentUser?.kepcoin ?? fetchedBalance?.kepcoin ?? null, [
    currentUser?.kepcoin,
    fetchedBalance?.kepcoin,
  ]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

    fetchTodayStats()
      .then((data) => setTodayStats(data ?? null))
      .catch(() => setTodayStats(null));
  };

  const open = Boolean(anchorEl);
  const formattedBalance = balance === null ? '--' : balance.toLocaleString();

  useEffect(() => {
    if (!currentUser?.username) return undefined;

    const username = currentUser.username;

    wsService.send('kepcoin-add', username);

    const unsubscribe = wsService.on<number>(`kepcoin-${username}`, (kepcoin) => {
      setCurrentUser((prevUser) => (prevUser ? { ...prevUser, kepcoin } : prevUser));

      mutateBalance((prevBalance) => (prevBalance ? { ...prevBalance, kepcoin } : prevBalance), false);
    });

    return () => {
      wsService.send('kepcoin-delete', username);
      unsubscribe();
    };
  }, [currentUser?.username, mutateBalance, setCurrentUser]);

  return (
    <>
      <Button
        onClick={handleOpen}
        color="neutral"
        variant={type === 'default' ? 'soft' : 'text'}
        size="small"
      >
        <KepcoinValue
          value={formattedBalance}
          iconSize={type === 'slim' ? 18 : 22}
          spacing={1}
          fontWeight={600}
        />
      </Button>

      <Popover
        anchorEl={anchorEl}
        id="kepcoin-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        sx={{
          [`& .${paperClasses.root}`]: {
            minWidth: 280,
            p: 0,
          },
        }}
      >
        <Stack direction="row" spacing={2} sx={{ p: 2 }}>
          <KepcoinValue value={formattedBalance} iconSize={30} textVariant="h6" fontWeight={700} />

          <Button
            component={Link}
            href={resources.Kepcoin}
            variant="text"
            color="primary"
            onClick={handleClose}
          >
            Kepcoin sahifasiga o&apos;tish
          </Button>
        </Stack>

        {loadingToday ? (
          <Stack spacing={1} padding={2} direction="column">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Skeleton variant="text" width={104} height={20} />
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="text" width={32} height={20} />
                <Skeleton variant="circular" width={type === 'slim' ? 18 : 22} height={type === 'slim' ? 18 : 22} />
              </Stack>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Skeleton variant="text" width={110} height={20} />
              <Stack direction="row" spacing={1} alignItems="center">
                <Skeleton variant="text" width={32} height={20} />
                <Skeleton variant="circular" width={type === 'slim' ? 18 : 22} height={type === 'slim' ? 18 : 22} />
              </Stack>
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1} padding={2} direction="column">
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Bugun topilgan
              </Typography>
              <KepcoinValue
                value={todayStats ? todayStats.earn : '--'}
                iconSize={type === 'slim' ? 18 : 22}
                textVariant="body2"
                fontWeight={700}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                Bugun sarflangan
              </Typography>
              <KepcoinValue
                value={todayStats ? todayStats.spend : '--'}
                iconSize={type === 'slim' ? 18 : 22}
                textVariant="body2"
                fontWeight={700}
              />
            </Stack>
          </Stack>
        )}
      </Popover>
    </>
  );
};

export default KepcoinMenu;
