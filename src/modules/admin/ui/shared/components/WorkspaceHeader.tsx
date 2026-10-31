import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';

interface Props {
  title: string;
  subtitle?: ReactNode;
  icon?: string;
  backTo?: string;
  backLabel?: string;
  children?: ReactNode;
}

/** A compact working header; the public marketing hero is kept out of editing screens. */
export default function WorkspaceHeader({
  title,
  subtitle,
  icon,
  backTo,
  backLabel,
  children,
}: Props) {
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      gap={2}
      alignItems={{ sm: 'center' }}
      sx={{ px: { xs: 2, md: 3 }, py: 2.5, borderBottom: 1, borderColor: 'divider' }}
    >
      <Stack
        direction="row"
        gap={1.5}
        alignItems="center"
        sx={{ minWidth: 0, flex: '1 1 auto', maxWidth: '100%' }}
      >
        {backTo ? (
          <Tooltip title={backLabel}>
            <IconButton
              component={Link}
              to={backTo}
              aria-label={backLabel}
              color="default"
              sx={{ border: 1, borderColor: 'divider', borderRadius: 1, flexShrink: 0 }}
            >
              <IconifyIcon icon="mdi:arrow-left" />
            </IconButton>
          </Tooltip>
        ) : icon ? (
          <IconifyIcon icon={icon} sx={{ fontSize: 28, color: 'primary.main' }} />
        ) : null}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 23, md: 28 },
              fontWeight: 650,
              lineHeight: 1.3,
              overflowWrap: 'anywhere',
            }}
          >
            <MixedText>{title}</MixedText>
          </Typography>
          {subtitle && (
            <Typography component="div" variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      </Stack>
      {children && (
        <Stack
          direction="row"
          gap={1}
          flexWrap="wrap"
          alignItems="center"
          sx={{ flex: '0 1 auto', maxWidth: '100%' }}
        >
          {children}
        </Stack>
      )}
    </Stack>
  );
}
