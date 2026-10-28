import { MouseEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button, Drawer, IconButton, styled } from '@mui/material';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';
import { useLoginHref } from 'shared/lib/authRedirect';
import LanguageMenu from '../common/LanguageMenu';
import ThemeToggler from '../common/ThemeToggler';
import { landingHeaderStyles } from './landing-header.styles';

const LandingMenuDrawer = styled(Drawer)(() => landingHeaderStyles);
const sections = [
  { id: 'platform', key: 'platform' },
  { id: 'how-it-works', key: 'howItWorks' },
  { id: 'community', key: 'community' },
  { id: 'faq', key: 'faq' },
] as const;

const LandingHeader = () => {
  const { t } = useTranslation();
  const loginHref = useLoginHref();
  const [open, setOpen] = useState(false);
  const handleLogoClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return;
    setOpen(false);
    document
      .querySelector('#main-content .simplebar-content-wrapper')
      ?.scrollTo({ top: 0, behavior: 'instant' });
  };
  const links = (mobile = false) =>
    sections.map(({ id, key }) => (
      <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="kep-landing-nav-link">
        <span className="kep-pixel-cross" aria-hidden="true" />
        <ScrambleText>{t(`homePage.landingHeader.${key}`)}</ScrambleText>
        {mobile && (
          <span className="kep-landing-menu-arrow" aria-hidden="true">
            ↗
          </span>
        )}
      </a>
    ));
  return (
    <>
      <header className="kep-landing-header">
        <div className="kep-landing-header-inner">
          <div className="kep-landing-brand">
            <Logo onLinkClick={handleLogoClick} />
          </div>
          <nav className="kep-landing-nav" aria-label={t('homePage.landingHeader.navigation')}>
            {links()}
          </nav>
          <div className="kep-landing-header-actions">
            <LanguageMenu type="slim" />
            <ThemeToggler type="slim" />
            <Button
              component={Link}
              to={loginHref}
              className="kep-header-login kep-landing-login"
              variant="contained"
              color="neutral"
              endIcon={<span aria-hidden="true">↗</span>}
            >
              <ScrambleText>{t('homePage.greeting.loginCta')}</ScrambleText>
            </Button>
            <IconButton
              className="kep-landing-menu-toggle"
              aria-label={t('homePage.landing.footer.menu')}
              aria-expanded={open}
              aria-controls={open ? 'kep-landing-menu' : undefined}
              onClick={() => setOpen(true)}
            >
              <IconifyIcon icon="material-symbols:menu-rounded" />
            </IconButton>
          </div>
        </div>
      </header>
      <LandingMenuDrawer
        anchor="top"
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            className: 'kep-landing-menu-paper',
            role: 'dialog',
            'aria-label': t('homePage.landingHeader.navigation'),
          },
        }}
      >
        <div className="kep-landing-menu-top">
          <Logo onLinkClick={handleLogoClick} />
          <IconButton
            aria-label={t('homePage.landingHeader.closeMenu')}
            onClick={() => setOpen(false)}
          >
            <IconifyIcon icon="material-symbols:close-rounded" />
          </IconButton>
        </div>
        <nav id="kep-landing-menu" aria-label={t('homePage.landingHeader.navigation')}>
          {links(true)}
        </nav>
        <Button
          component={Link}
          to={loginHref}
          onClick={() => setOpen(false)}
          className="kep-cta"
          variant="contained"
          endIcon={<span aria-hidden="true">↗</span>}
        >
          {t('homePage.greeting.loginCta')}
        </Button>
      </LandingMenuDrawer>
    </>
  );
};
export default LandingHeader;
