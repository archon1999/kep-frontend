import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, FormControl, InputLabel, LinearProgress, MenuItem, Select, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const sounds = [
  { value: 'none', labelKey: 'settings.sound.none', frequency: null },
  { value: 'soft', labelKey: 'settings.sound.soft', frequency: 500 },
  { value: 'bright', labelKey: 'settings.sound.bright', frequency: 900 },
];

const playTone = (frequency: number) => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.connect(ctx.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
    ctx.close();
  }, 160);
};

const STORAGE_KEY = 'account-settings-system';

const SystemSettingsPanel = () => {
  const { t } = useTranslation();
  const [successSound, setSuccessSound] = useState('none');
  const [homeSound, setHomeSound] = useState('none');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSuccessSound(parsed.successSound || 'none');
        setHomeSound(parsed.homeSound || 'none');
      } catch {
        setSuccessSound('none');
        setHomeSound('none');
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ successSound, homeSound }));
  }, [successSound, homeSound, isLoading]);

  const renderSelect = (
    label: string,
    value: string,
    onChange: (value: string) => void,
  ) => (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        onChange={(event) => {
          const selected = event.target.value;
          onChange(selected);
          const selectedSound = sounds.find((sound) => sound.value === selected);
          if (selectedSound?.frequency) {
            playTone(selectedSound.frequency);
          }
        }}
      >
        {sounds.map((sound) => (
          <MenuItem key={sound.value} value={sound.value}>
            {t(sound.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.system')} />
      <CardContent>
        {isLoading ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={3}>
          {renderSelect(t('settings.successSound'), successSound, setSuccessSound)}
          {renderSelect(t('settings.homeSound'), homeSound, setHomeSound)}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SystemSettingsPanel;
