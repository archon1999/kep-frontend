import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Dialog, DialogActions, Stack, Typography } from '@mui/material';
import type { ProblemDetail } from 'modules/problems/domain/entities/problem.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';
import ClipboardButton from 'shared/components/common/ClipboardButton';
import DialogHeader from 'shared/components/common/DialogHeader';
import { CustomProblemBody } from './ProblemCustomBodies';

interface ProblemBodyProps {
  problem: ProblemDetail;
}

const formatAttachmentSize = (size?: number) => {
  if (!size) return '';

  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`;
};

export const ProblemBody = ({ problem }: ProblemBodyProps) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const clueTitleId = useId();
  const [showBirthdayClue, setShowBirthdayClue] = useState(false);

  useEffect(() => {
    if (problem.id !== 2179) return;

    const handleResize = () => {
      if (window.innerWidth === 2025 || window.innerHeight === 2025) {
        setShowBirthdayClue(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [problem.id]);

  const shouldRenderBody = problem.id !== 1637;

  return (
    <Stack direction="column" spacing={2}>
      <Dialog
        open={showBirthdayClue && problem.id === 2179}
        onClose={() => setShowBirthdayClue(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby={clueTitleId}
      >
        <DialogHeader
          id={clueTitleId}
          title="Keppy Birthday!"
          onClose={() => setShowBirthdayClue(false)}
        />
        <DialogActions>
          <Button autoFocus variant="contained" onClick={() => setShowBirthdayClue(false)}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        ref={contentRef}
        className="problem-body"
        sx={{
          fontSize: 15,
          lineHeight: 1.65,
          overflowWrap: 'anywhere',
          '& p': { marginBlock: '0.65em' },
          '& h2': { fontSize: 15, fontWeight: 600, lineHeight: 1.5 },
          '& > div:first-of-type > :first-child': { marginTop: 0 },
          '& strong, & b': { fontWeight: 600 },
          '& img': { maxWidth: '100%', height: 'auto' },
          '& mjx-container[display="true"]': { overflowX: 'auto', overflowY: 'hidden' },
          '& table': {
            borderCollapse: 'collapse',
            width: '100%',
          },
          '& th, & td': {
            border: '1px solid',
            borderColor: 'divider',
            padding: 1,
            verticalAlign: 'top',
          },
          '& thead tr': {
            backgroundColor: 'action.hover',
          },
          '& pre': {
            margin: 0,
            overflowX: 'auto',
            background: 'transparent',
            fontFamily: 'Consolas, "Courier New", monospace',
            fontSize: 14,
            lineHeight: 1.7,
          },
        }}
      >
        {shouldRenderBody ? <MathJaxView rawHtml={problem.body} /> : null}

        <CustomProblemBody problem={problem} />

        {problem.inputData ? (
          <Stack direction="column" mt={2.5}>
            <Typography variant="body1" component="h2">
              {t('problems.detail.inputData')}
            </Typography>
            <MathJaxView rawHtml={problem.inputData} />
          </Stack>
        ) : null}

        {problem.outputData ? (
          <Stack direction="column" mt={2.5}>
            <Typography variant="body1" component="h2">
              {t('problems.detail.outputData')}
            </Typography>
            <MathJaxView rawHtml={problem.outputData} />
          </Stack>
        ) : null}

        {problem.sampleTests?.length ? (
          <Stack direction="column" mt={2.5} spacing={2}>
            <Typography variant="body1" component="h2">
              {t('problems.detail.sampleTests')}
            </Typography>
            <Box
              component="table"
              aria-label={t('problems.detail.sampleTests')}
              sx={{
                tableLayout: 'fixed',
                '& th': {
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: 'left',
                  color: 'text.secondary',
                },
                '& td': { fontSize: 13 },
                '& pre': { whiteSpace: 'pre', pr: 3.5 },
              }}
            >
              <Box component="thead">
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>{t('problems.detail.input')}</th>
                  <th>{t('problems.detail.expectedOutput')}</th>
                </tr>
              </Box>
              <tbody>
                {problem.sampleTests.map((test, index) => (
                  <tr key={index}>
                    <td>
                      <Typography variant="metric" color="text.secondary" fontSize={15}>
                        {index + 1}
                      </Typography>
                    </td>
                    {[test.input, test.output].map((value, side) => (
                      <td key={side}>
                        <Box sx={{ position: 'relative', minHeight: 28 }}>
                          <Box component="pre">{value}</Box>
                          <Box sx={{ position: 'absolute', top: -3, right: -3 }}>
                            <ClipboardButton text={value ?? ''} iconOnly size="small" />
                          </Box>
                        </Box>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Stack>
        ) : null}

        {problem.comment ? (
          <Box mt={2.5}>
            <Typography variant="body1" component="h2" mb={1}>
              {t('problems.detail.comment')}
            </Typography>
            <MathJaxView rawHtml={problem.comment} />
          </Box>
        ) : null}

        {problem.attachments?.length ? (
          <Box mt={2.5}>
            <Typography variant="body1" component="h2" mb={1}>
              {t('problems.detail.attachments')}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {problem.attachments.map((attachment) => {
                const size = formatAttachmentSize(attachment.size);
                return (
                  <Button
                    key={attachment.id}
                    component="a"
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    variant="outlined"
                    color="neutral"
                    startIcon={<IconifyIcon icon="mdi:paperclip" />}
                    sx={{ textTransform: 'none', maxWidth: '100%', justifyContent: 'flex-start' }}
                  >
                    <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {attachment.name}
                      {size ? ` (${size})` : ''}
                    </Box>
                  </Button>
                );
              })}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Stack>
  );
};
