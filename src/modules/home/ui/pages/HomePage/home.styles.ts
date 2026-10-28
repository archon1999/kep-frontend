import type { CSSObject } from '@mui/material/styles';

/** Page composition; typography and controls are supplied by the shared theme. */
export const homeStyles: CSSObject[] = [
  {
    '&.kep-home, & .kep-home': {
      color: 'var(--kep-text)',
      background: 'var(--kep-bg)',
      overflow: 'clip',
      fontFamily: 'var(--kep-font-family)',
      '--kep-home-width': 'var(--kep-page-width)',
    },
  },
  {
    '&.kep-home-loading, & .kep-home-loading': {
      display: 'grid',
      gap: '20px',
      maxWidth: '1440px',
      margin: '0 auto',
      padding: '40px 24px',
    },
  },
  {
    '&.kep-home h1:not(.MuiTypography-root), & .kep-home h1:not(.MuiTypography-root), &.kep-home h2:not(.MuiTypography-root), & .kep-home h2:not(.MuiTypography-root), &.kep-home h3:not(.MuiTypography-root), & .kep-home h3:not(.MuiTypography-root), &.kep-home p:not(.MuiTypography-root), & .kep-home p:not(.MuiTypography-root)':
      {
        margin: '0',
        fontFamily: 'var(--kep-display-font)',
      },
  },
  {
    '&.kep-home h1:not(.MuiTypography-root), & .kep-home h1:not(.MuiTypography-root), &.kep-home h2:not(.MuiTypography-root), & .kep-home h2:not(.MuiTypography-root)':
      {
        fontFamily: 'var(--kep-display-font)',
        fontWeight: '500',
        fontVariant: 'normal',
        fontVariantLigatures: 'normal',
        letterSpacing: 'normal',
        textWrap: 'balance',
      },
  },
  {
    '&.kep-home h3:not(.MuiTypography-root), & .kep-home h3:not(.MuiTypography-root)': {
      fontSize: '20px',
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '-0.02em',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.kep-home p:not(.MuiTypography-root), & .kep-home p:not(.MuiTypography-root)': {
      fontFamily: 'var(--kep-reading-font)',
      fontSize: '16px',
      lineHeight: '1.65',
      color: 'var(--kep-muted)',
      textWrap: 'pretty',
    },
  },
  {
    '&.kep-home a, & .kep-home a': {
      color: 'inherit',
      textDecoration: 'none',
    },
  },
  {
    '&.kep-home button, & .kep-home button, &.kep-home a, & .kep-home a': {
      touchAction: 'manipulation',
    },
  },
  {
    "&.kep-home a:focus-visible, & .kep-home a:focus-visible, &.kep-home button:focus-visible, & .kep-home button:focus-visible, &.kep-home [tabindex='0']:focus-visible, & .kep-home [tabindex='0']:focus-visible":
      {
        outline: '2px solid var(--aurora-palette-primary-main)',
        outlineOffset: '5px',
      },
  },
  {
    '&.kep-home .MuiButton-containedPrimary, & .kep-home .MuiButton-containedPrimary': {
      color: 'var(--kep-accent-ink)',
    },
  },
  {
    '&.kep-section, & .kep-section': {
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-home-width)',
      margin: '0 auto',
      padding: '56px var(--kep-content-inset)',
      scrollMarginTop: '96px',
    },
  },
  {
    '&.kep-landing > .kep-section, & .kep-landing > .kep-section, &.kep-landing > .kep-hero, & .kep-landing > .kep-hero, &.kep-landing > .kep-trust-strip, & .kep-landing > .kep-trust-strip':
      {
        borderBottom: '1px solid var(--kep-line)',
      },
  },
  {
    '&.kep-section-heading, & .kep-section-heading': {
      textAlign: 'left',
      maxWidth: '760px',
      margin: '0 0 32px',
    },
  },
  {
    '&.kep-eyebrow, & .kep-eyebrow': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      fontFamily: 'var(--kep-font-family)',
      fontSize: '12px',
      lineHeight: '20px',
      letterSpacing: '0.07em',
      textTransform: 'uppercase',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.kep-eyebrow > span:first-of-type, & .kep-eyebrow > span:first-of-type': {
      color: 'var(--aurora-palette-primary-main)',
    },
  },
  {
    '&.kep-live-dot, & .kep-live-dot': {
      width: '6px',
      height: '6px',
      background: 'var(--aurora-palette-primary-main)',
      borderRadius: '50%',
      boxShadow: '0 0 10px color-mix(in srgb, var(--kep-logo-ice) 33%, transparent)',
    },
  },
  {
    '&.kep-hero, & .kep-hero': {
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-home-width)',
      margin: '0 auto',
      position: 'relative',
      padding: 0,
      isolation: 'isolate',
    },
  },
  {
    '&.kep-hero-copy, & .kep-hero-copy': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '24px',
      textAlign: 'center',
      padding: '76px var(--kep-content-inset) 56px',
      overflow: 'hidden',
      borderBottom: '1px solid var(--kep-line)',
      position: 'relative',
      zIndex: '2',
    },
  },
  {
    '&.kep-hero-stage, & .kep-hero-stage': {
      position: 'relative',
      margin: 0,
      padding: '28px var(--kep-content-inset) 24px',
      isolation: 'isolate',
      '&::before': {
        content: "''",
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        background: "url('/assets/theme/hero-texture.webp') center 58% / cover no-repeat",
        opacity: 0.1,
        maskImage: 'linear-gradient(#000, transparent 80%)',
      },
    },
  },
  {
    '&.kep-text-link, & .kep-text-link': {
      display: 'inline-flex',
      gap: '14px',
      alignItems: 'center',
      fontSize: '13px',
      marginTop: '20px',
      transition: 'color 0.2s, gap 0.2s',
    },
  },
  {
    '&.kep-text-link:hover, & .kep-text-link:hover': {
      color: 'var(--aurora-palette-primary-main)',
      gap: '20px',
    },
  },
  {
    '&.kep-trust-strip, & .kep-trust-strip': {
      width: 'calc(100% - var(--kep-page-gutter) * 2)',
      maxWidth: 'var(--kep-home-width)',
      margin: '0 auto',
      padding: '24px var(--kep-content-inset)',
      textAlign: 'center',
    },
  },
  {
    '&.kep-trust-strip > p, & .kep-trust-strip > p': {
      fontSize: '13px',
      marginBottom: '20px',
    },
  },
  {
    '&.kep-statistics, & .kep-statistics': {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '24px',
      textAlign: 'center',
    },
  },
  {
    '&.kep-statistics strong, & .kep-statistics strong': {
      display: 'block',
      fontVariant: 'normal',
      fontVariantNumeric: 'tabular-nums',
    },
  },
  {
    '&.kep-statistics > div > span, & .kep-statistics > div > span': {
      display: 'block',
      marginTop: '5px',
    },
  },
  {
    '&.kep-three-grid, & .kep-three-grid': {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      gap: '20px',
    },
  },
  {
    '&.kep-three-grid > .kep-reveal, & .kep-three-grid > .kep-reveal': {
      height: '100%',
    },
  },
  {
    '&.kep-segmented-tabs, & .kep-segmented-tabs': {
      margin: '0 auto 40px',
      width: 'max-content',
      maxWidth: '100%',
      border: '1px solid var(--kep-line)',
      borderRadius: '999px',
      background: 'var(--kep-panel)',
      padding: '4px',
      minHeight: '44px',
    },
  },
  {
    '&.kep-segmented-tabs .MuiTabs-indicator, & .kep-segmented-tabs .MuiTabs-indicator': {
      display: 'none',
    },
  },
  {
    '&.kep-segmented-tabs .MuiTab-root, & .kep-segmented-tabs .MuiTab-root': {
      borderRadius: '999px',
      fontSize: '13px',
      minHeight: '40px',
      padding: '8px 25px',
    },
  },
  {
    '&.kep-segmented-tabs .Mui-selected, & .kep-segmented-tabs .Mui-selected': {
      background: 'var(--aurora-palette-background-elevation2)',
      color: 'var(--kep-text)',
    },
  },
  {
    '&.kep-event-grid, & .kep-event-grid': {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '20px',
    },
  },
  {
    '&.kep-event-card, & .kep-event-card': {
      padding: '32px',
      border: '1px solid var(--kep-line)',
      borderRadius: 0,
      background: 'var(--kep-panel)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  {
    '&.kep-event-card h3, & .kep-event-card h3': {
      fontSize: '27px',
      lineHeight: '1.2',
      margin: '20px 0 14px',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.kep-event-card > p, & .kep-event-card > p': {
      fontSize: '14px',
      marginBottom: '20px',
    },
  },
  {
    '&.kep-event-card time, & .kep-event-card time': {
      font: '12px var(--kep-font-family)',
      color: 'var(--aurora-palette-primary-main)',
      marginBottom: '20px',
    },
  },
  {
    '&.kep-event-metrics, & .kep-event-metrics': {
      display: 'flex',
      gap: '25px',
      padding: '20px 0',
      borderTop: '1px solid var(--kep-line)',
      width: '100%',
      marginTop: 'auto',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
  },
  {
    '&.kep-event-metrics strong, & .kep-event-metrics strong': {
      fontSize: '16px',
      fontWeight: '500',
      display: 'block',
    },
  },
  {
    '&.kep-event-metrics small, & .kep-event-metrics small': {
      fontSize: '11px',
      color: 'var(--kep-muted)',
      display: 'block',
    },
  },
  {
    '&.kep-event-card .MuiButton-root, & .kep-event-card .MuiButton-root': {
      fontSize: '13px',
    },
  },
  {
    '&.kep-faq-grid, & .kep-faq-grid': {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)',
      gap: '0',
    },
  },
  {
    '&.kep-faq-aside, & .kep-faq-aside': {
      padding: '32px',
      borderInlineStart: '1px solid var(--kep-line)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
  },
  {
    '&.kep-faq-aside p, & .kep-faq-aside p': {
      margin: '12px 0 30px',
    },
  },
  {
    '&.kep-leader-card, & .kep-leader-card': {
      border: '1px solid var(--kep-line)',
      borderRadius: 0,
      background: 'var(--kep-panel)',
    },
  },
  {
    '&.kep-leader-card > [role="button"], & .kep-leader-card > [role="button"], & .kep-leader-loading-row':
      {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '32px',
        position: 'relative',
      },
  },
  {
    '&.kep-leader-rank, & .kep-leader-rank': {
      position: 'absolute',
      left: '20px',
      top: '20px',
      font: '12px var(--kep-font-family)',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.kep-leader-identity, & .kep-leader-identity': {
      fontSize: '17px',
      margin: '18px 0 12px',
      overflowWrap: 'anywhere',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.kep-leader-username, & .kep-leader-username': {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    },
    '&.kep-leader-name, & .kep-leader-name': {
      display: 'block',
      fontSize: 12,
      color: 'var(--kep-muted)',
      marginTop: 4,
      fontFamily: 'var(--kep-reading-font)',
    },
    '&.kep-leader-value, & .kep-leader-value': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      font: '500 28px/1.2 var(--kep-display-font)',
      fontFeatureSettings: '"ss01" 1',
      '& .MuiTypography-root': { font: 'inherit', fontFeatureSettings: 'inherit' },
    },
  },
  {
    '&.kep-leader-card strong, & .kep-leader-card strong': {
      font: '32px var(--kep-font-family)',
      color: 'var(--aurora-palette-primary-main)',
    },
  },
  {
    '&.kep-leader-arrow, & .kep-leader-arrow': {
      position: 'absolute',
      right: '20px',
      bottom: '20px',
      transition: 'transform 0.25s',
    },
  },
  {
    '&.kep-leader-card:hover .kep-leader-arrow, & .kep-leader-card:hover .kep-leader-arrow': {
      transform: 'translate(3px, -3px)',
    },
  },
  {
    '&.kep-centered-link, & .kep-centered-link': {
      display: 'flex',
      width: 'max-content',
      margin: '30px auto 0',
    },
  },
  {
    '&.kep-story, & .kep-story': {
      border: '1px solid var(--kep-line)',
      borderRadius: 0,
      padding: '50px',
      background: 'var(--kep-panel)',
    },
  },
  {
    '&.kep-story-content, & .kep-story-content': {
      display: 'grid',
      gridTemplateColumns: '70px 1fr',
      gap: '25px',
      animation: 'kep-panel-in 0.4s ease',
    },
  },
  {
    '&.kep-story-mark, & .kep-story-mark': {
      font: '48px var(--kep-font-family)',
      color: 'var(--aurora-palette-primary-main)',
    },
  },
  {
    '&.kep-story h3, & .kep-story h3': {
      fontSize: '30px',
      lineHeight: '1.4',
      marginBottom: '20px',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.kep-story-excerpt, & .kep-story-excerpt': {
      color: 'var(--kep-muted)',
      fontSize: '16px',
      lineHeight: '1.6',
      display: '-webkit-box',
      WebkitLineClamp: '3',
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
  },
  {
    '&.kep-story-meta, & .kep-story-meta': {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '15px',
      alignItems: 'center',
      marginTop: '30px',
    },
  },
  {
    '&.kep-story-meta > a, & .kep-story-meta > a': {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '13px',
      marginTop: '0',
    },
  },
  {
    '&.kep-story-controls, & .kep-story-controls': {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      marginTop: '25px',
      gap: '10px',
    },
  },
  {
    '&.kep-story-controls > span, & .kep-story-controls > span': {
      font: '11px var(--kep-font-family)',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.kep-story-controls .MuiButton-root, & .kep-story-controls .MuiButton-root': {
      minWidth: '42px',
      border: '1px solid var(--kep-line)',
    },
  },
  {
    '&.kep-community-panels, & .kep-community-panels': {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr',
      gap: '20px',
      marginTop: '24px',
    },
  },
  {
    '&.kep-community-panels > .MuiPaper-root, & .kep-community-panels > .MuiPaper-root': {
      outline: 'none',
      border: '1px solid var(--kep-line)',
      borderRadius: 0,
      background: 'var(--kep-panel)',
    },
  },
  {
    '&.kep-final-cta, & .kep-final-cta': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '32px',
      textAlign: 'left',
      position: 'relative',
      isolation: 'isolate',
      overflow: 'hidden',
      '& > .kep-cta': {
        flexShrink: 0,
      },
    },
  },
  {
    '&.kep-final-cta .kep-section-heading, & .kep-final-cta .kep-section-heading': {
      margin: '0',
    },
  },
  {
    '&.kep-empty, & .kep-empty': {
      padding: '25px 0',
    },
  },
  {
    '@media (min-width: 1600px)': {
      '&.kep-home, & .kep-home': {
        '--kep-home-width': 'var(--kep-page-width)',
      },
    },
  },
  {
    '@media (max-width: 1100px)': {
      '&.kep-faq-grid, & .kep-faq-grid': {
        gap: '0',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-section, & .kep-section': {
        padding: '48px var(--kep-content-inset)',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-section-heading, & .kep-section-heading': {
        marginBottom: '35px',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-hero, & .kep-hero': {
        padding: 0,
        isolation: 'isolate',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-hero-stage, & .kep-hero-stage': {
        padding: '24px var(--kep-content-inset)',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-three-grid, & .kep-three-grid': {
        gridTemplateColumns: '1fr',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-faq-grid, & .kep-faq-grid': {
        gridTemplateColumns: '1fr',
        gap: '0',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-event-grid, & .kep-event-grid': {
        gridTemplateColumns: '1fr',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-community-panels, & .kep-community-panels': {
        gridTemplateColumns: '1fr',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-leader-card > [role="button"], & .kep-leader-card > [role="button"]': {
        flexDirection: 'row',
        gap: '20px',
        textAlign: 'left',
        padding: '25px 35px 25px 55px',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-leader-identity, & .kep-leader-identity': {
        margin: '0',
        flex: '1',
        fontFamily: 'var(--kep-display-font)',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-leader-rank, & .kep-leader-rank': {
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-leader-card strong, & .kep-leader-card strong': {
        fontSize: '26px',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-leader-arrow, & .kep-leader-arrow': {
        display: 'none',
      },
    },
  },
  {
    '@media (max-width: 800px)': {
      '&.kep-final-cta, & .kep-final-cta': {
        paddingBottom: '70px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-section, & .kep-section': {
        padding: '40px var(--kep-content-inset)',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-hero, & .kep-hero': {
        padding: '32px var(--kep-content-inset) 0',
        border: '0',
        isolation: 'isolate',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-hero-stage, & .kep-hero-stage': {
        margin: '24px 0 0',
        padding: '0 0 20px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-statistics, & .kep-statistics': {
        gridTemplateColumns: '1fr 1fr',
        gap: '25px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-trust-strip, & .kep-trust-strip': {
        padding: '25px var(--kep-content-inset)',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-event-card, & .kep-event-card': {
        padding: '25px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-event-card h3, & .kep-event-card h3': {
        fontSize: '24px',
        fontFamily: 'var(--kep-display-font)',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-story, & .kep-story': {
        padding: '25px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-story-content, & .kep-story-content': {
        gridTemplateColumns: '1fr',
        gap: '10px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-story-mark, & .kep-story-mark': {
        fontSize: '32px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-story h3, & .kep-story h3': {
        fontSize: '23px',
        fontFamily: 'var(--kep-display-font)',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-story-meta, & .kep-story-meta': {
        flexWrap: 'wrap',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-story-meta > a, & .kep-story-meta > a': {
        fontSize: '12px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-leader-card > a, & .kep-leader-card > a': {
        gap: '12px',
        padding: '22px 18px 22px 42px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-leader-card h3, & .kep-leader-card h3': {
        fontSize: '14px',
        fontFamily: 'var(--kep-display-font)',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-leader-card strong, & .kep-leader-card strong': {
        fontSize: '22px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-leader-card .MuiAvatar-root, & .kep-leader-card .MuiAvatar-root': {
        width: '38px',
        height: '38px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-home .kep-cta, & .kep-home .kep-cta': {
        fontSize: '14px',
        minHeight: '48px',
      },
    },
  },
  {
    '@media (max-width: 540px)': {
      '&.kep-final-cta, & .kep-final-cta': {
        paddingBottom: '55px',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.kep-home *, & .kep-home *, &.kep-home *:before, & .kep-home *:before, &.kep-home *:after, & .kep-home *:after':
        {
          animation: 'none !important',
          transition: 'none !important',
        },
    },
  },
  {
    '& .kep-hero-summary': {
      minWidth: 0,
      paddingBottom: '4px',
    },
    '& .kep-hero-summary p': {
      maxWidth: '660px',
      margin: '0 auto',
      textWrap: 'balance',
    },
    '& .kep-hero-actions': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: '24px',
    },
    '& .kep-hero-highlight': {
      background: 'linear-gradient(110deg, var(--kep-logo-sand), var(--kep-logo-ice))',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    '& .kep-demo-heading': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px 24px',
      marginBottom: '14px',
    },
    '& .kep-hero-next': {
      display: 'flex',
      justifyContent: 'flex-end',
      paddingTop: '16px',
      '& a': {
        display: 'inline-flex',
        gap: '10px',
        alignItems: 'center',
        fontSize: '13px',
        minHeight: '36px',
        color: 'var(--kep-logo-ice)',
      },
    },
    '& .kep-path-grid': {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
      gap: '16px',
    },
    '& .kep-practice-steps': {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      listStyle: 'none',
      margin: 0,
      padding: 0,
      borderTop: '1px solid var(--kep-line)',
      '& li': {
        minWidth: 0,
        padding: '24px 28px 0 0',
      },
      '& li + li': {
        borderInlineStart: '1px solid var(--kep-line)',
        paddingInlineStart: '28px',
      },
    },
    '& .kep-toolkit': {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
      gap: '40px',
      alignItems: 'center',
      '& .kep-section-heading': {
        margin: 0,
      },
    },
    '& .kep-landing-community': {
      '& .kep-dashboard-grid': {
        borderBottom: 0,
      },
    },
    '@media (max-width: 900px)': {
      '& .kep-hero-copy': {
        gap: '20px',
        paddingBlock: '52px 40px',
      },
      '& .kep-hero-summary p': {
        maxWidth: '620px',
      },
      '& .kep-path-grid': {
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '16px',
      },
      '& .kep-toolkit': {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: '24px',
      },
    },
    '@media (max-width: 600px)': {
      '& .kep-path-grid': {
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: '16px',
      },
      '& .kep-practice-steps': {
        gridTemplateColumns: 'minmax(0, 1fr)',
        '& li, & li + li': {
          padding: '24px 0',
          borderInlineStart: 0,
        },
        '& li + li': {
          borderTop: '1px solid var(--kep-line)',
        },
        '& li:last-of-type': {
          paddingBottom: 0,
        },
      },
      '& .kep-final-cta': {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '24px',
      },
      '& .kep-hero-next': {
        justifyContent: 'flex-start',
      },
      '& .kep-hero-copy': {
        paddingBlock: '36px 32px',
      },
    },
  },
  {
    '& .kep-landing .kep-statistics > div + div': {
      borderInlineStart: '1px solid var(--kep-line)',
    },
    '& .kep-landing .kep-section': {
      position: 'relative',
    },
    '& .kep-landing .kep-section::after': {
      content: '""',
      position: 'absolute',
      insetInline: '-3px',
      bottom: '-3px',
      height: '5px',
      background:
        'linear-gradient(var(--kep-text), var(--kep-text)) left / 5px 5px no-repeat, linear-gradient(var(--kep-text), var(--kep-text)) right / 5px 5px no-repeat',
      pointerEvents: 'none',
    },
    '@media (max-width: 800px)': {
      '& .kep-faq-aside': {
        borderInlineStart: 0,
        borderTop: '1px solid var(--kep-line)',
        padding: '24px',
      },
    },
    '@media (max-width: 540px)': {
      '& .kep-landing .kep-statistics > div:nth-of-type(3)': {
        borderInlineStart: 0,
      },
    },
  },
  {
    '& .kep-hero h1.MuiTypography-root': {
      margin: '20px 0 0',
      maxWidth: '960px',
      fontSize: 'clamp(36px, 5.8vw, 80px)',
      lineHeight: 1.1,
      letterSpacing: '-0.035em',
      textWrap: 'balance',
    },
    '& .kep-path-card': {
      gridColumn: 'span 2',
      minWidth: 0,
      '&:nth-of-type(-n+2)': {
        gridColumn: 'span 3',
      },
    },
    '& .kep-path-link': {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      gridTemplateRows: 'auto auto 1fr auto',
      columnGap: 16,
      height: '100%',
      padding: 24,
      '& > h3': {
        gridRow: 2,
        gridColumn: 1,
        marginBottom: 10,
      },
      '& > p': {
        gridRow: 3,
        gridColumn: '1 / -1',
      },
    },
    '& .kep-path-art': {
      gridRow: '1 / 3',
      gridColumn: '1 / -1',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      minHeight: 78,
      '& svg': {
        width: 112,
        marginTop: -8,
      },
    },
    '& .kep-path-action': {
      gridColumn: '1 / -1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingTop: 20,
      color: 'var(--kep-logo-ice)',
      fontSize: '0.875rem',
    },
    '& .kep-practice-number': {
      display: 'block',
      marginBottom: 12,
    },
    '& .kep-practice-steps h3': {
      marginBottom: 12,
    },
    '& .kep-toolkit-languages': {
      display: 'flex',
      flexWrap: 'wrap',
      alignContent: 'center',
      gap: 8,
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    '& .kep-faq-grid': {
      overflow: 'visible',
    },
    '& .kep-faq-item.MuiAccordion-root': {
      background: 'transparent',
      borderBottom: '1px solid var(--kep-line)',
      boxShadow: 'none',
      outline: 'none',
    },
    '& .kep-faq-item:last-child': {
      borderBottom: 0,
    },
    '& .kep-faq-item .MuiAccordionSummary-root': {
      padding: '16px 20px',
    },
    '& .kep-faq-item .MuiAccordionDetails-root': {
      padding: '0 20px 20px',
    },
    '@media (max-width: 900px)': {
      '& .kep-path-card, & .kep-path-card:nth-of-type(-n+2)': {
        gridColumn: 'span 1',
      },
      '& .kep-path-card:last-of-type': {
        gridColumn: '1 / -1',
      },
    },
    '@media (max-width: 600px)': {
      '& .kep-path-link': {
        padding: 20,
      },
      '& .kep-path-art': {
        minHeight: 72,
        '& svg': {
          width: 100,
        },
      },
      '& .kep-section-heading h2': {
        overflowWrap: 'anywhere',
      },
    },
  },
];
