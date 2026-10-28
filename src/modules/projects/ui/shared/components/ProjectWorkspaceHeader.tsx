import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Box, Divider, IconButton, Stack, Typography } from '@mui/material';
import AppbarActionItems from 'app/layouts/main-layout/common/AppbarActionItems';
import { resources } from 'app/routes/resources';
import { Project } from 'modules/projects/domain/entities/project.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import MixedText from 'shared/components/common/MixedText';
import BackToListButton from 'shared/components/sections/common/BackToListButton';

interface ProjectWorkspaceHeaderProps {
  project?: Project;
  title?: string;
  backTo?: string;
  backLabel?: string;
  context?: ReactNode;
}

const ProjectWorkspaceHeader = ({
  project,
  title,
  backTo = resources.Projects,
  backLabel,
  context,
}: ProjectWorkspaceHeaderProps) => {
  const { t } = useTranslation();
  return (
    <Box
      component="header"
      sx={{
        px: { xs: 1, md: 3 },
        py: 0.5,
        minHeight: 52,
        borderBottom: 1,
        borderColor: 'divider',
        pt: { xs: 'max(4px, env(safe-area-inset-top))', md: 0.5 },
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
        sx={{ display: { xs: 'none', md: 'flex' }, minWidth: 0 }}
      >
        <Logo showName={false} />
        <Divider orientation="vertical" flexItem />
        <BackToListButton to={backTo} label={backLabel ?? t('projects.backToProjects')} />
        <Typography variant="h6" noWrap sx={{ minWidth: 0 }}>
          <MixedText>{title ?? project?.title ?? t('projects.title')}</MixedText>
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ display: { xs: 'flex', md: 'none' }, minWidth: 0, width: 1 }}
      >
        <IconButton
          component={RouterLink}
          to={backTo}
          color="primary"
          aria-label={backLabel ?? t('projects.backToProjects')}
          sx={{ width: 44, height: 44, flexShrink: 0 }}
        >
          <IconifyIcon icon="mdi:arrow-left" width={24} height={24} />
        </IconButton>
        <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ flex: 1, minWidth: 0 }}>
          <MixedText>{title ?? project?.title ?? t('projects.title')}</MixedText>
        </Typography>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ display: { xs: 'none', md: 'flex' }, minWidth: 0 }}
      >
        {context}
        <AppbarActionItems type="slim" />
      </Stack>
    </Box>
  );
};

export default ProjectWorkspaceHeader;
