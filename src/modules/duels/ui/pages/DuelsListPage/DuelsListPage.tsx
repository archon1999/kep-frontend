import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { useDuelsRating } from 'modules/duels/application/queries.ts';
import DuelsListPageHeroCard from './DuelsListPageHeroCard.tsx';
import DuelsListPageHistoryTab from './DuelsListPageHistoryTab.tsx';
import DuelsListPageMyDuelsTab from './DuelsListPageMyDuelsTab.tsx';
import DuelsListPageWaitingRoomTab from './DuelsListPageWaitingRoomTab.tsx';

type DuelsTab = 'my_duels' | 'waiting_room' | 'history';

type DuelsListQueryState = {
  activeTab: DuelsTab;
};

const DuelsListPage = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  useDocumentTitle('pageTitles.duels');

  const { state, setField } = useRouteQueryState<DuelsListQueryState>({
    defaults: {
      activeTab: 'waiting_room',
    },
    schema: {
      activeTab: {
        ...enumParam(['my_duels', 'waiting_room', 'history'] as const),
        param: 'tab',
      },
    },
    historyByKey: {
      activeTab: 'push',
    },
  });

  const { data: ratingPage } = useDuelsRating({
    page: 1,
    pageSize: 1,
    pinCurrentUser: true,
  });
  const ratingRows = [...(ratingPage?.data ?? []), ...(ratingPage?.pinnedRows ?? [])];
  const currentUserRating = currentUser
    ? ratingRows.find((row) => row.user.username === currentUser.username)
    : undefined;
  const tabs = [
    { value: 'my_duels' as const, label: t('duels.tab.myDuels') },
    { value: 'waiting_room' as const, label: t('duels.tab.waitingRoom') },
    { value: 'history' as const, label: t('duels.tab.history') },
  ];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4} direction="column">
        <DuelsListPageHeroCard userRating={currentUserRating} />

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ pb: 0 }}>
            <ResponsiveTabs
              value={state.activeTab}
              onChange={(value) => setField('activeTab', value)}
              items={tabs}
              ariaLabel="duels tabs"
              tabsProps={{
                variant: 'scrollable',
                scrollButtons: 'auto',
              }}
            />
          </CardContent>
          <Divider />
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            {!currentUser && state.activeTab !== 'history' ? (
              <Stack spacing={1.5} alignItems="flex-start">
                <Typography variant="h6" fontWeight={700}>
                  {t('duels.signInTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.signInDescription')}
                </Typography>
                <Button variant="contained" onClick={() => redirectToLogin()}>
                  {t('auth.login')}
                </Button>
              </Stack>
            ) : null}

            {currentUser && state.activeTab === 'my_duels' && <DuelsListPageMyDuelsTab />}

            {currentUser && state.activeTab === 'waiting_room' && <DuelsListPageWaitingRoomTab />}

            {state.activeTab === 'history' && <DuelsListPageHistoryTab />}
          </Box>
        </Card>
      </Stack>
    </Box>
  );
};

export default DuelsListPage;
