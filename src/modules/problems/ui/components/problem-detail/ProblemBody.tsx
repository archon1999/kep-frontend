import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import MathJaxView from 'shared/components/base/MathJaxView.tsx';
import ClipboardButton from 'shared/components/common/ClipboardButton';
import type { ProblemDetail } from '../../../domain/entities/problem.entity';
import { CustomProblemBody } from './ProblemCustomBodies';

interface ProblemBodyProps {
  problem: ProblemDetail;
}

export const ProblemBody = ({ problem }: ProblemBodyProps) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (problem.id !== 2179) return;

    const handleResize = () => {
      if (window.innerWidth === 2025 || window.innerHeight === 2025) {
        alert('Keppy Birthday!');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [problem.id]);

  const shouldRenderBody = problem.id !== 1637;
  const hasExtraSections = useMemo(
    () =>
      Boolean(
        problem.inputData ||
          problem.outputData ||
          (problem.sampleTests && problem.sampleTests.length > 0) ||
          problem.comment,
      ),
    [problem.comment, problem.inputData, problem.outputData, problem.sampleTests],
  );

  return (
    <Stack direction="column" spacing={2}>
      <Box
        ref={contentRef}
        className="problem-body"
        sx={{
          userSelect: 'none',
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
            background: 'transparent',
            fontFamily: 'monospace',
          },
        }}
      >
        {shouldRenderBody ? <MathJaxView rawHtml={problem.body} /> : null}

        <CustomProblemBody problem={problem} />

        {hasExtraSections ? <Divider sx={{ my: 2 }} /> : null}

        {problem.inputData ? (
          <Stack direction="column" mt={2}>
            <Typography variant="h6">{t('problems.detail.inputData')}</Typography>
            <MathJaxView rawHtml={problem.inputData}/>
          </Stack>
        ) : null}

        {problem.outputData ? (
          <Stack direction="column" mt={2}>
            <Typography variant="h6">{t('problems.detail.outputData')}</Typography>
            <MathJaxView rawHtml={problem.outputData}/>
          </Stack>
        ) : null}

        {problem.sampleTests?.length ? (
          <Stack direction="column" mt={2} spacing={2}>
            <Typography variant="h6">{t('problems.detail.sampleTests')}</Typography>
            <Stack direction="column" spacing={2}>
              {problem.sampleTests.map((test, index) => (
                <Card key={`${test.input}-${index}`} variant="outlined">
                  <CardContent>
                    <Stack direction="column" spacing={2}>
                      <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography fontWeight={700}>{t('problems.detail.input')}</Typography>
                          <ClipboardButton text={test.input ?? ''} />
                        </Stack>
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {test.input}
                        </Box>
                      </Box>

                      <Box>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography fontWeight={700}>
                            {t('problems.detail.expectedOutput')}
                          </Typography>
                          <ClipboardButton text={test.output ?? ''} />
                        </Stack>
                        <Box
                          sx={{
                            mt: 1,
                            p: 1.5,
                            borderRadius: 1,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            fontFamily: 'monospace',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {test.output}
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Stack>
        ) : null}

        {problem.comment ? (
          <Box mt={3}>
            <Typography variant="h6" mb={1}>
              {t('problems.detail.comment')}
            </Typography>
            <MathJaxView rawHtml={problem.comment}/>
          </Box>
        ) : null}
      </Box>
    </Stack>
  );
};
