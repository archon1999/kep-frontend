import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { Button, Stack } from '@mui/material';
import sitemap, { MenuItem } from 'app/routes/sitemap';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import NavitemPopover from './NavItemPopover';

interface TopnavItemsProps {
  type?: 'default' | 'slim';
}

const TopnavItems = ({ type = 'default' }: TopnavItemsProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<null | MenuItem>(null);
  const { pathname } = useLocation();

  const isMenuActive = useMemo(() => {
    const checkLink = (item: MenuItem): boolean => {
      if (pathname === item.path || (item.selectionPrefix && pathname!.startsWith(item.selectionPrefix))) {
        return true;
      }
      return item.items ? item.items.some(checkLink) : false;
    };

    return checkLink;
  }, [pathname]);

  useEffect(() => {
    setAnchorEl(null);
    setSelectedMenu(null);
  }, [pathname]);

  return (
    <Stack
      sx={{
        alignItems: 'center',
        gap: '2px',
      }}
      className="nav-items"
      direction="row"
    >
      {sitemap.map((menu) => {
        const buttonLinkProps =
          !menu.items && menu.path
            ? ({ component: NavLink, to: menu.path } as const)
            : {};

        return (
          <Button
            key={menu.pathName}
            {...buttonLinkProps}
          variant="text"
          className={clsx({
            active: isMenuActive(menu),
          })}
          color={isMenuActive(menu) ? 'primary' : 'neutral'}
          size={type === 'slim' ? 'small' : 'large'}
          endIcon={menu.items ? <IconifyIcon icon="material-symbols:expand-more-rounded" /> : undefined}
          onClick={(event: MouseEvent<HTMLElement>) => {
            if (!menu.items) return;
            setAnchorEl(event.currentTarget);
            setSelectedMenu(menu);
          }}
          sx={{ px: 2, fontSize: 14 }}
        >
          {t(menu.key || menu.name)}
        </Button>
        );
      })}
      {selectedMenu?.items && (
        <NavitemPopover
          handleClose={() => {
            setAnchorEl(null);
            setSelectedMenu(null);
          }}
          anchorEl={anchorEl}
          open={!!anchorEl && !!selectedMenu}
          items={selectedMenu.items}
          level={0}
        />
      )}
    </Stack>
  );
};

export default TopnavItems;
