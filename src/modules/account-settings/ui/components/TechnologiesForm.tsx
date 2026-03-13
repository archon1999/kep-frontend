import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import type { AccountTechnology } from '../../domain/entities/account-settings.entity';
import { useAccountTechnologies } from '../../application/queries';
import { useUpdateTechnologies } from '../../application/mutations';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const TechnologiesForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, mutate } = useAccountTechnologies(username);
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

  const addItem = () => setItems((prev) => ([...(prev || []), { text: '', devIconClass: '', badgeColor: '#1976d2' }]));

  const removeItem = (index: number) => setItems((prev) => (prev ? prev.filter((_, i) => i !== index) : prev));

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

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.technologies')} subheader={t('settings.technologiesSubtitle')} />
      <CardContent>
        {isLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={3}>
          {items?.map((item, index) => (
            <Box
              key={`${item.text}-${index}`}
              sx={{
                p: 2,
                borderRadius: 2,
                border: (theme) => `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
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
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Box
                      component="span"
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 999,
                        bgcolor: item.badgeColor,
                        color: 'common.white',
                        width: '100%',
                        justifyContent: 'center',
                      }}
                    >
                      <i className={item.devIconClass} />
                      <Typography variant="body2">{item.text || t('settings.preview')}</Typography>
                    </Box>
                    <IconButton color="error" onClick={() => removeItem(index)} aria-label={t('settings.delete')}>
                      <IconifyIcon icon="material-symbols:delete-outline" />
                    </IconButton>
                  </Stack>
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
            <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isLoading}>
              {t('settings.reset')}
            </Button>
            <Button variant="contained" onClick={handleSave} disabled={!items?.length}>
              {t('settings.save')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TechnologiesForm;
