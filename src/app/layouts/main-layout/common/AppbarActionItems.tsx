import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button, Stack, SxProps } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import { useLoginHref } from 'shared/lib/authRedirect';
import DailyTasksMenu from './DailyTasksMenu';
import KepcoinMenu from './KepcoinMenu';
import LanguageMenu from './LanguageMenu';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import ThemeToggler from './ThemeToggler';

interface AppbarActionItemsProps {
  type?: 'default' | 'slim';
  sx?: SxProps;
  searchComponent?: ReactElement;
  showThemeToggler?: boolean;
}

const AppbarActionItems = ({
  type = 'default',
  sx,
  searchComponent,
  showThemeToggler = true,
}: AppbarActionItemsProps) => {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const loginHref = useLoginHref();
  return (
    <Stack
      className="action-items"
      direction="row"
      spacing={{ xs: 0.5, sm: 1 }}
      sx={{
        alignItems: 'center',
        ml: 'auto',
        minWidth: 0,
        flexShrink: 0,
        '@media (max-width: 599px)': {
          '& .kepcoin-menu-trigger, & .daily-tasks-menu-trigger': {
            width: 36,
            minWidth: 36,
            px: 0,
            '& .MuiTypography-root': { display: 'none' },
          },
        },
        ...sx,
      }}
    >
      {searchComponent}
      <LanguageMenu type={type} />
      {showThemeToggler && <ThemeToggler type={type} />}
      {currentUser ? (
        <>
          <NotificationMenu type={type} />
          <KepcoinMenu type={type} />
          <DailyTasksMenu type={type} />
          <ProfileMenu type={type} />
        </>
      ) : (
        <Button
          component={Link}
          to={loginHref}
          variant="contained"
          color="neutral"
          className="kep-header-login"
          sx={{ minWidth: 0, px: { xs: 1.5, sm: 2.5 }, whiteSpace: 'nowrap', ml: 1 }}
        >
          <ScrambleText>{t('homePage.greeting.loginCta')}</ScrambleText>
        </Button>
      )}
    </Stack>
  );
};

export default AppbarActionItems;
