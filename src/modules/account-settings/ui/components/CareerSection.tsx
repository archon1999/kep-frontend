import { Stack } from '@mui/material';
import EducationsForm from './EducationsForm';
import WorkExperiencesForm from './WorkExperiencesForm';

const CareerSection = () => (
  <Stack direction="column" spacing={3}>
    <EducationsForm />
    <WorkExperiencesForm />
  </Stack>
);

export default CareerSection;
