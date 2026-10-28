import { ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { displayFontFamily } from 'app/theme/fonts';
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
      <Typography component="span" sx={{ width: 1, fontFamily: displayFontFamily, fontSize: 17 }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails id={`${id}-content`} sx={{ px: 0, pb: 3 }}>
      <Typography
        component="div"
        variant="body2"
        sx={{
          overflowWrap: 'anywhere',
          lineHeight: 1.85,
          '& img': { maxWidth: '100%', height: 'auto' },
          '& pre, & table': { maxWidth: '100%', overflowX: 'auto' },
        }}
        dangerouslySetInnerHTML={createSafeHtml(description)}
      />
    </AccordionDetails>
  </Accordion>
);

export default ProjectDetailsAccordion;
