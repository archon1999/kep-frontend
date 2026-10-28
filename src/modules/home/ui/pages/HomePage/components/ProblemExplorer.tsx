import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Skeleton, Typography } from '@mui/material';
import { useFeaturedHomeProblems } from 'modules/home/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import { CodeSample, ProblemPreview } from './PlatformPreview';

const InlineWorkspace = lazy(() => import('./InlineWorkspace'));

const ProblemExplorer = () => {
  const { t } = useTranslation();
  const { data } = useFeaturedHomeProblems();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = data?.find((problem) => problem.id === selectedId);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastSelection = useRef<number | null>(null);
  useEffect(() => {
    if (selectedId) {
      lastSelection.current = selectedId;
      panelRef.current?.focus({ preventScroll: true });
    } else if (lastSelection.current) {
      document
        .getElementById('featured-open-' + lastSelection.current)
        ?.focus({ preventScroll: true });
    }
  }, [selectedId]);
  return (
    <div className="kep-explorer">
      <WorkspaceToolbar className="kep-explorer-bar">
        {selected ? (
          <Button
            size="small"
            onClick={() => setSelectedId(null)}
            startIcon={<IconifyIcon icon="mdi:arrow-left" />}
          >
            {t('homePage.landing.workspace.back')}
          </Button>
        ) : (
          <IconifyIcon icon="mdi:code-tags" color="primary.main" aria-hidden="true" />
        )}

        <Typography component="span" variant="label" className="kep-explorer-caption">
          {selected ? selected.title : 'KEP.uz / ' + t('homePage.landing.catalog')}
        </Typography>
      </WorkspaceToolbar>
      <div
        className="kep-explorer-body"
        ref={panelRef}
        tabIndex={-1}
        aria-label={selected ? selected.title : t('homePage.landing.workspace.pick')}
      >
        {selected ? (
          <Suspense fallback={<Skeleton height="100%" variant="rectangular" />}>
            <InlineWorkspace key={selected.id} problem={selected} />
          </Suspense>
        ) : (
          <div className="kep-explorer-preview">
            <ProblemPreview onSelect={setSelectedId} />
            <CodeSample />
          </div>
        )}
      </div>
    </div>
  );
};
export default ProblemExplorer;
