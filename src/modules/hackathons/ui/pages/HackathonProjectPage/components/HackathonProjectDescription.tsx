import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import type { HackathonProject } from 'modules/hackathons/domain';
import ProjectDescription from 'modules/projects/ui/shared/components/ProjectDescription';

interface HackathonProjectDescriptionProps {
  hackathonProject: HackathonProject;
}

const HackathonProjectDescription = ({ hackathonProject }: HackathonProjectDescriptionProps) => {
  const { t } = useTranslation();
  const taskPointsByNumber = new Map(
    (hackathonProject.taskPoints ?? []).map((item) => [item.taskNumber, item.points]),
  );

  return (
    <ProjectDescription
      project={hackathonProject.project}
      idPrefix={`hackathon-project-${hackathonProject.id}`}
      renderTaskReward={(task) => (
        <Box
          component="span"
          sx={{
            color: 'text.secondary',
            fontSize: 'caption.fontSize',
            fontWeight: 400,
            flexShrink: 0,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {taskPointsByNumber.get(task.number) ?? 0} {t('hackathons.pointsUnit')}
        </Box>
      )}
      sx={{
        gap: 3,
        mb: 0,
        '& .MuiAccordionSummary-root': { minHeight: 48, py: 1 },
        '& .MuiAccordionSummary-root .MuiTypography-root': {
          fontSize: 'subtitle1.fontSize',
          fontWeight: 500,
        },
      }}
    />
  );
};
export default HackathonProjectDescription;
