import { type HTMLAttributes, type PropsWithChildren } from 'react';
import PatternArtwork, { type PatternArtworkKind } from 'shared/components/common/PatternArtwork';
import { PointerSpotlight } from 'shared/components/motion/InteractionEffects';

export const DashboardPattern = ({
  kind,
  inline = false,
}: {
  kind: PatternArtworkKind;
  inline?: boolean;
}) => (
  <span
    className={`kep-dashboard-pattern${inline ? ' kep-dashboard-pattern-inline' : ''}`}
    aria-hidden="true"
  >
    <PatternArtwork kind={kind} sx={{ width: '100%' }} />
  </span>
);

export const DashboardPanel = ({
  children,
  className = '',
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
  <PointerSpotlight element="section" className={`kep-dashboard-panel ${className}`} {...props}>
    {children}
  </PointerSpotlight>
);
