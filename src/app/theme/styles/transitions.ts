import { Theme, keyframes } from '@mui/material';

/** Shared rhythm: quick controls and a softer entrance for content. */
export const motion = {
  easing: 'cubic-bezier(.2, .8, .2, 1)',
  interaction:
    'color 160ms ease, background-color 180ms ease, border-color 180ms ease, box-shadow 220ms ease, transform 220ms cubic-bezier(.2, .8, .2, 1)',
  reduced: '@media (prefers-reduced-motion: reduce)',
} as const;

const enter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const contentEntranceStyles = {
  animation: `${enter} 380ms ${motion.easing} backwards`,
  [motion.reduced]: { animation: 'none' },
};

/** Feedback stays on the control; its surrounding layout does not move. */
export const controlMotionStyles = {
  transition: motion.interaction,
  '&:active:not(.Mui-disabled)': { transform: 'translateY(1px)' },
  [motion.reduced]: {
    transition: 'none',
    '&:active:not(.Mui-disabled)': { transform: 'none' },
  },
};

const transitions = (theme: Theme) => ({
  layout: {
    transition: theme.transitions.create(['width'], {
      duration: theme.transitions.duration.standard,
    }),
  },
});
export default transitions;
