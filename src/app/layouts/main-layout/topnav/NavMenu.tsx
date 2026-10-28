import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { ListSubheader, Menu, MenuItem, styled } from '@mui/material';
import { MenuItem as NavigationItem } from 'app/routes/sitemap';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import NavMenuIllustration from './NavMenuIllustration';
import { navMenuStyles } from './nav-menu.styles';

const NavigationMenu = styled(Menu)(() => navMenuStyles);

interface NavMenuProps {
  anchorEl: HTMLElement | null;
  menu: NavigationItem;
  onClose: () => void;
}

const NavMenu = ({ anchorEl, menu, onClose }: NavMenuProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const rich = ['practice', 'battles', 'competitions'].includes(menu.pathName);
  return (
    <NavigationMenu
      id={`navigation-menu-${menu.pathName}`}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      disableScrollLock
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{
        paper: {
          variant: 'framed',
          className: `kep-nav-menu kep-nav-menu--${menu.pathName}${rich ? ' kep-nav-menu-rich' : ''}`,
        },
        list: { 'aria-labelledby': `navigation-trigger-${menu.pathName}` },
      }}
    >
      <ListSubheader className="kep-nav-menu-heading" disableSticky role="presentation">
        <div className="kep-nav-menu-intro">
          <span className="kep-nav-menu-kicker">
            <span className="kep-pixel-cross" aria-hidden="true" />
            {t(menu.key || menu.name)}
          </span>
          {rich && <p>{t(`menu.descriptions.${menu.pathName}`)}</p>}
        </div>
        <NavMenuIllustration kind={menu.pathName} />
      </ListSubheader>
      {menu.items?.map((item) => {
        if (!item.path) return null;
        const descriptionId = `navigation-description-${item.pathName}`;
        const selected =
          pathname === item.path ||
          Boolean(item.selectionPrefix && pathname.startsWith(item.selectionPrefix));
        return (
          <MenuItem
            key={item.pathName}
            component={NavLink}
            to={item.path}
            aria-label={t(item.key || item.name)}
            aria-describedby={rich ? descriptionId : undefined}
            selected={selected}
            onClick={onClose}
            className="kep-nav-menu-item"
          >
            {rich && item.icon && (
              <span className="kep-nav-menu-icon" aria-hidden="true">
                <IconifyIcon icon={item.icon} />
              </span>
            )}
            <span className="kep-nav-menu-copy">
              <ScrambleText>{t(item.key || item.name)}</ScrambleText>
              {rich && (
                <span className="kep-nav-menu-description" id={descriptionId}>
                  {t(`menu.descriptions.${item.pathName}`)}
                </span>
              )}
            </span>
          </MenuItem>
        );
      })}
    </NavigationMenu>
  );
};

export default NavMenu;
