import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PatternArtwork from 'shared/components/common/PatternArtwork';
import { getFileExtension, getFileIcon } from 'shared/lib/utils';

interface ProjectFileUploadProps {
  file: File | null;
  fileAccept: string;
  disabled?: boolean;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

const ProjectFileUpload = ({
  file,
  fileAccept,
  disabled,
  onSelect,
  onRemove,
}: ProjectFileUploadProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const showDropTarget = isDragging && !disabled;
  const lastDot = file?.name.lastIndexOf('.') ?? -1;
  const name = file ? (lastDot === -1 ? file.name : file.name.substring(0, lastDot)) : '';
  const extension = file && lastDot !== -1 ? file.name.substring(lastDot) : '';

  return (
    <Stack direction="column" sx={{ rowGap: 1.5 }}>
      <Box
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={t(file ? 'projects.changeFile' : 'projects.chooseFile')}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onKeyDown={(event) => {
          if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled || !event.dataTransfer.types.includes('Files')) return;
          dragDepth.current += 1;
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          dragDepth.current = Math.max(0, dragDepth.current - 1);
          if (dragDepth.current === 0) setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          dragDepth.current = 0;
          setIsDragging(false);
          const droppedFile = event.dataTransfer.files[0];
          if (!disabled && droppedFile) onSelect(droppedFile);
        }}
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: showDropTarget ? 'action.selected' : 'background.default',
          minHeight: 172,
          borderRadius: 0,
          borderWidth: 1,
          borderColor: showDropTarget ? 'primary.main' : 'divider',
          borderStyle: 'dashed',
          cursor: disabled ? 'default' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          transition: ({ transitions }) =>
            transitions.create(['background-color', 'border-color'], {
              duration: transitions.duration.enteringScreen,
              easing: transitions.easing.easeInOut,
            }),
          opacity: disabled ? 0.6 : 1,
          '&:hover': disabled
            ? undefined
            : { bgcolor: 'action.hover', borderColor: 'primary.main' },
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={fileAccept}
          disabled={disabled}
          onChange={(event) => {
            const uploadedFile = event.target.files?.[0];
            if (uploadedFile) onSelect(uploadedFile);
            event.target.value = '';
          }}
        />
        <Stack
          direction="column"
          flexWrap="wrap"
          sx={{ justifyContent: 'center', alignItems: 'center', gap: 1 }}
        >
          <PatternArtwork kind="hackathon" sx={{ width: 110, opacity: 0.8 }} />
          <Typography variant="caption" component="p" sx={{ alignSelf: 'center' }}>
            {t('projects.dropFilesHere')}{' '}
            <Box component="span" sx={{ color: 'text.secondary', mx: 0.5 }}>
              {t('projects.or')}
            </Box>
            <Box component="span" sx={{ color: 'primary.main' }}>
              {t('projects.browseFromDevice')}
            </Box>
          </Typography>
        </Stack>
      </Box>

      {file ? (
        <List disablePadding aria-live="polite">
          <ListItem
            secondaryAction={
              <IconButton
                edge="end"
                aria-label={t('projects.removeFile')}
                onClick={onRemove}
                disabled={disabled}
              >
                <IconifyIcon
                  icon="material-symbols:close-small-rounded"
                  fontSize={20}
                  sx={{ color: 'text.primary' }}
                />
              </IconButton>
            }
            sx={(theme) => ({
              pl: 1,
              gap: 1.25,
              bgcolor: theme.vars.palette.background.elevation1,
              borderRadius: 0,
              ...theme.applyStyles('dark', { bgcolor: theme.vars.palette.background.elevation2 }),
            })}
          >
            <ListItemAvatar sx={{ minWidth: 36 }}>
              <Avatar
                variant="rounded"
                sx={{ width: 36, height: 36, borderRadius: 0, bgcolor: 'background.elevation2' }}
              >
                <IconifyIcon
                  icon={getFileIcon(getFileExtension(file.name).toLowerCase())}
                  sx={{ fontSize: 20, color: 'text.secondary' }}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ minWidth: 0 }}
              disableTypography
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    sx={{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      minWidth: 0,
                    }}
                    title={file.name}
                  >
                    {name}
                  </Typography>
                  <Typography variant="body2" color="textPrimary" sx={{ flexShrink: 0 }}>
                    {extension}
                  </Typography>
                </Box>
              }
              secondary={
                <Typography component="p" variant="caption">
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
              }
            />
          </ListItem>
        </List>
      ) : null}
    </Stack>
  );
};

export default ProjectFileUpload;
