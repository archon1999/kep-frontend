import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { useAuth } from 'app/providers/AuthProvider';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import { ScrambleText } from 'shared/components/motion/InteractionEffects';

const Footer = () => {
  const gradientId = `footer-gradient-${useId().replace(/:/g, '')}`;
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { currentUser, isAuthLoading } = useAuth();
  const home = pathname === resources.Home && !currentUser && !isAuthLoading;
  const columns = [
    {
      key: 'practice',
      links: [
        { to: resources.Problems, key: 'platform.problems.title' },
        { to: resources.StudyPlans, key: 'platform.plans.title' },
        { to: resources.Projects, key: 'platform.projects.title' },
      ],
    },
    {
      key: 'compete',
      links: [
        { to: resources.Contests, key: 'platform.contests.title' },
        { to: resources.Duels, key: 'platform.duels.title' },
        { to: resources.Arena, key: 'formats.compete.1.title' },
      ],
    },
    {
      key: 'community',
      links: [
        { to: resources.Users, key: 'allUsers' },
        { to: resources.Blog, key: 'footer.blog' },
        { to: resources.Updates, key: 'footer.updates' },
      ],
    },
  ];
  return (
    <>
      <footer className={`kep-footer ${home ? 'kep-footer-home' : ''}`}>
        <div className="kep-footer-content">
          <div className="kep-footer-brand">
            <Logo />
            <p>{t('homePage.landing.footer.description')}</p>
            <div className="kep-footer-brand-bottom">
              <small>© {new Date().getFullYear()} KEP.uz</small>
              {home && (
                <div className="kep-footer-socials">
                  <a
                    href="https://github.com/archon1999/kep-frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <IconifyIcon icon="simple-icons:github" />
                  </a>
                  <a
                    href="https://t.me/KEPuzChannel"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                    title="Telegram"
                  >
                    <IconifyIcon icon="simple-icons:telegram" />
                  </a>
                </div>
              )}
            </div>
          </div>
          {home ? (
            columns.map((column) => (
              <nav key={column.key} aria-label={t(`homePage.landing.footer.${column.key}`)}>
                <h2>{t(`homePage.landing.footer.${column.key}`)}</h2>
                {column.links.map((link) => (
                  <Link key={link.to} to={link.to}>
                    <span className="kep-footer-link-star kep-pixel-cross" aria-hidden="true" />
                    <ScrambleText>{t(`homePage.landing.${link.key}`)}</ScrambleText>
                  </Link>
                ))}
              </nav>
            ))
          ) : (
            <div className="kep-footer-compact-links">
              <Link to={resources.Problems}>{t('homePage.landing.catalog')}</Link>
              <Link to={resources.Contests}>{t('homePage.landing.platform.contests.title')}</Link>
              <Link to={resources.Blog}>{t('homePage.landing.footer.blog')}</Link>
            </div>
          )}
        </div>
        {home && (
          <div className="kep-footer-signature" aria-hidden="true">
            <svg className="kep-footer-wordmark" viewBox="0 0 1180 300" focusable="false">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop className="kep-footer-gradient-start" offset="0%" />
                  <stop className="kep-footer-gradient-mid" offset="48%" />
                  <stop className="kep-footer-gradient-end" offset="100%" />
                </linearGradient>
              </defs>
              <text
                x="0"
                y="290"
                textLength="1180"
                lengthAdjust="spacingAndGlyphs"
                fill={`url(#${gradientId})`}
              >
                KE<tspan className="kep-footer-pixel-letter">P</tspan>.uz
              </text>
            </svg>
          </div>
        )}
      </footer>
      {home && <div className="kep-footer-dot-field" aria-hidden="true" />}
    </>
  );
};
export default Footer;
