import { ReactElement } from 'react';
import { Stack, SxProps } from '@mui/material';
import LanguageMenu from './LanguageMenu';
import NotificationMenu from './NotificationMenu';
import ProfileMenu from './ProfileMenu';
import ThemeToggler from './ThemeToggler';
import KepcoinMenu from './KepcoinMenu';
import DailyTasksMenu from './DailyTasksMenu';

interface AppbarActionItemsProps {
  type?: 'default' | 'slim';
  sx?: SxProps;
  searchComponent?: ReactElement;
  showThemeToggler?: boolean;
}

const AppbarActionItems = ({ type = 'default', sx, searchComponent, showThemeToggler = true }: AppbarActionItemsProps) => {
  return (
    <Stack
      className="action-items"
      direction="row"
      spacing={1}
      sx={{
        alignItems: 'center',
        ml: 'auto',
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
