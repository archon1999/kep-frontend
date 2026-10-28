import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';
import { useDuelsListPage } from 'modules/duels/application/hooks/useDuelsListPage';
import EmptyState from 'shared/components/common/EmptyState';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import FramedPage from 'shared/components/sections/common/FramedPage';
import DuelsListPageHeroCard from './DuelsListPageHeroCard.tsx';
import DuelsListPageHistoryTab from './DuelsListPageHistoryTab.tsx';
import DuelsListPageMyDuelsTab from './DuelsListPageMyDuelsTab.tsx';
import DuelsListPageWaitingRoomTab from './DuelsListPageWaitingRoomTab.tsx';

const DuelsListPage = () => {
  const { currentUser, redirectToLogin, state, setField, currentUserRating } = useDuelsListPage();

  const { t } = useTranslation();
  const id = useId();
  const tabs = [
    { value: 'my_duels' as const, label: t('duels.tab.myDuels') },
    { value: 'waiting_room' as const, label: t('duels.tab.waitingRoom') },
    { value: 'history' as const, label: t('duels.tab.history') },
  ].map((tab) => ({
    ...tab,
    tabProps: { id: `${id}-${tab.value}`, 'aria-controls': `${id}-panel` },
  }));

  return (
    <FramedPage>
      <DuelsListPageHeroCard
        userRating={currentUserRating}
        navigationComponent={
          <ResponsiveTabs
            value={state.activeTab}
            onChange={(value) => setField('activeTab', value)}
            items={tabs}
            ariaLabel={t('duels.title')}
            tabsProps={{
              variant: 'scrollable',
              scrollButtons: 'auto',
            }}
          />
        }
      />
      <Box
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${state.activeTab}`}
        sx={{ minWidth: 0 }}
      >
        {!currentUser && state.activeTab !== 'history' ? (
          <EmptyState
            kind="auth"
            title={t('duels.signInTitle')}
            description={t('duels.signInDescription')}
            action={
              <Button variant="contained" onClick={() => redirectToLogin()}>
                {t('auth.login')}
              </Button>
            }
          />
        ) : null}

        {currentUser && state.activeTab === 'my_duels' && <DuelsListPageMyDuelsTab />}

        {currentUser && state.activeTab === 'waiting_room' && <DuelsListPageWaitingRoomTab />}

        {state.activeTab === 'history' && <DuelsListPageHistoryTab />}
      </Box>
    </FramedPage>
  );
};

export default DuelsListPage;
