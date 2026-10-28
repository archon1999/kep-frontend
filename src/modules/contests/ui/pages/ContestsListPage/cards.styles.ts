import type { CSSObject } from '@mui/material/styles';

export const cardStyles: CSSObject[] = [
  {
    '&.contest-editorial-card, & .contest-editorial-card': {
      '--contest-gold': 'var(--kep-gold)',
      '--contest-silver': 'var(--kep-silver)',
      '--contest-bronze': 'var(--kep-bronze)',
    },
  },
  {
    '&.contest-editorial-card article, & .contest-editorial-card article': {
      padding: '0',
    },
  },
  {
    '&.contest-card-masthead, & .contest-card-masthead, &.contest-leaderboard-header, & .contest-leaderboard-header':
      {
        position: 'relative',
        isolation: 'isolate',
        minHeight: '140px',
        boxSizing: 'border-box',
        overflow: 'hidden',
      },
  },
  {
    '&.contest-card-masthead, & .contest-card-masthead': {
      padding: '20px 32px',
    },
  },
  {
    '&.kep-spotlight.contest-card-masthead::before, & .kep-spotlight.contest-card-masthead::before, &.kep-spotlight.contest-leaderboard-header::before, & .kep-spotlight.contest-leaderboard-header::before':
      {
        content: "''",
        position: 'absolute',
        inset: '0',
        zIndex: '-1',
        pointerEvents: 'none',
        background:
          'radial-gradient( 350px circle at var(--pointer-x, 85%) var(--pointer-y, 20%), color-mix(in srgb, var(--kep-logo-ice) 27%, transparent), transparent 75% ), radial-gradient( 210px circle at calc(var(--pointer-x, 85%) - 120px) calc(var(--pointer-y, 20%) + 60px), color-mix(in srgb, var(--kep-logo-sand) 16%, transparent), transparent 80% )',
        opacity: '0.25',
        transition: 'opacity 300ms ease',
      },
  },
  {
    '&.contest-card-masthead.kep-spotlight:hover::before, & .contest-card-masthead.kep-spotlight:hover::before, &.contest-card-masthead.kep-spotlight:focus-within::before, & .contest-card-masthead.kep-spotlight:focus-within::before, &.contest-leaderboard-header.kep-spotlight:hover::before, & .contest-leaderboard-header.kep-spotlight:hover::before':
      {
        opacity: '1',
      },
  },
  {
    '&.contest-card-masthead::after, & .contest-card-masthead::after, &.contest-leaderboard-header::after, & .contest-leaderboard-header::after':
      {
        content: "''",
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        zIndex: '-1',
        background:
          'radial-gradient(circle, var(--kep-logo-ice) 0 1px, transparent 1.2px) 0 0 / 5px 5px',
        maskImage:
          'radial-gradient( 230px circle at var(--pointer-x, 85%) var(--pointer-y, 20%), #000, transparent )',
        opacity: '0',
        transition: 'opacity 300ms ease',
      },
  },
  {
    '&.contest-card-masthead:hover::after, & .contest-card-masthead:hover::after, &.contest-leaderboard-header:hover::after, & .contest-leaderboard-header:hover::after':
      {
        opacity: '0.25',
      },
  },
  {
    '&.contest-card-rule, & .contest-card-rule': {
      height: '10px',
      borderBlock: '1px solid var(--kep-line)',
      background: 'repeating-linear-gradient(90deg, transparent 0 11px, var(--kep-line) 11px 12px)',
    },
  },
  {
    '&.contest-card-heading, & .contest-card-heading, &.contest-card-identity, & .contest-card-identity, &.contest-card-badges, & .contest-card-badges, &.contest-card-bottom, & .contest-card-bottom, &.contest-card-counts dt, & .contest-card-counts dt':
      {
        display: 'flex',
        alignItems: 'center',
      },
  },
  {
    '&.contest-card-heading, & .contest-card-heading': {
      justifyContent: 'space-between',
      gap: '16px',
    },
  },
  {
    '&.contest-card-identity, & .contest-card-identity': {
      gap: '8px',
      minWidth: '0',
      color: 'var(--kep-muted)',
      fontSize: '11px',
      letterSpacing: '0.01em',
    },
  },
  {
    '&.contest-card-identity .kep-pixel-cross, & .contest-card-identity .kep-pixel-cross': {
      color: 'var(--kep-logo-ice)',
      width: '14px',
      height: '14px',
    },
  },
  {
    '&.contest-card-id, & .contest-card-id': {
      opacity: '0.65',
      letterSpacing: '0',
    },
  },
  {
    '&.contest-card-badges, & .contest-card-badges': {
      flexShrink: '0',
      gap: '8px',
      fontSize: '11px',
    },
  },
  {
    '&.contest-editorial-card h2, & .contest-editorial-card h2': {
      margin: '14px 0 0',
      font: '500 clamp(26px, 2.6vw, 38px)/1.2 var(--kep-display-font)',
      letterSpacing: '-0.025em',
    },
  },
  {
    '&.contest-editorial-card h2 a, & .contest-editorial-card h2 a': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      color: 'inherit',
      textDecoration: 'none',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-title-text .kep-scramble-visual, & .contest-title-text .kep-scramble-visual': {
      color: 'transparent',
      background:
        'linear-gradient( 105deg, var(--kep-logo-sand), var(--kep-logo-mid) 40%, var(--kep-logo-ice) )',
      backgroundClip: 'text',
      fontFeatureSettings: 'normal',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-title-text.kep-scramble, & .contest-title-text.kep-scramble': {
      whiteSpace: 'normal',
      minWidth: '0',
      overflowWrap: 'anywhere',
      fontFeatureSettings: 'normal',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-title-arrow, & .contest-title-arrow': {
      width: '40px',
      height: '40px',
      border: '1px solid var(--kep-line)',
      borderRadius: '50%',
      flexShrink: '0',
      display: 'grid',
      placeItems: 'center',
    },
  },
  {
    '&.contest-editorial-card h2 svg, & .contest-editorial-card h2 svg': {
      flexShrink: '0',
      fontSize: '23px',
      color: 'var(--kep-muted)',
      transition: 'transform 0.25s ease, color 0.25s ease',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-editorial-card:hover h2 svg, & .contest-editorial-card:hover h2 svg': {
      transform: 'translate(2px, -2px)',
      color: 'var(--kep-logo-ice)',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-card-main, & .contest-card-main': {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) minmax(170px, 0.52fr)',
      gap: '24px',
      padding: '20px 32px',
    },
  },
  {
    '&.contest-card-main--solo, & .contest-card-main--solo': {
      gridTemplateColumns: '1fr',
    },
  },
  {
    '&.contest-announcement, & .contest-announcement': {
      minWidth: '0',
    },
  },
  {
    '&.contest-announcement-copy, & .contest-announcement-copy': {
      fontFamily: 'var(--contest-reading-font)',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: '4',
      overflow: 'hidden',
      fontSize: '15px',
      lineHeight: '1.6',
      color: 'color-mix(in srgb, var(--kep-text) 20%, var(--kep-muted))',
      overflowWrap: 'anywhere',
    },
  },
  {
    '&.contest-announcement-copy.is-expanded, & .contest-announcement-copy.is-expanded': {
      display: 'block',
      WebkitLineClamp: 'unset',
    },
  },
  {
    '&.contest-announcement-copy p, & .contest-announcement-copy p': {
      margin: '0',
    },
  },
  {
    '&.contest-announcement-copy ul, & .contest-announcement-copy ul': {
      paddingLeft: '20px',
      marginBlock: '6px',
    },
  },
  {
    '&.contest-announcement-copy img, & .contest-announcement-copy img': {
      maxWidth: '100%',
      height: 'auto',
    },
  },
  {
    '&.contest-announcement-copy a, & .contest-announcement-copy a': {
      color: 'var(--aurora-palette-primary-main)',
    },
  },
  {
    '&.contest-text-action, & .contest-text-action': {
      marginTop: '10px',
      padding: '4px 0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      border: '0',
      background: 'none',
      color: 'var(--aurora-palette-primary-main)',
      font: '500 13px/1.5 var(--contest-reading-font)',
      cursor: 'pointer',
    },
  },
  {
    '&.contest-disclosure-mark, & .contest-disclosure-mark': {
      display: 'inline-block',
      width: '18px',
      height: '18px',
    },
  },
  {
    '&.contest-disclosure-mark.is-expanded, & .contest-disclosure-mark.is-expanded': {
      background:
        'repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px) center / 18px 2px no-repeat',
    },
  },
  {
    '&.contest-card-leaders, & .contest-card-leaders': {
      minWidth: '0',
      borderLeft: '1px solid var(--kep-line)',
      paddingLeft: '24px',
    },
  },
  {
    '&.contest-card-leaders h3, & .contest-card-leaders h3': {
      color: 'var(--kep-text)',
      margin: '0 0 12px',
    },
  },
  {
    '&.contest-card-leaders ol, & .contest-card-leaders ol': {
      listStyle: 'none',
      padding: '0',
      margin: '0',
      display: 'grid',
      gap: '8px',
    },
  },
  {
    '&.contest-card-leaders li, & .contest-card-leaders li': {
      display: 'flex',
      gap: '9px',
      alignItems: 'center',
      minWidth: '0',
    },
  },
  {
    '&.contest-podium-place, & .contest-podium-place, &.contest-ranking-place, & .contest-ranking-place':
      {
        fontFamily: 'var(--kep-display-font)',
        fontSize: '18px',
        fontWeight: '500',
        fontFeatureSettings: "'ss01' 1",
        fontVariantNumeric: 'tabular-nums',
        lineHeight: '1',
        letterSpacing: '0.02em',
      },
  },
  {
    '&.contest-podium-place, & .contest-podium-place': {
      display: 'grid',
      placeItems: 'center',
      width: '36px',
      height: '36px',
      flexShrink: '0',
      border: '1px solid color-mix(in srgb, var(--contest-gold) 26%, var(--kep-line))',
      background: 'color-mix(in srgb, var(--contest-gold) 4%, transparent)',
      color: 'var(--contest-gold)',
    },
  },
  {
    '&.contest-card-leaders li:nth-of-type(2) .contest-podium-place, & .contest-card-leaders li:nth-of-type(2) .contest-podium-place':
      {
        color: 'var(--contest-silver)',
        borderColor: 'color-mix(in srgb, var(--contest-silver) 24%, var(--kep-line))',
        background: 'color-mix(in srgb, var(--contest-silver) 4%, transparent)',
      },
  },
  {
    '&.contest-card-leaders li:nth-of-type(3) .contest-podium-place, & .contest-card-leaders li:nth-of-type(3) .contest-podium-place':
      {
        color: 'var(--contest-bronze)',
        borderColor: 'color-mix(in srgb, var(--contest-bronze) 24%, var(--kep-line))',
        background: 'color-mix(in srgb, var(--contest-bronze) 4%, transparent)',
      },
  },
  {
    '&.contest-user-button, & .contest-user-button': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '0',
      maxWidth: '100%',
      padding: '0',
      border: '0',
      background: 'none',
      color: 'var(--kep-text)',
      font: '500 14px/1.5 var(--contest-reading-font)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
    },
  },
  {
    '&.contest-user-name, & .contest-user-name': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  {
    '&.contest-card-leaders li > span:not(.contest-podium-place), & .contest-card-leaders li > span:not(.contest-podium-place)':
      {
        minWidth: '0',
      },
  },
  {
    '&.contest-user-button:hover, & .contest-user-button:hover': {
      color: 'var(--aurora-palette-primary-main)',
    },
  },
  {
    '&.contest-team-name, & .contest-team-name': {
      color: 'var(--kep-text)',
      fontSize: '12px',
      overflowWrap: 'anywhere',
    },
  },
  {
    '&.contest-card-leaders p, & .contest-card-leaders p': {
      fontSize: '12px',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.contest-card-dates, & .contest-card-dates': {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
      margin: '0',
      gap: '0',
      padding: '16px 32px',
      borderTop: '1px solid var(--kep-line)',
    },
  },
  {
    '&.contest-card-dates > div, & .contest-card-dates > div': {
      position: 'relative',
      padding: '0 20px',
    },
  },
  {
    '&.contest-card-dates > div:first-of-type, & .contest-card-dates > div:first-of-type': {
      paddingLeft: '0',
      borderRight: '1px solid var(--kep-line)',
    },
  },
  {
    '&.contest-card-dates > div:last-child, & .contest-card-dates > div:last-child': {
      paddingRight: '0',
    },
  },
  {
    '&.contest-card-dates > div:not(:first-of-type)::before, & .contest-card-dates > div:not(:first-of-type)::before':
      {
        content: "''",
        position: 'absolute',
        top: '8px',
        left: '32px',
        right: '0',
        height: '1px',
        background: 'linear-gradient(90deg, var(--kep-line), transparent)',
      },
  },
  {
    '&.contest-card-dates dt, & .contest-card-dates dt': {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      position: 'relative',
      width: 'fit-content',
      background: 'var(--kep-bg)',
      paddingRight: '10px',
      color: 'var(--kep-muted)',
      marginBottom: '8px',
    },
  },
  {
    '&.contest-card-dates dt svg, & .contest-card-dates dt svg': {
      color: 'var(--kep-logo-ice)',
      fontSize: '15px',
    },
  },
  {
    '&.contest-card-dates > div:last-child dt svg, & .contest-card-dates > div:last-child dt svg': {
      color: 'var(--kep-logo-sand)',
    },
  },
  {
    '&.contest-card-dates dd, & .contest-card-dates dd': {
      color: 'var(--kep-text)',
      fontSize: '14px',
      margin: '0',
      overflowWrap: 'anywhere',
    },
  },
  {
    '&.contest-format-value, & .contest-format-value': {
      fontSize: '19px',
      fontWeight: '700',
      fontFeatureSettings: "'ss01' 1",
      lineHeight: '1.3',
      color: 'var(--kep-text)',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-card-dates time, & .contest-card-dates time': {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
      flexWrap: 'wrap',
    },
  },
  {
    '&.contest-schedule-time, & .contest-schedule-time': {
      fontSize: '23px',
      fontFeatureSettings: "'ss01' 1",
      fontVariantNumeric: 'tabular-nums',
      lineHeight: '1.25',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-schedule-date, & .contest-schedule-date': {
      fontSize: '12px',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.contest-card-bottom, & .contest-card-bottom': {
      justifyContent: 'space-between',
      gap: '14px',
      margin: '0',
      padding: '16px 32px',
      borderTop: '1px solid var(--kep-line)',
      background: 'transparent',
    },
  },
  {
    '&.contest-card-counts, & .contest-card-counts': {
      display: 'flex',
      flex: '1',
      gap: '0',
      margin: '0',
      fontSize: '11px',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.contest-card-counts > div, & .contest-card-counts > div': {
      flex: '1',
      paddingRight: '20px',
    },
  },
  {
    '&.contest-card-counts > div + div, & .contest-card-counts > div + div': {
      borderLeft: '1px solid var(--kep-line)',
      paddingLeft: '20px',
    },
  },
  {
    '&.contest-card-counts dt, & .contest-card-counts dt': {
      gap: '6px',
    },
  },
  {
    '&.contest-card-counts dd, & .contest-card-counts dd': {
      margin: '6px 0 0',
      font: '500 28px/1.1 var(--kep-font-family)',
      fontFeatureSettings: "'ss01' 1",
      fontVariantNumeric: 'tabular-nums',
      color: 'var(--kep-text)',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-card-counts svg, & .contest-card-counts svg': {
      fontSize: '15px',
      color: 'var(--kep-logo-ice)',
    },
  },
  {
    '&.contest-open-link, & .contest-open-link': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: '0',
      fontSize: '14px',
      fontWeight: '600',
      minHeight: '44px',
      boxSizing: 'border-box',
      padding: '11px 20px',
      border: '1px solid transparent',
      borderRadius: '999px',
      textDecoration: 'none',
    },
  },
  {
    '&.contest-open-link svg, & .contest-open-link svg': {
      transition: 'transform 0.25s ease',
    },
  },
  {
    '&.contest-open-link:hover svg, & .contest-open-link:hover svg': {
      transform: 'translateX(4px)',
    },
  },
  {
    '&.contest-editorial-card a:focus-visible, & .contest-editorial-card a:focus-visible, &.contest-editorial-card button:focus-visible, & .contest-editorial-card button:focus-visible, &.contest-leaderboard a:focus-visible, & .contest-leaderboard a:focus-visible, &.contest-leaderboard button:focus-visible, & .contest-leaderboard button:focus-visible':
      {
        outline: '2px solid var(--aurora-palette-primary-main)',
        outlineOffset: '4px',
        borderRadius: '3px',
      },
  },
  {
    '&.contest-card-progress, & .contest-card-progress': {
      borderRadius: '0',
    },
  },
  {
    '&.contest-leaderboard, & .contest-leaderboard': {
      '--contest-gold': 'var(--kep-gold)',
      '--contest-silver': 'var(--kep-silver)',
      '--contest-bronze': 'var(--kep-bronze)',
      position: 'relative',
      borderBottom: '1px solid var(--kep-line)',
      borderRadius: '0',
      background: 'var(--kep-bg)',
    },
  },
  {
    '&.contest-leaderboard-header, & .contest-leaderboard-header': {
      display: 'flex',
      gap: '14px',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 28px',
      background: 'transparent',
    },
  },
  {
    '&.contest-leaderboard-podium, & .contest-leaderboard-podium': {
      width: '60px',
      height: '52px',
      flexShrink: '0',
      color: 'var(--kep-logo-sand)',
      opacity: '0.7',
    },
  },
  {
    '&.contest-leaderboard-eyebrow, & .contest-leaderboard-eyebrow': {
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      color: 'var(--kep-logo-ice)',
      margin: 0,
    },
  },
  {
    '&.contest-leaderboard h2, & .contest-leaderboard h2': {
      margin: '14px 0 0',
      font: '500 38px/1.15 var(--kep-display-font)',
      letterSpacing: '-0.04em',
      fontFeatureSettings: 'normal',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-leaderboard-ten, & .contest-leaderboard-ten': {
      fontFeatureSettings: "'ss01' 1",
      background: 'linear-gradient(110deg, var(--kep-logo-sand), var(--kep-logo-ice))',
      color: 'transparent',
      backgroundClip: 'text',
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-leaderboard table, & .contest-leaderboard table': {
      width: '100%',
      margin: '0',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
    },
  },
  {
    '&.contest-leaderboard th, & .contest-leaderboard th': {
      padding: '14px 0',
      color: 'var(--kep-text)',
      textAlign: 'left',
      background:
        'linear-gradient( 110deg, color-mix(in srgb, var(--kep-logo-sand) 6%, var(--kep-bg)), color-mix(in srgb, var(--kep-logo-ice) 6%, var(--kep-bg)) )',
    },
  },
  {
    '&.contest-table-label, & .contest-table-label': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
    },
  },
  {
    '&.contest-table-label svg, & .contest-table-label svg': {
      fontSize: '16px',
      color: 'var(--kep-logo-ice)',
    },
  },
  {
    '&.contest-table-rank-label, & .contest-table-rank-label': {
      display: 'grid',
      placeItems: 'center',
      width: '24px',
      height: '24px',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.contest-leaderboard th:first-of-type, & .contest-leaderboard th:first-of-type': {
      width: '68px',
    },
  },
  {
    '&.contest-leaderboard th:last-child, & .contest-leaderboard th:last-child': {
      width: '124px',
      textAlign: 'right',
    },
  },
  {
    '&.contest-leaderboard td, & .contest-leaderboard td': {
      padding: '15px 0',
      borderTop: '1px solid var(--kep-line)',
      fontSize: '14px',
    },
  },
  {
    '&.contest-leaderboard th:first-of-type, & .contest-leaderboard th:first-of-type, &.contest-leaderboard td:first-of-type, & .contest-leaderboard td:first-of-type':
      {
        paddingLeft: '28px',
      },
  },
  {
    '&.contest-leaderboard th:last-child, & .contest-leaderboard th:last-child, &.contest-leaderboard td:last-child, & .contest-leaderboard td:last-child':
      {
        paddingRight: '28px',
        paddingLeft: '12px',
        borderLeft: '1px solid var(--kep-line)',
        background: 'color-mix(in srgb, var(--kep-logo-ice) 3%, transparent)',
      },
  },
  {
    '&.contest-leaderboard td:last-child, & .contest-leaderboard td:last-child': {
      textAlign: 'right',
      color: 'var(--kep-text)',
      fontVariantNumeric: 'tabular-nums',
    },
  },
  {
    '&.contest-leaderboard td:nth-of-type(2) > span, & .contest-leaderboard td:nth-of-type(2) > span':
      {
        maxWidth: '100%',
        width: '100%',
      },
  },
  {
    '&.contest-leaderboard tr:hover td, & .contest-leaderboard tr:hover td, &.contest-leaderboard tr:focus-within td, & .contest-leaderboard tr:focus-within td':
      {
        background: 'color-mix(in srgb, var(--kep-logo-ice) 4%, transparent)',
      },
  },
  {
    '&.contest-leaderboard .contest-user-button, & .contest-leaderboard .contest-user-button': {
      color: 'color-mix(in srgb, var(--contest-user-color, var(--kep-text)) 55%, white)',
      width: '100%',
      padding: '5px 14px 5px 0',
    },
  },
  {
    '&.contest-user-arrow, & .contest-user-arrow': {
      marginLeft: 'auto',
      flexShrink: '0',
      color: 'var(--kep-logo-ice)',
      opacity: '0',
      transform: 'translate(-3px, 3px)',
      transition: 'opacity 160ms ease, transform 160ms ease',
    },
  },
  {
    '&.contest-ranking-row:hover .contest-user-arrow, & .contest-ranking-row:hover .contest-user-arrow, &.contest-ranking-row:focus-within .contest-user-arrow, & .contest-ranking-row:focus-within .contest-user-arrow':
      {
        opacity: '1',
        transform: 'translate(0)',
      },
  },
  {
    '&.contest-rating-value, & .contest-rating-value': {
      fontSize: '19px',
      fontFeatureSettings: "'ss01' 1",
      fontFamily: 'var(--kep-display-font)',
    },
  },
  {
    '&.contest-ranking-place, & .contest-ranking-place': {
      display: 'inline-grid',
      placeItems: 'center',
      width: '30px',
      height: '36px',
      color: 'var(--kep-muted)',
    },
  },
  {
    '&.contest-ranking-row--1 .contest-ranking-place, & .contest-ranking-row--1 .contest-ranking-place, &.contest-ranking-row--1 .contest-rating-value, & .contest-ranking-row--1 .contest-rating-value':
      {
        color: 'var(--contest-gold)',
      },
  },
  {
    '&.contest-ranking-row--2 .contest-ranking-place, & .contest-ranking-row--2 .contest-ranking-place, &.contest-ranking-row--2 .contest-rating-value, & .contest-ranking-row--2 .contest-rating-value':
      {
        color: 'var(--contest-silver)',
      },
  },
  {
    '&.contest-ranking-row--3 .contest-ranking-place, & .contest-ranking-row--3 .contest-ranking-place, &.contest-ranking-row--3 .contest-rating-value, & .contest-ranking-row--3 .contest-rating-value':
      {
        color: 'var(--contest-bronze)',
      },
  },
  {
    '&.contest-rating-score, & .contest-rating-score': {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: '8px',
    },
  },
  {
    '&.contest-leaderboard-footer, & .contest-leaderboard-footer': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 18px',
      margin: '24px 28px',
      border: '1px solid color-mix(in srgb, var(--kep-logo-ice) 40%, var(--kep-line))',
      borderRadius: '999px',
      color: 'var(--kep-text)',
      fontSize: '14px',
      textDecoration: 'none',
    },
  },
  {
    '&.contest-leaderboard tbody tr:last-child td, & .contest-leaderboard tbody tr:last-child td': {
      borderBottom: '1px solid var(--kep-line)',
    },
  },
  {
    '&.contest-leaderboard-footer:hover, & .contest-leaderboard-footer:hover': {
      background: 'color-mix(in srgb, var(--kep-logo-ice) 5%, transparent)',
    },
  },
  {
    '&.contest-leaderboard-loading, & .contest-leaderboard-loading, &.contest-leaderboard-message, & .contest-leaderboard-message':
      {
        padding: '20px 24px',
      },
  },
  {
    '&.contests-list-toolbar, & .contests-list-toolbar': {
      borderBottom: '1px solid var(--kep-line)',
      marginBottom: '0',
      background: 'var(--kep-bg)',
    },
  },
  {
    '&.contests-list-toolbar .MuiButton-soft, & .contests-list-toolbar .MuiButton-soft': {
      background: 'transparent',
      border: '1px solid var(--kep-line)',
    },
  },
  {
    '&.contests-list-shortcuts, & .contests-list-shortcuts': {
      marginLeft: 'auto',
      justifyContent: 'flex-end',
    },
  },
  {
    "html[data-kep-color-scheme='light'] &.contest-editorial-card, html[data-kep-color-scheme='light'] & .contest-editorial-card, html[data-kep-color-scheme='light'] &.contest-leaderboard, html[data-kep-color-scheme='light'] & .contest-leaderboard":
      {
        '--contest-gold': 'var(--kep-gold)',
        '--contest-silver': 'var(--kep-silver)',
        '--contest-bronze': 'var(--kep-bronze)',
      },
  },
  {
    "html[data-kep-color-scheme='light'] &.contest-leaderboard .contest-user-button, html[data-kep-color-scheme='light'] & .contest-leaderboard .contest-user-button":
      {
        color:
          'color-mix(in srgb, var(--contest-user-color, var(--kep-text)) 60%, var(--kep-text))',
      },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-masthead, & .contest-card-masthead, &.contest-leaderboard-header, & .contest-leaderboard-header':
        {
          minHeight: 'auto',
        },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-masthead, & .contest-card-masthead, &.contest-card-main, & .contest-card-main':
        {
          padding: '18px',
        },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-heading, & .contest-card-heading': {
        alignItems: 'flex-start',
        gap: '10px',
        flexWrap: 'wrap',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-identity, & .contest-card-identity': {
        fontSize: '10px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-main, & .contest-card-main': {
        gridTemplateColumns: '1fr',
        gap: '18px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-leaders, & .contest-card-leaders': {
        borderLeft: '0',
        borderTop: '1px solid var(--kep-line)',
        padding: '16px 0 0',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-leaders ol, & .contest-card-leaders ol': {
        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
        gap: '8px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-leaders li, & .contest-card-leaders li': {
        alignItems: 'flex-start',
        flexDirection: 'column',
        gap: '4px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-leaders .contest-user-button, & .contest-card-leaders .contest-user-button': {
        fontSize: '13px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-dates, & .contest-card-dates': {
        gap: '0',
        padding: '16px 18px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-dates > div, & .contest-card-dates > div': {
        padding: '0 10px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-dates > div + div, & .contest-card-dates > div + div': {
        paddingLeft: '10px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-dates dd, & .contest-card-dates dd': {
        fontSize: '12px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-format-value, & .contest-format-value': {
        fontSize: '15px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-schedule-time, & .contest-schedule-time': {
        fontSize: '21px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-bottom, & .contest-card-bottom': {
        margin: '0',
        padding: '14px 18px',
        alignItems: 'flex-start',
        flexDirection: 'column',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-counts, & .contest-card-counts': {
        width: '100%',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-counts > div, & .contest-card-counts > div': {
        paddingRight: '10px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-counts > div + div, & .contest-card-counts > div + div': {
        paddingLeft: '10px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-counts dt, & .contest-card-counts dt': {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-card-counts dd, & .contest-card-counts dd': {
        fontSize: '25px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-open-link, & .contest-open-link': {
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 16px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-leaderboard-header, & .contest-leaderboard-header': {
        paddingInline: '20px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-leaderboard th:first-of-type, & .contest-leaderboard th:first-of-type': {
        width: '54px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-leaderboard th:last-child, & .contest-leaderboard th:last-child': {
        width: '116px',
      },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-leaderboard th:first-of-type, & .contest-leaderboard th:first-of-type, &.contest-leaderboard td:first-of-type, & .contest-leaderboard td:first-of-type':
        {
          paddingLeft: '18px',
        },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-leaderboard th:last-child, & .contest-leaderboard th:last-child, &.contest-leaderboard td:last-child, & .contest-leaderboard td:last-child':
        {
          paddingRight: '18px',
        },
    },
  },
  {
    '@media (max-width: 600px)': {
      '&.contest-leaderboard-footer, & .contest-leaderboard-footer': {
        marginInline: '18px',
      },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.contest-card-masthead::after, & .contest-card-masthead::after, &.contest-leaderboard-header::after, & .contest-leaderboard-header::after':
        {
          display: 'none',
        },
    },
  },
  {
    '@media (prefers-reduced-motion: reduce)': {},
  },
  {
    '@media (prefers-reduced-motion: reduce)': {
      '&.contest-editorial-card:hover h2 svg, & .contest-editorial-card:hover h2 svg, &.contest-open-link:hover svg, & .contest-open-link:hover svg':
        {
          transform: 'none',
          fontFamily: 'var(--kep-display-font)',
        },
    },
  },
];
