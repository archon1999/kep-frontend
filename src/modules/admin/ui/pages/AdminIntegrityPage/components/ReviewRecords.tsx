import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from '@mui/material';
import type { ContestReview } from 'modules/admin/domain/entities/integrity.types';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export default function ReviewRecords({ data }: { data: ContestReview }) {
  const { t, i18n } = useTranslation();
  const progress = data.run?.progress;
  const history = data.history.filter((s) => s.contest === data.contest.id);
  const names = new Map(data.people.map((p) => [p.id, p.name]));
  return (
    <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
      {!!progress?.coverage?.length && (
        <Accordion disableGutters>
          <AccordionSummary expandIcon={<IconifyIcon icon="mdi:chevron-down" />}>
            {t('admin.integrity.coverage')}
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('admin.integrity.coverageHelp')}
              {!!progress.unmatched &&
                ' ' + t('admin.integrity.unmatched', { count: progress.unmatched })}
            </Typography>
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1 }}
            >
              {progress.coverage.map((g) => (
                <Box key={g.symbol + g.lang} sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2">
                    {g.symbol} · {g.lang.toUpperCase()}{' '}
                    {g.parser === 'text' ? ' · ' + t('admin.integrity.textMode') : ''}
                  </Typography>
                  <Typography variant="caption" color={g.issue ? 'warning.main' : 'text.secondary'}>
                    {g.issue === 'group_failed'
                      ? t('admin.integrity.groupFailed')
                      : t('admin.integrity.groupCounts', {
                          checked: g.compared ?? 0,
                          total: g.total,
                          duplicates: g.duplicate ?? 0,
                          alone: g.noPeer ?? 0,
                          skipped: (g.unparsed ?? 0) + (g.empty ?? 0),
                        })}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
      <Accordion disableGutters>
        <AccordionSummary expandIcon={<IconifyIcon icon="mdi:chevron-down" />}>
          {t('admin.integrity.history')} · {history.length}
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={1.25}>
            {history.length ? (
              history.map((s) => (
                <Box key={s.id}>
                  <Typography variant="subtitle2">
                    {names.get(s.entry)} ·{' '}
                    {t('admin.integrity.' + (s.account ? 'block' : 'exclude'))}
                    {s.account
                      ? ' · ' +
                        (data.people
                          .find((p) => p.id === s.entry)
                          ?.accounts.find((a) => a.id === s.account)?.name ?? '#' + s.account)
                      : ''}
                  </Typography>
                  <Typography variant="body2" sx={{ overflowWrap: 'anywhere' }}>
                    {s.reason}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.actor} · {new Date(s.at).toLocaleString(i18n.language)}
                  </Typography>
                  {s.revoked && (
                    <Typography variant="body2" color="primary.main">
                      {t('admin.integrity.lifted')} · {s.revokeReason} · {s.revokedBy} ·{' '}
                      {new Date(s.revoked).toLocaleString(i18n.language)}
                    </Typography>
                  )}
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                {t('admin.integrity.noSanctions')}
              </Typography>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
