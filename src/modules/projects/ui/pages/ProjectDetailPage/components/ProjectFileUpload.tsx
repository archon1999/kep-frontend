import { useRef } from 'react';
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
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const droppedFile = event.dataTransfer.files[0];
          if (!disabled && droppedFile) onSelect(droppedFile);
        }}
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: 'background.elevation2',
          minHeight: { xs: 100, sm: 60 },
          borderRadius: 2,
          borderWidth: 1,
          borderColor: 'divider',
          borderStyle: 'dashed',
          cursor: disabled ? 'default' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          transition: ({ transitions }) =>
            transitions.create(['background-color'], {
              duration: transitions.duration.enteringScreen,
              easing: transitions.easing.easeInOut,
            }),
          opacity: disabled ? 0.6 : 1,
          '&:hover': disabled ? undefined : { bgcolor: 'background.elevation3' },
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
          direction={{ xs: 'column', sm: 'row' }}
          flexWrap="wrap"
          sx={{ justifyContent: 'center', alignItems: 'center', gap: 1 }}
        >
          <IconifyIcon
            icon="material-symbols:upload-file-outline"
            sx={{ fontSize: { xs: 40, sm: 20 }, color: 'text.primary' }}
          />
          <Typography variant="caption" component="p" sx={{ alignSelf: 'center' }}>
            {t('projects.dropFilesHere')}{' '}
            <Box component="span" sx={{ color: 'text.disabled', mx: 1 }}>
              {t('projects.or')}
            </Box>
            <Box component="span" sx={{ color: 'primary.main' }}>
              {t('projects.browseFromDevice')}
            </Box>
          </Typography>
        </Stack>
      </Box>

      {file ? (
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
              gap: 2,
              bgcolor: theme.vars.palette.background.elevation1,
              borderRadius: 2,
              ...theme.applyStyles('dark', { bgcolor: theme.vars.palette.background.elevation2 }),
            })}
          >
            <ListItemAvatar>
              <Avatar
                variant="rounded"
                sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'background.elevation2' }}
              >
                <IconifyIcon
                  icon={getFileIcon(getFileExtension(file.name).toLowerCase())}
                  sx={{ fontSize: 20, color: 'text.secondary' }}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
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
