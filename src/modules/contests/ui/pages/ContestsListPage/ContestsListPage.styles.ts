import { Box, styled } from '@mui/material';
import { cardStyles } from './cards.styles';
import { filterStyles } from './filter.styles';
import { heroStyles } from './hero.styles';

export const ContestsListRoot = styled(Box)(() => [heroStyles, cardStyles, filterStyles]);
export const filterOptionsSx = {
  maxHeight: 320,
  '& .MuiMenuItem-root.Mui-selected': {
    background: 'color-mix(in srgb, var(--kep-logo-ice) 12%, transparent)',
    color: 'var(--kep-logo-ice)',
  },
};
