import { alpha } from '@mui/material/styles';
import kepLogo from 'shared/assets/logo/logo.svg';
import algorithmsLogo from 'shared/assets/study-plans/algorithms.svg';
import programmingBasicsLogo from 'shared/assets/study-plans/programming-basics.svg';
import mathLogo from 'shared/assets/study-plans/math-cp.svg';
import implementationLogo from 'shared/assets/study-plans/implementation.svg';
import contestLogo from 'shared/assets/study-plans/contest.svg';
import olympiadLogo from 'shared/assets/study-plans/olympiad.svg';
import { dark } from '@mui/material/styles/createPalette';

type StudyPlanBrandingInput = {
  code?: string;
  icon?: string | null;
  themeColor?: string;
  themeColorSecondary?: string;
};

type StudyPlanBranding = {
  iconSrc?: string | null;
  lightColor: string;
  darkColor: string;
  accentColor: string;
  surfaceColor: string;
  surfaceStrongColor: string;
  borderColor: string;
  progressTrackColor: string;
};

type StudyPlanBrandingMode = 'light' | 'dark';

const defaultIcons: Record<string, string> = {
  'kep-intro': kepLogo,
  'best-of-kep': kepLogo,
  'programming-basics': programmingBasicsLogo,
  'algorithms-i': algorithmsLogo,
  'algorithms-ii': algorithmsLogo,
  'algorithms-iii': algorithmsLogo,
  'competitive-programming-math': mathLogo,
  'implementation-bootcamp': implementationLogo,
  'contest-prep': contestLogo,
  'olympiad-prep-i': olympiadLogo,
  'olympiad-prep-ii': olympiadLogo,
};

export const getStudyPlanBranding = ({
  code,
  icon,
  themeColor,
  themeColorSecondary,
}: StudyPlanBrandingInput, mode: StudyPlanBrandingMode = 'light'): StudyPlanBranding => {
  const lightColor = themeColor || themeColorSecondary || '#0F766E';
  const darkColor = themeColorSecondary || themeColor || '#38BDF8';
  const accentColor = mode === 'dark' ? darkColor : lightColor;

  return {
    iconSrc: defaultIcons[code ?? ''] ?? icon ?? null,
    lightColor,
    darkColor,
    accentColor,
    surfaceColor: alpha(darkColor, mode === 'dark' ? 0.14 : 0.1),
    surfaceStrongColor: alpha(darkColor, mode === 'dark' ? 0.22 : 0.14),
    borderColor: alpha(darkColor, mode === 'dark' ? 0.12 : 0.18),
    progressTrackColor: alpha(darkColor, mode === 'dark' ? 0.24 : 0.12),
  };
};
