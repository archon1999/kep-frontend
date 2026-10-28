import { useTranslation } from 'react-i18next';
import { Box, InputBase, MenuItem, Stack, Typography } from '@mui/material';
import {
  BLOG_TRANSLATION_LOCALES,
  hasTranslationContent,
} from 'modules/blog/application/blog-editor-state';
import { BlogTranslationLocale, BlogTranslations } from 'modules/blog/domain/entities/blog.entity';
import StyledTextField from 'shared/components/styled/StyledTextField';
import { cssVarRgba } from 'shared/lib/utils';

interface TranslationLocaleSelectProps {
  activeLocale: BlogTranslationLocale;
  onChange: (locale: BlogTranslationLocale) => void;
  translations: BlogTranslations;
}

const TranslationLocaleSelect = ({
  activeLocale,
  onChange,
  translations,
}: TranslationLocaleSelectProps) => {
  const { t } = useTranslation();

  return (
    <Stack spacing={1}>
      <StyledTextField
        select
        label={t('blog.editor.translationLabel')}
        size="small"
        value={activeLocale}
        onChange={(event) => onChange(event.target.value as BlogTranslationLocale)}
      >
        {BLOG_TRANSLATION_LOCALES.map((locale) => (
          <MenuItem key={locale} value={locale}>
            <Stack direction="row" spacing={1} alignItems="center">
              <Box
                sx={(theme) => ({
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  bgcolor: hasTranslationContent(translations[locale])
                    ? theme.vars.palette.success.main
                    : cssVarRgba(theme.vars.palette.text.primaryChannel, 0.22),
                })}
              />
              <span>{t(`blog.editor.fields.languageOptions.${locale}`)}</span>
            </Stack>
          </MenuItem>
        ))}
      </StyledTextField>
    </Stack>
  );
};

interface EditorialFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  maxLength: number;
  multiline?: boolean;
  minRows?: number;
  error?: string;
}

const EditorialField = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  multiline = false,
  minRows = 1,
  error,
}: EditorialFieldProps) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2" fontWeight={700}>
      {label}
    </Typography>

    <Box
      sx={(theme) => ({
        borderBottom: `1px solid ${cssVarRgba(theme.vars.palette.text.primaryChannel, 0.12)}`,
        pb: 1.25,
        transition: 'border-color 0.2s ease',
        '&:focus-within': {
          borderColor: theme.vars.palette.primary.main,
        },
      })}
    >
      <InputBase
        fullWidth
        multiline
        minRows={minRows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputProps={{ maxLength, 'aria-label': label }}
        sx={(theme) => ({
          alignItems: 'flex-start',
          color: 'text.primary',
          caretColor: theme.vars.palette.primary.main,
          '& input, & textarea': {
            p: 0,
            fontWeight: multiline ? 400 : 500,
            fontFamily: multiline ? 'inherit' : 'var(--kep-display-font)',
            fontSize: multiline ? { xs: 17, md: 19 } : { xs: 28, md: 36 },
            lineHeight: multiline ? 1.35 : 1.05,
            letterSpacing: multiline ? '-0.01em' : '-0.03em',
            '&::placeholder': {
              color: cssVarRgba(theme.vars.palette.text.primaryChannel, 0.32),
              opacity: 1,
            },
            '&::selection': {
              backgroundColor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.24),
            },
          },
          '& textarea': {
            resize: 'none',
          },
        })}
      />
    </Box>

    {error ? (
      <Typography variant="caption" color="error.main">
        {error}
      </Typography>
    ) : null}
  </Stack>
);

export { TranslationLocaleSelect, EditorialField };
