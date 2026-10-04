import { ReactNode } from 'react';
import { List, ListItem, Typography } from '@mui/material';
import { createSafeHtml } from 'shared/lib/safeHtml';

interface ProjectDetailsSectionProps {
  title: ReactNode;
  description: string | string[];
}

const ProjectDetailsSection = ({ title, description }: ProjectDetailsSectionProps) => {
  return (
    <div>
      <Typography component="div" fontWeight={700} lineHeight={1.5} mb={1}>
        {title}
      </Typography>
      {typeof description === 'string' && (
        <Typography
          component="div"
          variant="body2"
          color="text.secondary"
          sx={{
            overflowWrap: 'anywhere',
            '& img': { maxWidth: '100%', height: 'auto' },
            '& pre, & table': { maxWidth: '100%', overflowX: 'auto' },
          }}
          dangerouslySetInnerHTML={createSafeHtml(description)}
        />
      )}
      {Array.isArray(description) && (
        <List disablePadding sx={{ listStyleType: 'disc', pl: 3 }}>
          {description.map((item, index) => (
            <ListItem
              key={index}
              disableGutters
              disablePadding
              sx={{
                display: 'list-item',
                fontSize: 14,
                color: 'text.secondary',
              }}
              dangerouslySetInnerHTML={createSafeHtml(item)}
            />
          ))}
        </List>
      )}
    </div>
  );
};

export default ProjectDetailsSection;
