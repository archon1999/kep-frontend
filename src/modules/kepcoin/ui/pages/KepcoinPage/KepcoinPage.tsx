import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { contentGridSx } from 'app/theme/styles/content';
import { useKepcoinPage } from 'modules/kepcoin/application/hooks/useKepcoinPage';
import HowToEarnWidget from 'modules/kepcoin/ui/shared/widgets/HowToEarnWidget';
import HowToSpendWidget from 'modules/kepcoin/ui/shared/widgets/HowToSpendWidget';
import KepcoinActivityWidget from 'modules/kepcoin/ui/shared/widgets/KepcoinActivityWidget';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ResponsiveTabs from 'shared/components/common/ResponsiveTabs';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader';
import SectionHeader from 'shared/components/sections/common/SectionHeader';
import KepcoinOverview from './components/KepcoinOverview';

const KepcoinPage = () => {
  const {
    state,
    summary,
    isSummaryLoading,
    summaryError,
    reloadSummary,
    isHistoryLoading,
    historyError,
    retryHistory,
    handleViewChange,
    handlePageChange,
    historyItems,
    pagesCount,
    handlePurchaseStreakFreeze,
  } = useKepcoinPage();

  const { t } = useTranslation();
  const [guide, setGuide] = useState<'earns' | 'spends'>('earns');

  return (
    <FramedPage>
      <PageHeader
        title={t('menu.kepcoin')}
        variant="detail"
        actionComponent={
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button
              component={RouterLink}
              to={resources.KepcoinEarn}
              variant="contained"
              endIcon={<IconifyIcon icon="mdi:arrow-right" />}
            >
              {t('kepcoinPage.earnEntry.action')}
            </Button>
            <Button component={RouterLink} to={resources.Shop} variant="outlined">
              {t('kepcoinPage.earnPage.openShop')}
            </Button>
          </Stack>
        }
      />
      <KepcoinOverview
        summary={summary}
        loading={isSummaryLoading}
        error={summaryError}
        onRetry={() => void reloadSummary()}
        onPurchase={handlePurchaseStreakFreeze}
      />
      <Box
        sx={{
          ...contentGridSx,
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.6fr) minmax(0, 1fr)' },
        }}
      >
        <KepcoinActivityWidget
          view={state.view}
          onViewChange={handleViewChange}
          isLoading={isHistoryLoading}
          error={historyError}
          historyItems={historyItems}
          pagesCount={pagesCount}
          page={state.page}
          onPageChange={handlePageChange}
          onRetry={retryHistory}
        />
        <Box component="aside">
          <SectionHeader
            title={t(
              guide === 'earns' ? 'kepcoinPage.howToEarn.title' : 'kepcoinPage.howToSpend.title',
            )}
          />
          <ResponsiveTabs<'earns' | 'spends'>
            value={guide}
            onChange={setGuide}
            ariaLabel={t('menu.kepcoin')}
            items={(['earns', 'spends'] as const).map((value) => ({
              value,
              label: t('kepcoinPage.history.tabs.' + value),
            }))}
            tabsProps={{
              sx: {
                px: 'var(--kep-content-inset)',
                borderBottom: 1,
                borderColor: 'divider',
              },
            }}
          />
          {guide === 'earns' ? <HowToEarnWidget /> : <HowToSpendWidget />}
        </Box>
      </Box>
    </FramedPage>
  );
};

export default KepcoinPage;
