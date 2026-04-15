import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
} from '@mui/material';
import {
  SUCCESS_SOUND_STORAGE_KEY,
  SYSTEM_SETTINGS_STORAGE_KEY,
  SuccessSound,
  isSuccessSound,
  playSuccessSound,
  setStoredSuccessSound,
  successSoundOptions,
} from 'shared/lib/soundSettings';
import {
  ThemeToggleEffect,
  applyThemeToggleEffectStyle,
  getStoredThemeToggleEffect,
  isThemeToggleEffect,
  setStoredThemeToggleEffect,
  themeToggleEffectOptions,
} from 'shared/lib/themeToggleEffects';

const getInitialSuccessSound = (value: unknown): SuccessSound => {
  if (isSuccessSound(value)) return value;
  return value === 'none' ? 'No sound' : 'No sound';
};

const SystemSettingsPanel = () => {
  const { t } = useTranslation();
  const [successSound, setSuccessSound] = useState<SuccessSound>('No sound');
  const [themeToggleEffect, setThemeToggleEffect] = useState<ThemeToggleEffect>('polygon');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(SYSTEM_SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSuccessSound(getInitialSuccessSound(parsed.successSound));
        setThemeToggleEffect(
          isThemeToggleEffect(parsed.themeToggleEffect)
            ? parsed.themeToggleEffect
            : getStoredThemeToggleEffect(),
        );
      } catch {
        setSuccessSound('No sound');
        setThemeToggleEffect(getStoredThemeToggleEffect());
      }
    } else {
      const legacySuccessSound = localStorage.getItem(SUCCESS_SOUND_STORAGE_KEY);
      setSuccessSound(getInitialSuccessSound(legacySuccessSound));
      setThemeToggleEffect(getStoredThemeToggleEffect());
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem(
      SYSTEM_SETTINGS_STORAGE_KEY,
      JSON.stringify({ successSound, themeToggleEffect }),
    );
    setStoredSuccessSound(successSound);
    setStoredThemeToggleEffect(themeToggleEffect);
    applyThemeToggleEffectStyle(themeToggleEffect);
  }, [successSound, themeToggleEffect, isLoading]);

  const renderSuccessSoundSelect = () => (
    <FormControl fullWidth>
      <InputLabel>{t('settings.successSound')}</InputLabel>
      <Select
        label={t('settings.successSound')}
        value={successSound}
        onChange={(event) => {
          const selected = event.target.value;
          if (!isSuccessSound(selected)) return;

          setSuccessSound(selected);
          playSuccessSound(selected);
        }}
      >
        {successSoundOptions.map((sound) => (
          <MenuItem key={sound.value} value={sound.value}>
            {t(sound.labelKey)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  const renderThemeToggleEffectSelect = () => (
    <FormControl fullWidth>
      <InputLabel>{t('settings.themeToggleEffect')}</InputLabel>
      <Select
        label={t('settings.themeToggleEffect')}
        value={themeToggleEffect}
        onChange={(event) => {
          const selected = event.target.value;
          if (!isThemeToggleEffect(selected)) return;

          setThemeToggleEffect(selected);
          setStoredThemeToggleEffect(selected);
          applyThemeToggleEffectStyle(selected);
        }}
      >
        {themeToggleEffectOptions.map((effect) => (
          <MenuItem key={effect.value} value={effect.value}>
            {t(effect.labelKey)}
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
          {renderSuccessSoundSelect()}
          {renderThemeToggleEffectSelect()}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SystemSettingsPanel;
