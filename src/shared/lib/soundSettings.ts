export const SYSTEM_SETTINGS_STORAGE_KEY = 'account-settings-system';
export const SUCCESS_SOUND_STORAGE_KEY = 'success-sound';

export type SuccessSound = 'Default' | 'Rick Roll' | 'No sound';

export const successSoundOptions: Array<{
  value: SuccessSound;
  labelKey: string;
}> = [
  { value: 'Default', labelKey: 'settings.sound.success.default' },
  { value: 'Rick Roll', labelKey: 'settings.sound.success.rickRoll' },
  { value: 'No sound', labelKey: 'settings.sound.success.noSound' },
];

export const isSuccessSound = (value: unknown): value is SuccessSound =>
  value === 'Default' || value === 'Rick Roll' || value === 'No sound';

export const getStoredSuccessSound = (): SuccessSound => {
  try {
    const systemSettings = localStorage.getItem(SYSTEM_SETTINGS_STORAGE_KEY);
    if (systemSettings) {
      const parsed = JSON.parse(systemSettings);
      if (isSuccessSound(parsed?.successSound)) {
        return parsed.successSound;
      }
    }

    const legacySound = localStorage.getItem(SUCCESS_SOUND_STORAGE_KEY);
    return isSuccessSound(legacySound) ? legacySound : 'No sound';
  } catch {
    return 'No sound';
  }
};

export const setStoredSuccessSound = (successSound: SuccessSound) => {
  localStorage.setItem(SUCCESS_SOUND_STORAGE_KEY, successSound);
};

export const playSuccessSound = (successSound: SuccessSound = getStoredSuccessSound()) => {
  if (successSound === 'No sound') return;

  const audio = new Audio(`/assets/audio/success/${encodeURIComponent(successSound)}.mp3`);
  audio.volume = 0.75;
  void audio.play().catch(() => undefined);
};
