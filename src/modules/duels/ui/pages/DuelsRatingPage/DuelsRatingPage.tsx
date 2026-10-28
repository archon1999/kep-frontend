import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import { resources } from 'app/routes/resources';
import FramedPage from 'shared/components/sections/common/FramedPage';
import PageHeader from 'shared/components/sections/common/PageHeader.tsx';
import DuelsRatingPageTable from './DuelsRatingPageTable.tsx';

const DuelsRatingPage = () => {
  const { t } = useTranslation();

  return (
    <FramedPage>
      <PageHeader title={t('duels.ratingTitle')} backTo={resources.Duels} />

      <Box sx={{ minWidth: 0 }}>
        <DuelsRatingPageTable />
      </Box>
    </FramedPage>
  );
};

export default DuelsRatingPage;
