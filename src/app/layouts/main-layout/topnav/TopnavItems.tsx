import { MouseEvent, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { Button, Stack } from '@mui/material';
import { MenuItem } from 'app/routes/sitemap';
import clsx from 'clsx';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import { useNavContext } from '../NavProvider';
import NavMenu from './NavMenu';

interface TopnavItemsProps {
  type?: 'default' | 'slim';
}

const TopnavItems = ({ type = 'default' }: TopnavItemsProps) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<null | MenuItem>(null);
  const { pathname } = useLocation();
  const { menuItems } = useNavContext();

  const isMenuActive = useMemo(() => {
    const checkLink = (item: MenuItem): boolean => {
      if (
        pathname === item.path ||
        (item.selectionPrefix && pathname!.startsWith(item.selectionPrefix))
      ) {
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
      {menuItems.map((menu) => {
        const buttonLinkProps =
          !menu.items && menu.path ? ({ component: NavLink, to: menu.path } as const) : {};

        return (
          <Button
            key={menu.pathName}
            id={`navigation-trigger-${menu.pathName}`}
            {...buttonLinkProps}
            variant="text"
            className={clsx({
              active: isMenuActive(menu),
              'kep-nav-item': true,
            })}
            color={isMenuActive(menu) ? 'primary' : 'neutral'}
            size={type === 'slim' ? 'small' : 'large'}
            onClick={(event: MouseEvent<HTMLElement>) => {
              if (!menu.items) return;
              setAnchorEl(event.currentTarget);
              setSelectedMenu(menu);
            }}
            aria-haspopup={menu.items ? 'menu' : undefined}
            aria-expanded={menu.items ? selectedMenu === menu && !!anchorEl : undefined}
            aria-controls={
              selectedMenu === menu && anchorEl ? `navigation-menu-${menu.pathName}` : undefined
            }
            disableRipple
            sx={{ px: 1.25, fontSize: 13, minHeight: 44 }}
          >
            <ScrambleText>{t(menu.key || menu.name)}</ScrambleText>
          </Button>
        );
      })}
      {selectedMenu?.items && (
        <NavMenu
          anchorEl={anchorEl}
          menu={selectedMenu}
          onClose={() => {
            setAnchorEl(null);
            setSelectedMenu(null);
          }}
        />
      )}
    </Stack>
  );
};

export default TopnavItems;
