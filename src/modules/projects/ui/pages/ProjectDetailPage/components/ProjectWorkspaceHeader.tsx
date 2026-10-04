import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Button, Divider, IconButton, Stack, Typography } from '@mui/material';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { resources } from 'app/routes/resources';
import { Project } from 'modules/projects/domain/entities/project.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';

const ProjectWorkspaceHeader = ({ project }: { project?: Project }) => {
  const { t } = useTranslation();
  return (
    <Box
      component="header"
      sx={{
        px: { xs: 1, md: 3 },
        py: { xs: 0.5, md: 1.5 },
        pt: { xs: 'max(4px, env(safe-area-inset-top))', md: 1.5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        bgcolor: { xs: 'background.paper', md: 'transparent' },
        flexShrink: 0,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ display: { xs: 'none', md: 'flex' } }}
      >
        <Logo showName={false} />
        <Divider orientation="vertical" flexItem />
        <Button
          component={RouterLink}
          to={resources.Projects}
          color="primary"
          startIcon={<IconifyIcon icon="mdi:format-list-bulleted" />}
        >
          {t('projects.title')}
        </Button>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ display: { xs: 'flex', md: 'none' }, minWidth: 0, width: 1 }}
      >
        <IconButton
          component={RouterLink}
          to={resources.Projects}
          color="primary"
          aria-label={t('projects.backToProjects')}
          sx={{ width: 44, height: 44, flexShrink: 0 }}
        >
          <IconifyIcon icon="mdi:arrow-left" width={24} height={24} />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ flex: 1, minWidth: 0 }}>
          {project?.title ?? t('projects.title')}
        </Typography>
      </Stack>
      <AppbarActionItems type="slim" sx={{ display: { xs: 'none', md: 'flex' } }} />
    </Box>
  );
};

export default ProjectWorkspaceHeader;
