import { Stack } from '@mui/material';
import EducationsForm from './EducationsForm.tsx';
import WorkExperiencesForm from './WorkExperiencesForm.tsx';

const CareerSection = () => (
  <Stack direction="column" spacing={0}>
    <EducationsForm />
    <WorkExperiencesForm />
  </Stack>
);

export default CareerSection;
