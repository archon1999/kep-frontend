import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import {
  useAccountTechnologies,
  useUpdateTechnologies,
} from 'modules/account-settings/application';
import type { AccountTechnology } from 'modules/account-settings/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { toast } from 'sonner';
import SettingsSection from './SettingsSection';

const TechnologiesForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, error: loadError, mutate } = useAccountTechnologies(username);
  const { trigger, isMutating } = useUpdateTechnologies();
  const [items, setItems] = useState<AccountTechnology[] | null>(null);

  useEffect(() => {
    if (data) setItems([...data]);
  }, [data]);

  const updateItem = (index: number, key: keyof AccountTechnology, value: string) => {
    setItems((prev) => {
      if (!prev) return prev;
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const addItem = () =>
    setItems((prev) => [...(prev || []), { text: '', devIconClass: '', badgeColor: '#1976d2' }]);

  const removeItem = (index: number) =>
    setItems((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));

  const handleReset = () => setItems(data ? [...data] : null);

  const handleSave = async () => {
    if (!username || !items) return;
    try {
      await trigger({ username, payload: items });
      await mutate();
      toast.success(t('settings.saved'));
    } catch {
      toast.error(t('settings.error'));
    }
  };

  if (loadError)
    return (
      <SettingsSection title={t('settings.technologies')}>
        <Alert
          severity="error"
          action={<Button onClick={() => mutate()}>{t('common.retry')}</Button>}
        >
          {t('common.loadFailed')}
        </Alert>
      </SettingsSection>
    );

  return (
    <SettingsSection
      title={t('settings.technologies')}
      description={t('settings.technologiesSubtitle')}
    >
      {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
      <Stack direction="column" spacing={3}>
        {items?.map((item, index) => (
          <Box
            key={`${item.text}-${index}`}
            sx={{
              py: 2,
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label={t('settings.text')}
                  value={item.text}
                  onChange={(event) => updateItem(index, 'text', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label={t('settings.devIconClass')}
                  value={item.devIconClass}
                  onChange={(event) => updateItem(index, 'devIconClass', event.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <TextField
                  fullWidth
                  type="color"
                  label={t('settings.badgeColor')}
                  value={item.badgeColor}
                  onChange={(event) => updateItem(index, 'badgeColor', event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                  <IconButton
                    color="error"
                    onClick={() => removeItem(index)}
                    aria-label={t('settings.delete')}
                  >
                    <IconifyIcon icon="material-symbols:delete-outline" />
                  </IconButton>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box
                  component="span"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    maxWidth: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    bgcolor: item.badgeColor,
                    color: 'common.white',
                  }}
                >
                  <i className={item.devIconClass} />
                  <Typography variant="body2" noWrap>
                    {item.text || t('settings.preview')}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}

        <Button
          variant="outlined"
          startIcon={<IconifyIcon icon="material-symbols:add-circle-outline" />}
          onClick={addItem}
        >
          {t('settings.addNew')}
        </Button>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            disabled={isLoading || isMutating}
          >
            {t('settings.reset')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={items === null || isLoading || isMutating}
          >
            {t('settings.save')}
          </Button>
        </Stack>
      </Stack>
    </SettingsSection>
  );
};

export default TechnologiesForm;
