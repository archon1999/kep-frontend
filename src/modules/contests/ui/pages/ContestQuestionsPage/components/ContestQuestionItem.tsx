import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { ContestQuestion } from 'modules/contests/domain/entities/contest-question.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { createSafeHtml } from 'shared/lib/safeHtml';

const ContestQuestionItem = ({ question }: { question: ContestQuestion }) => {
  const { t } = useTranslation();
  return (
    <Box
      component="li"
      sx={{ p: { xs: 2.5, sm: 3 }, borderBottom: 1, borderColor: 'divider', listStyle: 'none' }}
    >
      <Stack
        direction="row"
        gap={2}
        alignItems="flex-start"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <Stack gap={0.5}>
          <Typography variant="body2" fontWeight={600}>
            {question.username}
          </Typography>
          {question.problemSymbol && (
            <Typography variant="caption" color="primary.main">
              {question.problemSymbol} · {question.problemTitle}
            </Typography>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {question.created}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        sx={{ mt: 2, lineHeight: 1.8, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}
      >
        {question.question}
      </Typography>
      {question.answer && (
        <Box sx={{ mt: 2.5, pl: 2, borderLeft: '2px solid', borderColor: 'primary.main' }}>
          <Typography
            variant="label"
            component="h3"
            color="primary.main"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
          >
            <IconifyIcon icon="mdi:reply-outline" sx={{ fontSize: 18 }} />
            {t('contests.questions.answer')}
          </Typography>
          <Typography
            component="div"
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              lineHeight: 1.8,
              overflowWrap: 'anywhere',
              '& p': { my: 0.75 },
              '& img': { maxWidth: '100%' },
              '& a': { color: 'primary.main' },
            }}
            dangerouslySetInnerHTML={createSafeHtml(question.answer)}
          />
        </Box>
      )}
    </Box>
  );
};
export default ContestQuestionItem;
