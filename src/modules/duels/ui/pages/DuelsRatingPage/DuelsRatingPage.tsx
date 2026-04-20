import { useTranslation } from 'react-i18next';
import { Box, Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import { responsivePagePaddingSx } from 'shared/lib/styles';
import DuelsRatingPageTable from './DuelsRatingPageTable.tsx';

const DuelsRatingPage = () => {
  const { t } = useTranslation();

  return (
    <Stack direction="column">
      <PageHeader
        title={t('duels.ratingTitle')}
        breadcrumb={[
          { label: t('duels.title'), url: resources.Duels },
          { label: t('duels.ratingTitle'), active: true },
        ]}
      />

      <Box sx={responsivePagePaddingSx}>
        <DuelsRatingPageTable />
      </Box>
    </Stack>
  );
};

export default DuelsRatingPage;
