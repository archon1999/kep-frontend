import { Grid, Stack, Typography } from '@mui/material';
import { Test } from '../../domain';
import TestCard from './TestCard.tsx';


interface Props {
  chapterTitle: string;
  tests: Test[];
}

const ChapterCard = ({ chapterTitle, tests }: Props) => (
  <Stack direction="column" spacing={2}>
    <Typography variant="h6" fontWeight={800}>
      {chapterTitle}
    </Typography>

    <Grid container spacing={2}>
      {tests.map((test) => (
        <Grid key={test.id} size={{ xs: 12, md: 6 }}>
          <TestCard test={test} />
        </Grid>
      ))}
    </Grid>
  </Stack>
);

export default ChapterCard;
