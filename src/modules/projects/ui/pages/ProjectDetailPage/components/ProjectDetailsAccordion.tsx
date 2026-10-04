import { ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { createSafeHtml } from 'shared/lib/safeHtml';

interface ProjectDetailsAccordionProps {
  id: string;
  title: ReactNode;
  description: string;
  defaultExpanded?: boolean;
}

const ProjectDetailsAccordion = ({
  id,
  title,
  description,
  defaultExpanded,
}: ProjectDetailsAccordionProps) => (
  <Accordion defaultExpanded={defaultExpanded} sx={{ '&:hover': { bgcolor: 'transparent' } }}>
    <AccordionSummary id={`${id}-header`} aria-controls={`${id}-content`} sx={{ px: 0, py: 2 }}>
      <Typography component="span" sx={{ width: 1 }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails id={`${id}-content`} sx={{ pl: 4, pr: 0, pb: 3 }}>
      <Typography
        component="div"
        variant="body2"
        sx={{
          overflowWrap: 'anywhere',
          '& img': { maxWidth: '100%', height: 'auto' },
          '& pre, & table': { maxWidth: '100%', overflowX: 'auto' },
        }}
        dangerouslySetInnerHTML={createSafeHtml(description)}
      />
    </AccordionDetails>
  </Accordion>
);

export default ProjectDetailsAccordion;
