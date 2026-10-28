import { styled } from '@mui/material';
import { landingFooterStyles } from './footer/landing-footer.styles';
import { landingHeaderStyles } from './landing/landing-header.styles';

export const MainLayoutRoot = styled('div')(() => [
  { display: 'contents' },
  landingHeaderStyles,
  landingFooterStyles,
]);
