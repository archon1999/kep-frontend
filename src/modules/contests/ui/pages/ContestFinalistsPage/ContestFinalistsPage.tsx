import { useTranslation } from 'react-i18next';
import {
  Box,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useContestFinalistsPage } from 'modules/contests/application/hooks/useContestFinalistsPage';
import ContestPageHeader from 'modules/contests/ui/shared/components/ContestPageHeader';
import ContestPageLayout from 'modules/contests/ui/shared/components/ContestPageLayout';
import ContestantView from 'modules/contests/ui/shared/components/ContestantView';
import { formatContestPoints } from 'modules/contests/ui/shared/utils/contestType';
import { Page404 } from 'modules/errors/ui/pages';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const ContestFinalistsPage = () => {
  const { t } = useTranslation();
  const { contestId, contest, finalists, contestLoading, loading, error, notFound } =
    useContestFinalistsPage();
  const title = t('contests.tabs.finalists');

  if (notFound) return <Page404 />;

  return (
    <ContestPageLayout
      flush
      error={error}
      header={
        <ContestPageHeader
          title={contest?.title ?? title}
          contestId={contestId}
          contest={contest}
          isLoading={contestLoading}
        />
      }
    >
      <Box
        component="section"
        aria-labelledby="contest-finalists-heading"
        sx={{ borderBottom: '1px solid var(--kep-line)' }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{
            px: 'var(--kep-content-inset)',
            py: 2,
            borderBottom: '1px solid var(--kep-line)',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <IconifyIcon icon="mdi:trophy-outline" color="warning.main" fontSize={24} />
            <Typography variant="h5" component="h2" id="contest-finalists-heading">
              {title}
            </Typography>
          </Stack>
          {finalists && (
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {finalists.length}
            </Typography>
          )}
        </Stack>
        {loading ? (
          <Stack spacing={1.5} sx={{ px: 'var(--kep-content-inset)', py: 2 }}>
            {Array.from({ length: 4 }, (_, index) => (
              <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                <Skeleton width="40%" height={30} />
                <Skeleton width={38} height={30} />
              </Stack>
            ))}
          </Stack>
        ) : finalists?.length ? (
          <Table size="small" aria-label={title}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ pl: 'var(--kep-content-inset)' }}>
                  {t('contests.standings.contestant')}
                </TableCell>
                <TableCell align="right" sx={{ pr: 'var(--kep-content-inset)' }}>
                  {t('contests.standings.points')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalists.map((finalist) => (
                <TableRow key={finalist.id} hover>
                  <TableCell sx={{ pl: 'var(--kep-content-inset)', py: 1 }}>
                    <ContestantView contestant={finalist} imgSize={26} showCountry />
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ pr: 'var(--kep-content-inset)', whiteSpace: 'nowrap' }}
                  >
                    <Typography fontWeight={700} color="primary.main">
                      {formatContestPoints(finalist.points)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            color="text.secondary"
            sx={{ px: 'var(--kep-content-inset)', py: 4, textAlign: 'center' }}
          >
            {t('contests.finalists.empty')}
          </Typography>
        )}
      </Box>
    </ContestPageLayout>
  );
};

export default ContestFinalistsPage;
