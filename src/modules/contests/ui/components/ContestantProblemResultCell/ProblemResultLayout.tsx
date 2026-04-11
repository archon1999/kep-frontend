import { Stack, Typography } from '@mui/material';
import type { ProblemResultView } from './types';

const ProblemResultLayout = ({ result }: { result: ProblemResultView }) => (
  <Stack spacing={0.25} alignItems="center" width="100%">
    {result.isBest ? (
      <Stack
        spacing={0.25}
        justifyContent="center"
        alignItems="center"
        bgcolor="success.lighter"
        sx={{ borderRadius: 2, py: 0.5, px: 0.75 }}
      >
        <Typography variant="subtitle2" color={result.color}>
          {result.label}
        </Typography>
        {result.helper ? (
          <Typography variant="overline" fontWeight={500}>
            {result.helper}
          </Typography>
        ) : null}
      </Stack>
    ) : (
      <>
        <Typography variant="subtitle2" color={result.color}>
          {result.label}
        </Typography>
        {result.helper ? (
          <Typography variant="overline" fontWeight={500}>
            {result.helper}
          </Typography>
        ) : null}
      </>
    )}
  </Stack>
);

export default ProblemResultLayout;
