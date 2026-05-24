import { Box, Card, CardContent, Divider, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDocumentTitle } from 'app/providers/DocumentTitleProvider';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam } from 'shared/lib/queryParams';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import { useDuelCalls, useDuelsList } from 'modules/duels/application/queries.ts';
import DuelsListPageHeroCard from './DuelsListPageHeroCard.tsx';
import DuelsListPageHistoryTab from './DuelsListPageHistoryTab.tsx';
import DuelsListPageMyDuelsTab from './DuelsListPageMyDuelsTab.tsx';
import DuelsListPageWaitingRoomTab from './DuelsListPageWaitingRoomTab.tsx';

type DuelsTab = 'my_duels' | 'waiting_room' | 'history';

type DuelsListQueryState = {
  activeTab: DuelsTab | '';
};

const DuelsListPage = () => {
  const { t } = useTranslation();
  useDocumentTitle('pageTitles.duels');

  const { state, setField } = useRouteQueryState<DuelsListQueryState>({
    defaults: {
      activeTab: '',
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

  const { data: needsResponsePage } = useDuelCalls({
    scope: 'needs_response',
    page: 1,
    pageSize: 1,
  });
  const { data: myCallsPage } = useDuelCalls({
    scope: 'mine',
    page: 1,
    pageSize: 1,
  });
  const { data: myDuels } = useDuelsList({
    my: true,
    page: 1,
    pageSize: 1,
  });

  const resolvedActiveTab: DuelsTab =
    state.activeTab ||
    ((needsResponsePage?.total ?? 0) > 0 ||
    (myCallsPage?.total ?? 0) > 0 ||
    (myDuels?.total ?? 0) > 0
      ? 'my_duels'
      : 'waiting_room');
  const tabs = [
    { value: 'my_duels' as const, label: t('duels.tab.myDuels') },
    { value: 'waiting_room' as const, label: t('duels.tab.waitingRoom') },
    { value: 'history' as const, label: t('duels.tab.history') },
  ];

  return (
    <Box sx={responsivePagePaddingSx}>
      <Stack spacing={4} direction="column">
        <DuelsListPageHeroCard />

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent sx={{ pb: 0 }}>
            <ResponsiveTabs
              value={resolvedActiveTab}
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
            {resolvedActiveTab === 'my_duels' && <DuelsListPageMyDuelsTab />}

            {resolvedActiveTab === 'waiting_room' && <DuelsListPageWaitingRoomTab />}

            {resolvedActiveTab === 'history' && <DuelsListPageHistoryTab />}
          </Box>
        </Card>
      </Stack>
    </Box>
  );
};

export default DuelsListPage;
