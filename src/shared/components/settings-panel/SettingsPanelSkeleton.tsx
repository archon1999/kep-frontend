import { useTranslation } from 'react-i18next';
import { Box, Button, Skeleton, Slider, Stack, Typography } from '@mui/material';
import { backgroundPatterns, cardBackgrounds, cardStyles, fontFamilies } from 'app/config';
import { useSettingsPanelContext } from 'app/providers/SettingsPanelProvider';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { themePresets } from 'app/theme/presets';
import { COLOR_GROUPS } from 'app/theme/primaryColorOverride';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import type { SettingsPanelTab } from './SettingsPanelHeader';
import Section from './SettingsPanelSection';
import ThemeModeToggleTab from './ThemeModeToggleTab';

const OptionsSkeleton = ({ count }: { count: number }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}>
    {Array.from({ length: count }, (_, index) => (
      <Box key={index} sx={{ p: 1, border: 1, borderColor: 'divider' }}>
        <Skeleton variant="rectangular" height={64} sx={{ mb: 1.25 }} />
        <Typography variant="subtitle2" sx={{ lineHeight: 1.4, textAlign: 'center' }}>
          <Skeleton width="60%" sx={{ mx: 'auto' }} />
        </Typography>
      </Box>
    ))}
  </Box>
);

const SettingsPanelSkeleton = ({ tab }: { tab: SettingsPanelTab }) => {
  const { t } = useTranslation();
  const {
    config: { navigationMenuType, fontSize },
  } = useSettingsContext();
  const {
    settingsPanelConfig: {
      disableNavigationMenuSection,
      disableSidenavShapeSection,
      disableTopShapeSection,
      disableNavColorSection,
    },
  } = useSettingsPanelContext();
  const primaryColorCount = new Set(COLOR_GROUPS.map((group) => group.main)).size;
  return (
    <>
      <Box
        role="tabpanel"
        id={`customize-panel-${tab}`}
        aria-labelledby={`customize-tab-${tab}`}
        aria-busy="true"
        sx={{ flex: 1, minHeight: 0, overflowY: 'auto', scrollbarGutter: 'stable' }}
      >
        {tab === 'theme' && (
          <>
            <Section title={t('settings.customizer.sections.theme')}>
              <Stack gap={2}>
                <ThemeModeToggleTab />
                <Box
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}
                >
                  {themePresets.map((preset) => (
                    <Stack
                      key={preset}
                      direction="row"
                      gap={1}
                      alignItems="center"
                      sx={{ height: 56, px: 1.25, border: 1, borderColor: 'divider' }}
                    >
                      <Skeleton variant="rectangular" width={28} height={28} />
                      <Skeleton width="58%" />
                    </Stack>
                  ))}
                </Box>
                <Stack gap={2} sx={{ mt: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    {t('settings.customizer.labels.primaryColor')}
                  </Typography>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: `repeat(${primaryColorCount}, minmax(0, 1fr))`,
                      gap: 0.75,
                    }}
                  >
                    {Array.from({ length: primaryColorCount }, (_, i) => (
                      <Skeleton key={i} variant="rectangular" height={28} />
                    ))}
                  </Box>
                </Stack>
              </Stack>
            </Section>
            <Section title={t('settings.customizer.sections.backgroundPattern')}>
              <OptionsSkeleton count={backgroundPatterns.length} />
            </Section>
            <Section title={t('settings.customizer.sections.cardStyle')}>
              <OptionsSkeleton count={cardStyles.length} />
            </Section>
            <Section title={t('settings.customizer.sections.cardBackground')}>
              <OptionsSkeleton count={cardBackgrounds.length} />
            </Section>
          </>
        )}
        {tab === 'font' && (
          <>
            <Section title={t('settings.customizer.sections.font')}>
              <Stack gap={3}>
                <Box
                  sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1 }}
                >
                  {fontFamilies.map((font) => (
                    <Stack
                      key={font}
                      gap={1}
                      justifyContent="center"
                      sx={{ minHeight: 100, px: 2, py: 1.25, border: 1, borderColor: 'divider' }}
                    >
                      <Typography component="span" sx={{ fontSize: 28, lineHeight: 1.2 }}>
                        <Skeleton width={40} />
                      </Typography>
                      <Typography variant="body2">
                        <Skeleton width="70%" />
                      </Typography>
                    </Stack>
                  ))}
                </Box>
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight={600}
                      sx={{ minWidth: 100, mb: 1 }}
                    >
                      {t('settings.customizer.labels.fontSize')}
                    </Typography>
                    <Typography variant="pixel" sx={{ fontSize: 18 }}>
                      {fontSize}
                      <Typography
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 0.5 }}
                      >
                        px
                      </Typography>
                    </Typography>
                  </Stack>
                  <Slider
                    disabled
                    value={fontSize}
                    min={12}
                    max={20}
                    step={1}
                    marks
                    sx={{ width: 'calc(100% - 16px)', mx: 1 }}
                  />
                </Box>
              </Stack>
            </Section>
            <Section title={t('settings.customizer.sections.visionMode')}>
              <Stack gap={0.5}>
                {['normal', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'].map(
                  (mode) => (
                    <Stack
                      key={mode}
                      direction="row"
                      alignItems="flex-start"
                      sx={{ p: 1.25, border: 1, borderColor: 'divider' }}
                    >
                      <Skeleton variant="circular" width={28} height={28} sx={{ flexShrink: 0 }} />
                      <Stack sx={{ flex: 1, minWidth: 0, ml: 1 }}>
                        <Typography variant="subtitle2">
                          {t(`settings.customizer.visionModes.${mode}.label`)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t(`settings.customizer.visionModes.${mode}.description`)}
                        </Typography>
                      </Stack>
                    </Stack>
                  ),
                )}
              </Stack>
            </Section>
          </>
        )}
        {tab === 'layout' && (
          <>
            <Section
              title={t('settings.customizer.sections.navigationMenu')}
              disable={disableNavigationMenuSection}
            >
              <OptionsSkeleton count={2} />
            </Section>
            {navigationMenuType !== 'topnav' && (
              <Section
                title={t('settings.customizer.sections.sidenavShape')}
                disable={disableSidenavShapeSection}
              >
                <OptionsSkeleton count={2} />
              </Section>
            )}
            {navigationMenuType !== 'sidenav' && (
              <Section
                title={t('settings.customizer.sections.topnavShape')}
                disable={disableTopShapeSection}
              >
                <OptionsSkeleton count={3} />
              </Section>
            )}
            <Section
              title={t('settings.customizer.sections.navColor')}
              disable={disableNavColorSection}
            >
              <Stack direction="row" gap={1}>
                {Array.from({ length: 3 }, (_, i) => (
                  <Stack
                    key={i}
                    flex={1}
                    gap={1}
                    alignItems="center"
                    sx={{ p: 1.5, border: 1, borderColor: 'divider' }}
                  >
                    <Skeleton variant="rectangular" width={64} height={28} />
                    <Typography variant="body2">
                      <Skeleton width={60} />
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Section>
          </>
        )}
      </Box>
      <Box
        sx={{
          px: 3,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          flexShrink: 0,
          pb: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <Button
          size="small"
          color="neutral"
          variant="text"
          disabled
          startIcon={<IconifyIcon icon="material-symbols:restart-alt-rounded" />}
        >
          {t('settings.customizer.reset')}
        </Button>
      </Box>
    </>
  );
};
export default SettingsPanelSkeleton;
