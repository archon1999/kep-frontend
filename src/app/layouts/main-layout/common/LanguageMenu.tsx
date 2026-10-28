import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Typography,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import { SupportedLanguage, languages } from 'app/locales/languages';
import { useSettingsContext } from 'app/providers/SettingsProvider';
import { SET_LOCALE } from 'app/reducers/SettingsReducer';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import PatternArtwork from 'shared/components/common/PatternArtwork';

interface LanguageMenuProps {
  type?: 'default' | 'slim';
}

const LanguageMenu = ({ type = 'default' }: LanguageMenuProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    config: { locale },
    configDispatch,
  } = useSettingsContext();
  const open = Boolean(anchorEl);

  const selectedLanguage = useMemo(() => {
    return languages.find((lang) => lang.locale === locale) || languages[0];
  }, [locale]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (language: SupportedLanguage) => {
    configDispatch({
      type: SET_LOCALE,
      payload: language.locale,
    });
  };

  return (
    <>
      <Button
        aria-label={t('common.languageMenu.title')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? 'language-menu' : undefined}
        title={t('common.languageMenu.title')}
        color="neutral"
        size={type === 'slim' ? 'small' : 'medium'}
        variant="text"
        shape="circle"
        onClick={handleClick}
      >
        <IconifyIcon icon={selectedLanguage.icon} sx={{ fontSize: type === 'slim' ? 20 : 24 }} />
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: { sx: { minWidth: 260, maxWidth: 'calc(100vw - 32px)' } },
          list: { sx: { py: 0 } },
        }}
      >
        <ListSubheader
          disableSticky
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2.5,
            py: 1,
            bgcolor: 'background.default',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography component="span" variant="subtitle1">
            {t('common.languageMenu.title')}
          </Typography>
          <PatternArtwork
            kind="language"
            sx={{ width: 96, '& .kep-pattern-signal': { animation: 'none', opacity: 1 } }}
          />
        </ListSubheader>
        {languages.map((language) => (
          <MenuItem
            key={language.shortLabel}
            onClick={() => {
              handleItemClick(language);
            }}
            selected={locale === language.locale}
            sx={{ minWidth: 200 }}
          >
            <ListItemIcon>
              <IconifyIcon icon={language.icon} sx={{ fontSize: 24 }} />
            </ListItemIcon>
            <ListItemText
              primary={language.label}
              slotProps={{
                primary: { component: 'span', sx: { fontSize: 14 } },
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                color: 'text.secondary',
                fontWeight: 'normal',
              }}
            >
              {language.currencySymbol}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageMenu;
