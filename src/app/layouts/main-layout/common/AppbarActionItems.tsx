import { ReactElement } from 'react';
import { Stack, SxProps } from '@mui/material';
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
        ...sx,
      }}
    >
      {searchComponent}
      <LanguageMenu type={type} />
      {showThemeToggler && <ThemeToggler type={type} />}
      <NotificationMenu type={type} />
      <KepcoinMenu type={type} />
      <DailyTasksMenu type={type} />
      <ProfileMenu type={type} />
    </Stack>
  );
};

export default AppbarActionItems;
